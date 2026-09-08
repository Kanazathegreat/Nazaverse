import React from 'react';

interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className = '' }: WordmarkProps) {
  return (
    <h1
      className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tightest text-primary ${className}`}
    >
      Nazaverse
    </h1>
  );
}
