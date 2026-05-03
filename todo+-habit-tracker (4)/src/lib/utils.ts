import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserAvatarUrl(seed: string) {
  return `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(seed || 'default')}`;
}
