import { writable } from 'svelte/store';

// Create store for current record type
export const currentRecordType = writable('WHOIS');

// Create store for current domain
export const currentDomain = writable('');

// Create store for data whois
export const whoisData = writable<any>(null);

// Create store for data rdap
export const rdapData = writable<any>(null);