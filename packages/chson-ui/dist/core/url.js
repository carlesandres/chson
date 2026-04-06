export function safeExternalUrl(url) {
    try {
        const parsed = new URL(url);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:') {
            return parsed.toString();
        }
        return null;
    }
    catch {
        return null;
    }
}
