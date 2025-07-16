import { whoisData } from "../stores/whoisStore";

// Regex pattern for domain validation
const DOMAIN_REGEX = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

// Validate domain format using regex
export const isValidDomain = (domain: string): boolean => {
    if (!domain || domain.trim() === '') {
        return false;
    }
    
    const trimmedDomain = domain.trim();
    
    // Check basic length constraints
    if (trimmedDomain.length > 253) {
        return false;
    }
    
    // Check against regex pattern
    return DOMAIN_REGEX.test(trimmedDomain);
};

// Get domain from current tab
export const getCurrentTabDomain = async () => {
    try {
        const tabs = await browser.tabs.query({
            currentWindow: true,
            active: true
        });

        if (tabs.length > 0 && tabs[0].url) {
            return new URL(tabs[0].url).hostname.replace("www.", "");
        }
        return "example.com";
    } catch (error) {
        console.error("Error getting current tab domain:", error);
        return "example.com";
    }
}