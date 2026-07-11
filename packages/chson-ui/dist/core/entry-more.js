import { safeExternalUrl } from './url';
/** True when an entry should render progressive disclosure content. */
export function hasEntryMore(details, url) {
    if (details)
        return true;
    if (url && safeExternalUrl(url))
        return true;
    return false;
}
