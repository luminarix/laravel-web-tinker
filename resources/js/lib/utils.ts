import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateRandomArray() {
    const length = Math.floor(Math.random() * (7 - 3 + 1) + 3);

    return Array.from({ length }, () => Math.random());
}

export function valueInStorage(
    storageKey: string,
    tabIndex: number,
    value: string | null | undefined = undefined,
) {
    const storedValueString = localStorage.getItem(storageKey) || '{}';
    let storedValue;

    try {
        storedValue = JSON.parse(storedValueString);
    } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
        storedValue = {};
    }

    if (value === undefined) {
        return storedValue[tabIndex] || '';
    }

    if (value === null) {
        delete storedValue[tabIndex];
    } else {
        storedValue[tabIndex] = value;
    }

    try {
        localStorage.setItem(storageKey, JSON.stringify(storedValue));
    } catch (error) {
        console.error('Error stringifying JSON for localStorage:', error);
    }
}

export function valueInStorageAsNumber(editorValueKey: string): number {
    return parseInt(localStorage.getItem(editorValueKey) || '1');
}

export function valueInStorageAsNumbers(editorValueKey: string): number[] {
    return Object.keys(
        JSON.parse(localStorage.getItem(editorValueKey) || '{}'),
    ).map(Number);
}
