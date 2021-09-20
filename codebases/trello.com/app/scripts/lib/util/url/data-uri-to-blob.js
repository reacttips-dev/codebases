/* eslint-disable
    eqeqeq,
    @trello/disallow-filenames,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// data:[<MIME-type>][;charset=<encoding>][;base64],<data>
module.exports.dataUriToBlob = function (uri) {
  const [header, base64] = Array.from(uri.split(','));

  const parsedHeader = new RegExp(`\
data:\
([^;]+)\
(?:;charset=([^;]*))?\
(;base64)?\
`).exec(header);

  if (parsedHeader != null) {
    const [, mimeType, encoding, isBase64] = Array.from(parsedHeader);
    if (!isBase64) {
      throw Error('Unable to handle non-base64 URIs');
    }
    if (encoding != null) {
      throw Error('Unable to handle encodings');
    }

    const binary = atob(base64);

    const array = Array.from(binary).map((c) => c.charCodeAt(0));

    return new Blob([new Uint8Array(array)], { type: mimeType });
  } else {
    throw Error('Invalid data URI');
  }
};
