import React = require('react');

// NuiProvider
export const NuiProvider: React.FC<NuiProviderProps>;

// NuiProviderProps
export interface NuiProviderProps {
  resource: string;
  children: React.ReactNode;
}

// NuiContextProps
export interface NuiContextProps {
  resource: string;
}

// useNuiCallback
export function useNuiCallback(
  app: string,
  method: string,
  onSuccess: (data: unknown) => void,
  onError: (err: unknown) => void
): void;

// useNuiEvent
export function useNuiEvent(
  app: string,
  method: string,
  handler: (data: unknown) => void
): void;

// NuiRequestOptions
export interface NuiRequestOptions {
  resource?: string;
  timeout?: number;
  mockData?: unknown;
}

// useNuiRequest
export function useNuiRequest(options?: NuiRequestOptions): {
  send: (method: string, data?: unknown) => Promise<unknown>;
};

// safeFetch
export function safeFetch(
  method: string,
  data?: unknown,
  mockData?: unknown
): Promise<unknown>;

// customFetchNui
export function customFetchNui(
  method: string,
  data?: unknown
): Promise<unknown>;

// debugData
export function debugData(method: string, data: unknown): void;

// debugEvent
export function debugEvent(event: { app: string; method: string; data: unknown }): void;

// Dummy export to satisfy DefinitelyTyped value export rule
export const __DO_NOT_USE: undefined;