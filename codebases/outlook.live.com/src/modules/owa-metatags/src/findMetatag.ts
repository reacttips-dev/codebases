export default function findMetatag(tagName: string): string | undefined {
    let foundTag;
    const tags = window.document.getElementsByTagName('meta');
    for (var ii = 0; ii < tags.length; ii++) {
        if (tags[ii].name == tagName) {
            foundTag = tags[ii].content;
            break;
        }
    }
    return foundTag;
}
