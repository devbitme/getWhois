import { whoisData } from "../stores/whoisStore";

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
