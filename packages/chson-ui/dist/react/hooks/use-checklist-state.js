'use client';
import * as React from 'react';
import { defaultChecklistKey } from '../../core/checklist';
export function checklistStorageKey(scope) {
    return `chson-checklist:${scope}`;
}
function loadCheckedKeys(storageKey) {
    if (typeof window === 'undefined')
        return [];
    try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
    }
    catch {
        return [];
    }
}
function saveCheckedKeys(storageKey, checked) {
    if (typeof window === 'undefined')
        return;
    try {
        window.localStorage.setItem(storageKey, JSON.stringify(checked));
    }
    catch {
        // localStorage may be full or unavailable
    }
}
export function useChecklistState(scope, options = {}) {
    const { getKey = defaultChecklistKey } = options;
    const storageKey = checklistStorageKey(scope);
    const [checkedKeys, setCheckedKeys] = React.useState([]);
    React.useEffect(() => {
        setCheckedKeys(loadCheckedKeys(storageKey));
    }, [storageKey]);
    const onCheckedKeysChange = React.useCallback((next) => {
        setCheckedKeys(next);
        saveCheckedKeys(storageKey, next);
    }, [storageKey]);
    return { checkedKeys, onCheckedKeysChange, getKey };
}
