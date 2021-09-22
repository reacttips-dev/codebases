const MAX_PREVIEW_LENGTH = 175;
const TEAMS_BLOB_PREFIX = '_____';

// TODO VSO 113957: Replace CalendarEvent client type with GraphQL CalendarEvent type
// Remove this code once we are consuming  GraphQL CalendarEvent

export default function getDisplayPreviewText(preview: string): string {
    if (!preview) {
        return null;
    }

    // Chop off Teams content from the preview text.
    // The next line is our guess about where the teams blob starts. This could potentially not work in some scenarios, but since it is just preview text
    // in the peek, it's okay to start with this
    const indexWhereTeamsBlobStarts = preview.indexOf(TEAMS_BLOB_PREFIX);

    if (indexWhereTeamsBlobStarts != -1) {
        preview = preview.substring(0, indexWhereTeamsBlobStarts);
    }

    // Trim the preview text
    preview = preview.trim();
    if (preview.length < MAX_PREVIEW_LENGTH) {
        return preview;
    }

    const displayedPreviewText = preview.substr(0, MAX_PREVIEW_LENGTH).trim();

    return displayedPreviewText.length > 0 ? displayedPreviewText.concat('...') : null;
}
