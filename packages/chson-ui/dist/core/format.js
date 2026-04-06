import { getRetrievalDirection } from './document';
function determineFormat(formatHint, isMechanism) {
    if (formatHint)
        return formatHint;
    return isMechanism ? 'code' : 'text';
}
export function inferColumnFormats(data) {
    const retrievalDirection = getRetrievalDirection(data);
    const anchorIsMechanism = retrievalDirection === 'mechanism-to-meaning';
    const anchorFormat = determineFormat(data.formatHints?.anchor, anchorIsMechanism);
    const contentFormat = determineFormat(data.formatHints?.content, !anchorIsMechanism);
    return { anchorFormat, contentFormat };
}
