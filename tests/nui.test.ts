import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { customFetchNui } from '../src/utils/safeFetch';

declare global {
  interface Window {
    fetchNui?: (method: string, data?: any) => Promise<any>;
    GetParentResourceName?: () => string;
  }
}

beforeEach(() => {
  if (!global.window) {
    global.window = {} as any;
  }
  global.window.fetchNui = vi.fn().mockResolvedValue('success') as Mock;
  global.window.GetParentResourceName = vi.fn().mockReturnValue('testresource') as Mock;
});

describe('customFetchNui', () => {
  it('should use fetchNui if available', async () => {
    const mockFetchNui = vi.fn().mockResolvedValue('success');
    global.window.fetchNui = mockFetchNui;
    const result = await customFetchNui('testMethod', { key: 'value' });
    expect(mockFetchNui).toHaveBeenCalledWith('testMethod', { key: 'value' });
    expect(result).toBe('success');
  });

  it('should return mockData if fetchNui is not available', async () => {
    global.window.fetchNui = undefined;
    const result = await customFetchNui('testMethod', { key: 'value' });
    expect(result).toBeUndefined();
  });
});
