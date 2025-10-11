// Secure Storage Utility
// Provides encrypted storage for sensitive data using Web Crypto API

interface SecureStorageOptions {
  encryptionKey?: string;
  useSessionStorage?: boolean;
}

class SecureStorage {
  private encryptionKey: string;
  private useSessionStorage: boolean;
  private cryptoKey: Promise<CryptoKey> | null = null;

  constructor(options: SecureStorageOptions = {}) {
    this.encryptionKey = options.encryptionKey || 'mock-n-crack-secure-key-2024';
    this.useSessionStorage = options.useSessionStorage || false;
    this.initCryptoKey();
  }

  private async initCryptoKey() {
    if (!window.crypto || !window.crypto.subtle) {
      console.warn('Web Crypto API not available, encryption disabled');
      return;
    }

    try {
      const encoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(this.encryptionKey),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      this.cryptoKey = window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('mock-n-crack-salt-2024'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.warn('Failed to initialize encryption key:', error);
      this.cryptoKey = null;
    }
  }

  private getStorage(): Storage {
    return this.useSessionStorage ? sessionStorage : localStorage;
  }

  private async encrypt(data: string): Promise<string> {
    if (!this.cryptoKey) {
      return btoa(data); // Fallback to base64 if crypto not available
    }

    try {
      const key = await this.cryptoKey;
      const encoder = new TextEncoder();
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedData = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(data)
      );

      const combined = new Uint8Array(iv.length + encryptedData.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedData), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.warn('Encryption failed, using fallback:', error);
      return btoa(data);
    }
  }

  private async decrypt(encryptedData: string): Promise<string> {
    if (!this.cryptoKey) {
      try {
        return atob(encryptedData);
      } catch {
        return '';
      }
    }

    try {
      const key = await this.cryptoKey;
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);

      const decryptedData = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      const decoder = new TextDecoder();
      return decoder.decode(decryptedData);
    } catch (error) {
      try {
        return atob(encryptedData);
      } catch {
        return '';
      }
    }
  }

  async setItem(key: string, value: any): Promise<void> {
    try {
      const encryptedValue = await this.encrypt(JSON.stringify(value));
      this.getStorage().setItem(key, encryptedValue);
    } catch (error) {
      console.warn('Failed to encrypt data:', error);
      this.getStorage().setItem(key, JSON.stringify(value));
    }
  }

  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      const encryptedValue = this.getStorage().getItem(key);
      if (encryptedValue === null) return null;
      
      const decryptedValue = await this.decrypt(encryptedValue);
      return JSON.parse(decryptedValue);
    } catch (error) {
      try {
        const value = this.getStorage().getItem(key);
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    }
  }

  removeItem(key: string): void {
    this.getStorage().removeItem(key);
  }

  clear(): void {
    this.getStorage().clear();
  }

  // Secure storage for sensitive data (uses sessionStorage by default)
  static secure = new SecureStorage({ useSessionStorage: true });
  
  // Regular storage for non-sensitive data
  static regular = new SecureStorage({ useSessionStorage: false });
}

export default SecureStorage;
