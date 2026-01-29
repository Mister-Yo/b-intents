type LocalStorageKeys = "slippage" | "ui-theme";

class localStorageService {
  static setItem<T>(key: LocalStorageKeys, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting item to localStorage: ${error}`);
    }
  }

  static getItem<T>(key: LocalStorageKeys): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${error}`);
      return null;
    }
  }

  static removeItem(key: LocalStorageKeys): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${error}`);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage: ${error}`);
    }
  }

  static hasKey(key: LocalStorageKeys): boolean {
    return localStorage.getItem(key) !== null;
  }
}

export default localStorageService;
