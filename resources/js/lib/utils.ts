import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomArray() {
    const length = Math.floor(Math.random() * (7 - 3 + 1) + 3);

    return Array.from({ length }, () => Math.random());
}
