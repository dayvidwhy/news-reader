export const formatUrl = (url: string | undefined) => {
    if (!url) return "";
    try {
        const formattedUrl = new URL(url).hostname;
        return `(${formattedUrl})`;
    } catch (error) {
        return "";
    }
};
