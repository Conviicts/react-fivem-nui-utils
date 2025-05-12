declare global {
  interface Window {
    GetParentResourceName?: () => string;
    fetchNui?: (method: string, data?: any) => Promise<any>;
  }
}

const mockData: Record<string, any> = {};

export const customFetchNui = async <T>(method: string, data?: any): Promise<T> => {
  if (isNuiEnvironment() && window.GetParentResourceName) {
    try {
      const response = await fetch(`https://${window.GetParentResourceName()}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return (await response.json()) as T;
    } catch (error) {
      console.error('customFetchNui failed:', error);
      throw error;
    }
  }
  console.warn('Using debug data for browser environment:', debugDataStore[method] || mockData);
  return (debugDataStore[method] || mockData) as T;
};

export const debugDataStore: Record<string, any> = {};

export function debugData(method: string, data: any): void {
  debugDataStore[method] = data;
}

export function debugEvent(event: { app: string; method: string; data: any }): void {
  setTimeout(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: event,
      })
    );
  }, 0);
}

export function isNuiEnvironment(): boolean {
  return typeof window.GetParentResourceName === 'function';
}

export async function safeFetch<T>(method: string, data?: any, mockData?: T): Promise<T> {
  return await customFetchNui(method, data);
}
