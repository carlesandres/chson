export function getSections(data) {
    const sections = data.sections;
    return Array.isArray(sections) ? sections : [];
}
export function getEntries(section) {
    const entries = section.entries;
    return Array.isArray(entries) ? entries : [];
}
