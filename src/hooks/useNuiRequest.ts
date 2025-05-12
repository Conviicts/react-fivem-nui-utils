import { debugData, isNuiEnvironment, debugDataStore } from '../utils/safeFetch';

interface NuiRequestOptions<T> {
  resource?: string;
  timeout?: number;
  mockData?: T;
}

export function useNuiRequest<T = any>(options?: NuiRequestOptions<T>) {
  const send = async (method: string, data?: any): Promise<T> => {
    if (isNuiEnvironment()) {
      return await window.fetchNui!(method, data);
    }
    console.warn('Using debug data for browser environment:', debugDataStore[method]);
    return debugDataStore[method] as T;
  };

  return { send };
}
