import _ from 'underscore';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import STCert from 'js/lib/STCert';

/**
 * Join strings with comma and put 'and' for the last string.
 * If you pass `{ symbol: true }` in the options, it will use '&' instead of 'and'.
 */
function prettyJoin(items?: string[], options?: { symbol?: boolean }) {
  const and = options?.symbol ? '&' : 'and';

  if (items) {
    if (items.length > 1) {
      const initialElements = _(items).initial().join(', ');
      const lastElement = _(items).last();
      return [initialElements, and, lastElement].join(' ');
    } else {
      return items.toString();
    }
  }
  return undefined;
}

function addCommas(numberStr: string) {
  return numberStr.replace(/(^|[^\w.])(\d{4,})/g, function ($0, $1, $2) {
    return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,');
  });
}

function makeHttps(url: string) {
  return url.replace(/^http:\/\//i, 'https://');
}

function getUrlParam(url: string, name: string) {
  const fixedName = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const regexS = '[\\?&]' + fixedName + '=([^&#]*)';
  const regex = new RegExp(regexS);
  const results = regex.exec(decodeURI(url));
  if (results === null) {
    return null;
  } else {
    return results[1];
  }
}

/**
 * Remove protocol and trailing slash from a url
 */
function prettifyUrl(url: string) {
  return url.replace(/^.*:\/\//, '').replace(/\/$/, '');
}

/**
 * Concatenate nameObj.first_name, nameObj.middle_name, and nameObj.last_name in
 * such a way that there aren't 2 spaces in the middle when there is no middle
 * name.
 */
function concatName(nameObj: {
  /* eslint-disable camelcase */
  first_name: string;
  middle_name?: string;
  last_name?: string;
  /* eslint-enable camelcase */
}) {
  let fullName = nameObj.first_name;
  if (nameObj.middle_name) {
    fullName = fullName + ' ' + nameObj.middle_name;
  }
  if (nameObj.last_name) {
    fullName = fullName + ' ' + nameObj.last_name;
  }
  return fullName;
}

// see https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
const generateUUID = () => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // eslint-disable-next-line no-bitwise
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    // eslint-disable-next-line no-bitwise
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
  });
  return uuid;
};

const exported = {
  makeHttps,
  prettyJoin,
  getUrlParam,
  prettifyUrl,
  addCommas,
  concatName,
  generateUUID,
  getSTCertCorner: STCert.getSTCertCorner,
  getSTCertIcon: STCert.getSTCertIcon,
};

export default exported;
export { makeHttps, prettyJoin, getUrlParam, prettifyUrl, addCommas, concatName, generateUUID };

export const { getSTCertCorner, getSTCertIcon } = exported;
