'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SellerAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

export function SellerAvatar({
  name,
  avatarUrl,
  size = 'md',
  className = '',
}: SellerAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const initials =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || '?';

  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

  if (avatarUrl && !hasError) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full border border-border/40 bg-surface-muted shadow-sm select-none ${sizeClass} ${className}`}
      >
        <Image
          src={avatarUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 48px, 64px"
          className="object-cover"
          onError={() => setHasError(true)}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent/10 font-extrabold text-accent border border-accent/20 select-none ${sizeClass} ${className}`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
