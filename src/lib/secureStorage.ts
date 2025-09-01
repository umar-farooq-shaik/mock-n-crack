// Secure Storage Utility
// Provides encrypted storage for sensitive data

interface SecureStorageOptions {
  encryptionKey?: string;
  useSessionStorage?: boolean;
}

class SecureStorage {
  private encryptionKey: string;
  private useSessionStorage: boolean;

  constructor(options: SecureStorageOptions = {}) {
    // Use a default encryption key if none provided
    this.encryptionKey = options.encryptionKey || 'mock-n-crack-secure-key-2024';
    this.useSessionStorage = options.useSessionStorage || false;
  }

  private getStorage(): Storage {
    return this.useSessionStorage ? sessionStorage : localStorage;
  }

  private encrypt(data: string): string {
    // Simple XOR encryption for demonstration
    // In production, use a proper encryption library like crypto-js
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length));
    }
    return btoa(encrypted); // Base64 encode
  }

  private decrypt(encryptedData: string): string {
    try {
      const decoded = atob(encryptedData); // Base64 decode
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length));
      }
      return decrypted;
    } catch (error) {
      return '';
    }
  }

  setItem(key: string, value: any): void {
    try {
      const encryptedValue = this.encrypt(JSON.stringify(value));
      this.getStorage().setItem(key, encryptedValue);
    } catch (error) {
      // Fallback to unencrypted storage if encryption fails
      this.getStorage().setItem(key, JSON.stringify(value));
    }
  }

  getItem<T = any>(key: string): T | null {
    try {
      const encryptedValue = this.getStorage().getItem(key);
      if (encryptedValue === null) return null;
      
      const decryptedValue = this.decrypt(encryptedValue);
      return JSON.parse(decryptedValue);
    } catch (error) {
      // Try to get unencrypted value as fallback
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
