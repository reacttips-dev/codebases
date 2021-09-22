import CMLUtils from 'bundles/cml/utils/CMLUtils';
import { CmlContent } from 'bundles/cml/types/Content';

const exported = {
  /**
   * Convert plain text from a textarea to CML
   * @param  {string} plainText
   * @param  {string} dtdId
   * @return {CMLtext}           converted text. Returns False if conversion fails
   */
  toCML(plainText: string, dtdId: string): CmlContent {
    // Replace every line break (return) with `</text><text>`
    const replacedText = plainText.replace(/\n/g, '</text><text>');

    // Add opening and closing <text> and <co-content> tags at beginning and end of the string
    const cmlText = '<co-content><text>' + replacedText + '</text></co-content>';

    // TODO: check that it's valid cml?
    return CMLUtils.create(cmlText, dtdId);
  },

  /**
   * Converts CML into plain text for display in a textarea
   * @param  {CML} cml [description]
   * @return {string | false}  plain text or false if it fails
   */
  toPlainText(cml?: CmlContent | null): string | false {
    if (!cml) {
      return '';
    }

    const cmlText = CMLUtils.getValue(cml);
    // Remove the wrapping <co-content> tags
    const plainText = cmlText
      .replace(/<\/?co-content>/g, '')
      // Remove all opening <text> tags
      .replace(/<text>/g, '')
      // Remove the trailing </text> tag, since it was wrapping the entire text
      .replace(/<\/text>$/, '')
      // Replace all </text>'s with line breaks
      .replace(/<\/text>/g, String.fromCharCode(10))
      .replace(/<text\/>/g, String.fromCharCode(10));
    // Check that no other tags remain
    if (/<\S?\S>/g.test(plainText)) {
      return false;
    } else {
      return plainText;
    }
  },
};

export default exported;

export const { toCML, toPlainText } = exported;
