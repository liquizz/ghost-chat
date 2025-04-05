import { Injectable } from '@angular/core';
import { ChatServiceClient } from '../proto/chat.pbsc';
import { GrpcMetadata } from '@ngx-grpc/common';
import { SessionRequest, SessionResponse, MessageRequest, MessageResponse, StreamRequest, KeyRequest, KeyResponse, MessageAck } from '../proto/chat.pb';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private sessionId: string | null = null;
  
  constructor(private grpcClient: ChatServiceClient) {}

  joinChat(pseudonym: string = ''): Observable<SessionResponse> {
    const request = new SessionRequest({ pseudonym });
    return this.grpcClient.joinChat(request, new GrpcMetadata());
  }

  sendMessage(recipientId: string, encryptedPayload: Uint8Array, nonce: Uint8Array): Observable<MessageAck> {
    if (!this.sessionId) {
      throw new Error('Not connected to chat');
    }

    const request = new MessageRequest({
      senderId: this.sessionId,
      recipientId,
      encryptedPayload,
      timestamp: Date.now().toString(),
      nonce
    });

    return this.grpcClient.sendMessage(request, new GrpcMetadata());
  }

  startMessageStream(): Observable<MessageResponse> {
    if (!this.sessionId) {
      throw new Error('Not connected to chat');
    }

    const request = new StreamRequest({
      sessionId: this.sessionId
    });

    return this.grpcClient.messageStream(request, new GrpcMetadata());
  }

  exchangeKey(recipientId: string, keyMaterial: Uint8Array): Observable<KeyResponse> {
    if (!this.sessionId) {
      throw new Error('Not connected to chat');
    }

    const request = new KeyRequest({
      sessionId: this.sessionId,
      recipientId,
      keyMaterial
    });

    return this.grpcClient.keyExchange(request, new GrpcMetadata());
  }

  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }
}