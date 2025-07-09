import { writable } from 'svelte/store';

// Create store for current record type
export const currentRecordType = writable('WHOIS');

// Create store for current domain
export const currentDomain = writable('');

// Create store for data whois with localStorage persistence
export const whoisData = writable<any>(null);
whoisData.subscribe(value => {
    if (value) {
        localStorage.setItem('whoisData', JSON.stringify(value));
    }
});

// Create store for data rdap with localStorage persistence
export const rdapData = writable<any>(null);
rdapData.subscribe(value => {
    if (value) {
        localStorage.setItem('rdapData', JSON.stringify(value));
    }
});

// Function to download data as JSON
export function downloadData(recordType: string, domain: string) {
    const storageKey = recordType === 'WHOIS' ? 'whoisData' : 'rdapData';
    const data = localStorage.getItem(storageKey);
    
    if (!data) return;
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${domain}_${recordType.toLowerCase()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Function to load data from localStorage on app start
export function loadStoredData() {
    const storedWhoisData = localStorage.getItem('whoisData');
    const storedRdapData = localStorage.getItem('rdapData');
    
    if (storedWhoisData) {
        whoisData.set(JSON.parse(storedWhoisData));
    }
    
    if (storedRdapData) {
        rdapData.set(JSON.parse(storedRdapData));
    }
}