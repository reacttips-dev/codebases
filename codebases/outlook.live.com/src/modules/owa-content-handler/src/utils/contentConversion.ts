const BR_TAG_NAME = '<BR>';
const NEW_LINE_REGEX = new RegExp('\\n|\\r\\n', 'g');

export function replaceLineBreaksWithBrTags(string: string): string {
    return string.replace(NEW_LINE_REGEX, BR_TAG_NAME);
}
