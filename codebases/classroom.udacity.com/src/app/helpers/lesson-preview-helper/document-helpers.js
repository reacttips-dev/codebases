/**
 *
 * Retrieve Google Document Id from give string
 * can be a Google Document link or Google Document Id
 * @param {String} link
 * @returns {String} gdocId
 */
export function retrieveGDocId(link) {
    const matches = link.match(/[-\w]{25,}/);
    if (matches && matches[0]) {
        return matches[0];
    }
    return link;
}