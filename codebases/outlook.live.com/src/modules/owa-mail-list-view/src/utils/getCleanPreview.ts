import { noPreview } from 'owa-locstrings/lib/strings/getCleanPreview.locstring.json';
import loc from 'owa-localize';

export default function getCleanPreview(preview: string, addEllipsis: boolean = false): string {
    preview = preview || '';

    const underscoreIndex = preview.indexOf('_____');

    // If we detect a _ it means we are likely at the end of the preview and beginning of another message
    // ex: Thanks!_________________ From Christian Piccolo sent on 6 October 2...
    if (underscoreIndex >= 0) {
        preview = preview.slice(0, underscoreIndex);
    }

    // Remove  ¯, multiple --, and replace multiple spaces (\s) with just one space.
    preview = preview.replace(/¯/g, '').replace(/--/g, '').replace(/\s\s+/g, ' ').trim();

    return preview.length > 0 ? preview + (addEllipsis ? '...' : '') : loc(noPreview);
}
