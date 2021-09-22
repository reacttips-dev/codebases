const imagesWithOriginalSrc = new RegExp(
    '<IMG[^>]+?ORIGINALSRC\\s*=\\s*"[\\s\\S]+?"[\\s\\S]*?>',
    'gim'
);

// Bug 46886: Keep the src for inline image when send
// https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/46886
// Keep the src unless it starts with "DATA:". Inline image shouldn't start with data:
const srcAttribute = new RegExp('\\sSRC\\s*=\\s*"DATA:[\\s\\S]+?"', 'im');
const originalSrcAttribute = new RegExp('\\sORIGINALSRC\\s*=\\s*"', 'im');

/**
 * Reference code: chicago\sources\Dev\Owa\src\Client\Boot\Framework\Utils\StringUtilities.cs
 * Removes src attribute and optionally renames originalSrc attribute with src attribute
 * @html is the html body of the mail
 * @renameOriginalSrc flag denotes if we want to rename originalSrc to src. This is required because
 * when we want to create a S/MIME message, the S/MIME control ignores the originalSrc attribute in
 * mail body and instead expects src attribute for <img> tags
 */
export default function removeSrcAttributeFromInlineImages(
    html: string,
    renameOriginalSrc?: boolean
): string {
    if (html) {
        return html.replace(imagesWithOriginalSrc, function (imgTagStr: string) {
            imgTagStr = imgTagStr.replace(srcAttribute, '');
            if (renameOriginalSrc) {
                imgTagStr = imgTagStr.replace(originalSrcAttribute, ' src="');
            }
            return imgTagStr;
        });
    } else {
        return html;
    }
}
