'use client';

import React from 'react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#eceef1] flex items-center justify-center md:py-3 p-0 overflow-y-auto">
      {/* Centered Mobile Web Viewport - always fits within viewport */}
      <div className="w-full max-w-[420px] h-[100dvh] md:h-[min(880px,calc(100vh-24px))] bg-[#f7f9fc] md:rounded-[36px] shadow-[0_16px_48px_rgba(0,37,110,0.14)] md:border md:border-[#bcc8d0]/40 overflow-hidden relative flex flex-col shrink-0">
        {children}
      </div>
    </div>
  );
};

