import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private keyPair: CryptoKeyPair | null = null;
  private sharedKeys: Map<string, CryptoKey> = new Map();

  async generateKeyPair(): Promise<Uint8Array> {
    try {
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
    } catch (error) {
      console.error('Error generating key pair:', error);
      throw error;
    }
  }

  async deriveSharedKey(recipientId: string, publicKeyBytes: Uint8Array): Promise<void> {
    try {
      if (!this.keyPair) {
        throw new Error('No key pair available');
      }

      // Validate public key length - P-256 public keys are 65 bytes in uncompressed format
      if (publicKeyBytes.length !== 65) {
        throw new Error(`Invalid public key length: ${publicKeyBytes.length} bytes. Expected 65 bytes.`);
      }

      // Check if the key starts with 0x04 (uncompressed point format)
      if (publicKeyBytes[0] !== 0x04) {
        throw new Error('Invalid public key format: expected uncompressed point format');
      }

      // Import recipient's public key
      let publicKey: CryptoKey;
      try {
        publicKey = await crypto.subtle.importKey(
          'raw',
          publicKeyBytes,
          {
            name: 'ECDH',
            namedCurve: 'P-256'
          },
          true,
          []
        );
      } catch (error) {
        console.error('Error importing public key:', error);
        throw new Error('Failed to import public key. Make sure it is a valid P-256 key.');
      }

      // Derive shared secret
      try {
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
      } catch (error) {
        console.error('Error deriving shared key:', error);
        throw new Error('Failed to derive shared key from public key');
      }
    } catch (error) {
      console.error('Error deriving shared key:', error);
      throw error;
    }
  }

  async encryptMessage(recipientId: string, message: string): Promise<{ encryptedData: Uint8Array, nonce: Uint8Array }> {
    try {
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
    } catch (error) {
      console.error('Error encrypting message:', error);
      throw error;
    }
  }

  async decryptMessage(senderId: string, encryptedData: Uint8Array, nonce: Uint8Array): Promise<string> {
    try {
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
    } catch (error) {
      console.error('Error decrypting message:', error);
      throw error;
    }
  }

  hasSharedKeyWith(peerId: string): boolean {
    return this.sharedKeys.has(peerId);
  }
}