import sanitizeHtml from '../../services/sanitizeHtml';

const HtmlDiv = '<div>';
const HtmlDivEnd = '</div>';

function removeSurroundingDivFromSanitizedHtml(sanitizedData: string) {
    let data = sanitizedData.trim();
    if (
        data.substr(0, HtmlDiv.length).toLowerCase() == HtmlDiv &&
        data.substr(data.length - HtmlDivEnd.length, HtmlDivEnd.length).toLowerCase() == HtmlDivEnd
    ) {
        data = data.substring(HtmlDiv.length, data.length - HtmlDivEnd.length);
    }

    return data;
}

export default async function trySanitizeHtml(data: string): Promise<string> {
    const result: string = await sanitizeHtml(data);
    if (result == null) {
        return null;
    }

    return removeSurroundingDivFromSanitizedHtml(result);
}
