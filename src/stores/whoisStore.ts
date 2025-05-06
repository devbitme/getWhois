import { writable } from 'svelte/store';

// Create store for current domain
export const currentDomain = writable('example.com');