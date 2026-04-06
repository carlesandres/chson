export function getDocumentType(data) {
    return (data.documentType ?? 'cheatsheet');
}
export function getLabels(data) {
    return {
        anchorLabel: data.anchorLabel || 'Anchor',
        contentLabel: data.contentLabel || 'Content',
    };
}
export function getRetrievalDirection(data) {
    return data.retrievalDirection ?? 'mechanism-to-meaning';
}
