import React, { createContext, ReactNode } from 'react';

interface NuiContextProps {
  resource: string;
}

export const NuiContext = createContext<NuiContextProps | undefined>(undefined);

export const NuiProvider: React.FC<{ resource: string; children: ReactNode }> = ({ resource, children }) => {
  return (
    <NuiContext.Provider value={{ resource }}>
      {children}
    </NuiContext.Provider>
  );
};
