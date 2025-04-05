import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { EncryptionService } from '../../services/encryption.service';
import { ChatMessage } from '../../models/message';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit, OnDestroy {
  pseudonym: string = '';
  recipientId: string = '';
  messageText: string = '';
  messages: ChatMessage[] = [];
  isConnected: boolean = false;
  
  private destroy$ = new Subject<void>();
  private ongoingKeyExchanges = new Set<string>();

  constructor(
    private chatService: ChatService,
    private encryptionService: EncryptionService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async connect() {
    try {
      // Generate encryption keys
      const publicKey = await this.encryptionService.generateKeyPair();
      
      // Join chat with pseudonym
      this.chatService.joinChat(this.pseudonym)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: async (response) => {
            if (response.success) {
              this.chatService.setSessionId(response.sessionId);
              this.isConnected = true;
              this.startListeningForMessages();
            } else {
              console.error('Failed to join chat:', response.errorMessage);
            }
          },
          error: (error) => {
            console.error('Error joining chat:', error);
          }
        });
    } catch (error) {
      console.error('Error during connection:', error);
    }
  }

  private startListeningForMessages() {
    this.chatService.startMessageStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (message) => {
          try {
            // Handle key exchange request notifications
            if (message.isKeyExchangeRequest) {
              if (!this.encryptionService.hasSharedKeyWith(message.senderId) && 
                  !this.ongoingKeyExchanges.has(message.senderId)) {
                console.log(`Received key exchange request from ${message.senderId}, initiating exchange...`);
                await this.initiateKeyExchange(message.senderId);
              }
              return;
            }

            // Normal message handling
            if (!this.encryptionService.hasSharedKeyWith(message.senderId)) {
              // If not, initiate key exchange only if not already in progress
              if (!this.ongoingKeyExchanges.has(message.senderId)) {
                await this.initiateKeyExchange(message.senderId);
              }
              return; // Don't try to decrypt the message until we have a key
            }

            // Decrypt the message
            const decryptedContent = await this.encryptionService.decryptMessage(
              message.senderId,
              message.encryptedPayload,
              message.nonce
            );

            // Add message to the list
            this.messages.push({
              id: message.messageId,
              senderId: message.senderId,
              content: decryptedContent,
              timestamp: parseInt(message.timestamp),
              isSent: false
            });
          } catch (error) {
            console.error('Error processing incoming message:', error);
          }
        },
        error: (error) => {
          console.error('Message stream error:', error);
          this.isConnected = false;
        }
      });
  }

  async sendMessage() {
    if (!this.messageText || !this.recipientId) return;

    try {
      // Check if we have a shared key with the recipient
      if (!this.encryptionService.hasSharedKeyWith(this.recipientId)) {
        // If not, initiate key exchange
        await this.initiateKeyExchange(this.recipientId);
      }

      // Encrypt the message
      const { encryptedData, nonce } = await this.encryptionService.encryptMessage(
        this.recipientId,
        this.messageText
      );

      // Store message content before clearing
      const messageContent = this.messageText;
      this.messageText = '';

      // Send the encrypted message
      this.chatService.sendMessage(this.recipientId, encryptedData, nonce)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (ack) => {
            if (ack.success) {
              // Add message to the list
              this.messages.push({
                id: ack.messageId,
                senderId: this.chatService.getSessionId()!,
                content: messageContent,
                timestamp: parseInt(ack.serverTimestamp),
                isSent: true
              });
            } else {
              console.error('Failed to send message:', ack.errorMessage);
              // Restore message text on failure
              this.messageText = messageContent;
            }
          },
          error: (error) => {
            console.error('Error sending message:', error);
            // Restore message text on error
            this.messageText = messageContent;
          }
        });
    } catch (error) {
      console.error('Error encrypting or sending message:', error);
    }
  }

  private async initiateKeyExchange(peerId: string): Promise<void> {
    try {
        // Don't start a new key exchange if we already have one in progress
        if (this.ongoingKeyExchanges.has(peerId)) {
            console.log(`Key exchange already in progress with ${peerId}`);
            return;
        }

        // Add to ongoing exchanges
        this.ongoingKeyExchanges.add(peerId);

        // Generate and export our public key
        const publicKey = await this.encryptionService.generateKeyPair();

        // Return a promise that resolves when key exchange is complete
        return new Promise((resolve, reject) => {
            const attemptKeyExchange = (attempt: number = 1, maxAttempts: number = 10) => {
                if (attempt > maxAttempts) {
                    this.ongoingKeyExchanges.delete(peerId); // Clean up
                    reject(new Error(`Key exchange failed after ${maxAttempts} attempts`));
                    return;
                }

                this.chatService.exchangeKey(peerId, publicKey)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: async (response) => {
                            if (response.success) {
                                // Check if keyMaterial exists and has content (not empty)
                                if (response.keyMaterial?.length > 0) {
                                    try {
                                        // Use the received public key to derive shared secret
                                        await this.encryptionService.deriveSharedKey(peerId, response.keyMaterial);
                                        this.ongoingKeyExchanges.delete(peerId); // Clean up
                                        resolve();
                                    } catch (error) {
                                        console.error('Error deriving shared key:', error);
                                        // If we fail to derive the key, we should retry
                                        setTimeout(() => {
                                            attemptKeyExchange(attempt + 1, maxAttempts);
                                        }, Math.min(1000 * attempt, 5000));
                                    }
                                } else {
                                    // Server indicates the other client's key is not available yet
                                    console.log(`Key exchange attempt ${attempt}: Waiting for peer key...`);
                                    // Wait and retry with exponential backoff
                                    setTimeout(() => {
                                        attemptKeyExchange(attempt + 1, maxAttempts);
                                    }, Math.min(1000 * Math.pow(1.5, attempt - 1), 10000));
                                }
                            } else {
                                // If the error indicates the peer doesn't exist, fail immediately
                                if (response.errorMessage?.includes('not found')) {
                                    this.ongoingKeyExchanges.delete(peerId); // Clean up
                                    reject(new Error(response.errorMessage));
                                } else {
                                    // For other errors, retry
                                    setTimeout(() => {
                                        attemptKeyExchange(attempt + 1, maxAttempts);
                                    }, Math.min(1000 * attempt, 5000));
                                }
                            }
                        },
                        error: (error) => {
                            // For network errors, retry
                            setTimeout(() => {
                                attemptKeyExchange(attempt + 1, maxAttempts);
                            }, Math.min(1000 * attempt, 5000));
                        }
                    });
            };

            // Start the key exchange process
            attemptKeyExchange();
        });
    } catch (error) {
        this.ongoingKeyExchanges.delete(peerId); // Clean up
        console.error('Error initiating key exchange:', error);
        throw error;
    }
}

  disconnect() {
    this.isConnected = false;
    this.messages = [];
    this.destroy$.next();
  }
}