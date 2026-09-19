import React from 'react';
import { cn } from '@/lib/utils';
import './orb.css';

export type VoiceState = 'idle' | 'listening' | 'speaking' | 'thinking';

interface PulseOrbProps {
  state: VoiceState;
  className?: string;
  onClick?: () => void;
}

export function PulseOrb({ state, className, onClick }: PulseOrbProps) {
  
  // Dynamic text based on AI state
  const stateText = {
    idle: "SAARTHI",
    listening: "LISTEN",
    thinking: "THINKING",
    speaking: "SPEAK",
  };

  const currentWord = stateText[state];
  const letters = currentWord.split('');

  // Use intense fast rotation for active states, slow calm rotation for idle
  const loaderClass = state === 'idle' ? 'loader state-idle' : 'loader state-active';

  return (
    <div
      onClick={onClick}
      className={cn("loader-wrapper group", className)}
    >
      {letters.map((letter, i) => (
        <span key={i} className={`loader-letter ${state === 'idle' ? 'text-[#FFB800]' : ''}`}>{letter}</span>
      ))}
      <div className={loaderClass}></div>
    </div>
  );
}
