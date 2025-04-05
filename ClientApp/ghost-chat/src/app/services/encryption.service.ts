import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private keyPair: CryptoKeyPair | null = null;
  private sharedKeys: Map<string, CryptoKey> = new Map();

  async generateKeyPair(): Promise<Uint8Array> {
    // Generate ECDH key pair
    this.keyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      ['deriveKey']
    );

    // Export public key for sharing
    const publicKeyBuffer = await crypto.subtle.exportKey(
      'raw',
      this.keyPair.publicKey
    );
    
    return new Uint8Array(publicKeyBuffer);
  }

  async deriveSharedKey(recipientId: string, publicKeyBytes: Uint8Array): Promise<void> {
    if (!this.keyPair) {
      throw new Error('No key pair available');
    }

    // Import recipient's public key
    const publicKey = await crypto.subtle.importKey(
      'raw',
      publicKeyBytes,
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      []
    );

    // Derive shared secret
    const sharedKey = await crypto.subtle.deriveKey(
      {
        name: 'ECDH',
        public: publicKey
      },
      this.keyPair.privateKey,
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    );

    this.sharedKeys.set(recipientId, sharedKey);
  }

  async encryptMessage(recipientId: string, message: string): Promise<{ encryptedData: Uint8Array, nonce: Uint8Array }> {
    const sharedKey = this.sharedKeys.get(recipientId);
    if (!sharedKey) {
      throw new Error('No shared key for recipient');
    }

    // Generate nonce
    const nonce = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the message
    const encodedMessage = new TextEncoder().encode(message);
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: nonce
      },
      sharedKey,
      encodedMessage
    );

    return {
      encryptedData: new Uint8Array(encryptedData),
      nonce
    };
  }

  async decryptMessage(senderId: string, encryptedData: Uint8Array, nonce: Uint8Array): Promise<string> {
    const sharedKey = this.sharedKeys.get(senderId);
    if (!sharedKey) {
      throw new Error('No shared key for sender');
    }

    // Decrypt the message
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: nonce
      },
      sharedKey,
      encryptedData
    );

    return new TextDecoder().decode(decryptedData);
  }

  hasSharedKeyWith(peerId: string): boolean {
    return this.sharedKeys.has(peerId);
  }
}