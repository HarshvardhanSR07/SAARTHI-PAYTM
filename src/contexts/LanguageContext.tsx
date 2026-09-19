'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LanguageCode = 
  | 'en-IN' | 'hi-IN' | 'bn-IN' | 'ta-IN' 
  | 'te-IN' | 'kn-IN' | 'ml-IN' | 'mr-IN' 
  | 'gu-IN' | 'pa-IN' | 'od-IN';

interface LanguageContextType {
  appLanguage: LanguageCode;
  speechLanguage: LanguageCode;
  setAppLanguage: (lang: LanguageCode) => void;
  setSpeechLanguage: (lang: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [appLanguage, setAppLanguage] = useState<LanguageCode>('en-IN');
  const [speechLanguage, setSpeechLanguage] = useState<LanguageCode>('hi-IN');

  return (
    <LanguageContext.Provider
      value={{
        appLanguage,
        speechLanguage,
        setAppLanguage,
        setSpeechLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
