import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { getDocumentType } from '../../core/document';
import { Bookmarks } from './bookmarks';
import { Cheatsheet } from './cheatsheet';
import { Checklist } from './checklist';
import { Runbook } from './runbook';
import { Tldr } from './tldr';
export function ChsonRenderer({ data, className, checklist }) {
    const type = getDocumentType(data);
    switch (type) {
        case 'checklist':
            return _jsx(Checklist, { data: data, className: className, ...checklist });
        case 'runbook':
            return _jsx(Runbook, { data: data, className: className });
        case 'tldr':
            return _jsx(Tldr, { data: data, className: className });
        case 'bookmarks':
            return _jsx(Bookmarks, { data: data, className: className });
        case 'cheatsheet':
        default:
            return _jsx(Cheatsheet, { data: data, className: className });
    }
}
