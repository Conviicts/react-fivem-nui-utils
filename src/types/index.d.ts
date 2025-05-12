import React from 'react';

// Types for NuiProvider
export interface NuiProviderProps {
  resource: string;
  children: React.ReactNode;
}

// Types for NuiContextProps
export interface NuiContextProps {
  resource: string;
}

// Types for useNuiCallback
export interface NuiCallbackOptions {
  app: string;
  method: string;
  onSuccess: (data: any) => void;
  onError: (err: any) => void;
}

// Types for useNuiEvent
export type NuiEventHandler = (data: any) => void;

export interface NuiEventOptions {
  app: string;
  method: string;
  handler: (data: any) => void;
}

// Types for useNuiRequest
export interface NuiRequestOptions<T> {
  resource?: string;
  timeout?: number;
  mockData?: T;
}

// Types for safeFetch
export type SafeFetchFunction = <T>(method: string, data?: any, mockData?: T) => Promise<T>;

// Types for customFetchNui
export type CustomFetchNui = <T>(method: string, data?: any) => Promise<T>;

// Types for debugData and debugEvent
export type DebugData = (method: string, data: any) => void;
export type DebugEvent = (event: { app: string; method: string; data: any }) => void;