import { getEntries, getSections } from './normalize';
export function defaultChecklistKey({ sectionIndex, entryIndex }) {
    return `${sectionIndex}-${entryIndex}`;
}
export function countChecklistEntries(data) {
    return getSections(data).reduce((sum, section) => sum + getEntries(section).length, 0);
}
export function countCheckedEntries(data, checkedKeys, getKey) {
    const sections = getSections(data);
    let count = 0;
    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
        const section = sections[sectionIndex];
        const entries = getEntries(section);
        for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
            const entry = entries[entryIndex];
            const key = getKey({
                sectionIndex,
                entryIndex,
                sectionTitle: section.title,
                anchor: entry.anchor,
                content: entry.content,
            });
            if (checkedKeys.has(key))
                count++;
        }
    }
    return count;
}
export function progressPercent(checked, total) {
    if (total <= 0)
        return 0;
    return Math.round((checked / total) * 100);
}
