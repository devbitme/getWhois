
export const getInfosWhois = async (domain: string): Promise<any> => {
    const response = await fetch(`https://api.devbit.me/whois/domain?domain=${domain}`);

    if (!response.ok) {
        // throw new Error('Network response was not ok');
        return;
    }

    try {
        const data = await response.json();
        return data;
    } catch (e) {
        // If not JSON, get as text
        const text = await response.text();
        const textData = { raw: text };
        return textData;
    }
};

export const getInfosRDAP = async (domain: string): Promise<any> => {
    const response = await fetch(`https://www.rdap.net/domain/${domain}`);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    try {
        const data = await response.json();
        return data;
    } catch (e) {
        // If not JSON, get as text
        const text = await response.text();
        const textData = { raw: text };
        return textData;
    }
}