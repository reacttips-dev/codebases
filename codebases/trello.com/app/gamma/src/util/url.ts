/* eslint-disable @trello/disallow-filenames */
import { attachmentsDomain } from '@trello/config';
import { CardModel } from '../types/models';
import { isShortId } from '@trello/shortlinks';

export const makeLocalUrl = (url: string) =>
  url.replace(/^[a-z]+:\/\/[^/]+/, '');

export const isLocalUrl = (url: string) => /^\/([_a-z0-9]|$|\?)/.test(url);

const removeAccents = (s: string) => {
  return s
    .replace(/[àáâãäåāăą]/g, 'a')
    .replace(/æ/g, 'ae')
    .replace(/[çćĉċč]/g, 'c')
    .replace(/[ďđ]/g, 'd')
    .replace(/[èéêëēĕėęě]/g, 'e')
    .replace(/[ĝğġģ]/g, 'g')
    .replace(/[ĥħ]/g, 'h')
    .replace(/[ìíîïĩīĭįı]/g, 'i')
    .replace(/[ñńņňŉŋ]/g, 'n')
    .replace(/[òóôõöōŏő]/g, 'o')
    .replace(/œ/g, 'oe')
    .replace(/ř/g, 'r')
    .replace(/[śŝşš]/g, 's')
    .replace(/ß/g, 'ss')
    .replace(/[ùúûüũūŭůűų]/g, 'u')
    .replace(/[ýÿ]/g, 'y');
};

export const makeSlug = (s: string, sep = '-') => {
  let slug = '';
  if (s) {
    slug = removeAccents(s.toLowerCase())
      .replace(/[^a-z0-9]+/gi, sep)
      .replace(new RegExp(`//^${sep}|${sep}$//`, 'g'), '');

    if (slug.length > 128) {
      slug = slug.substr(0, 128);
    }
  }

  return slug || sep;
};

export const isBoardPath = (path: string) => {
  return path && path.indexOf('/b/') === 0;
};

export const isCardPath = (path: string) => {
  return path && path.indexOf('/c/') === 0;
};

export const boardShortLinkFromUrl = (path: string) => {
  return isBoardPath(path) ? path.substr(3, 8) : undefined;
};

export const boardUrlFromShortLink = (shortLink: string, name: string) => {
  const nameSlug = name ? `/${makeSlug(name)}` : '';

  return `/b/${shortLink}${nameSlug}`;
};

export const getCardUrlWithoutModels = function (
  idBoard: string,
  idCard: number | string | null,
  cardName: string,
) {
  if (idCard === null) {
    return null;
  } else if (isShortId(idCard)) {
    return `/card/${makeSlug(cardName)}/${idBoard}/${idCard}`;
  } else {
    return `/card/board/${makeSlug(cardName)}/${idBoard}/${idCard}`;
  }
};

export const getCardUrl = (
  card: CardModel,
  highlight?: string,
  replyToComment?: boolean,
) => {
  let baseUrl = '';

  if (card.url) {
    baseUrl = makeLocalUrl(card.url);
  } else {
    baseUrl =
      getCardUrlWithoutModels(
        card.idBoard || '',
        card.idShort || card.id,
        card.name || '',
      ) || '';
  }

  if (replyToComment) {
    return `${baseUrl}?replyToComment=${replyToComment}`;
  } else if (highlight) {
    return `${baseUrl}#${highlight}`;
  } else {
    return baseUrl;
  }
};

export const cardUrlFromShortLink = (shortLink: string) => {
  return `/c/${shortLink}`;
};

export const cardShortLinkFromUrl = (path: string) => {
  return isCardPath(path) ? path.substr(3, 8) : undefined;
};

export const dataURItoBlob = (dataURI: string) => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], { type: mimeString });

  return blob;
};

export const escapeReturnUrl = (url: string) =>
  encodeURIComponent(url.replace(/^https?:\/\/[^/]+/, ''));

export const isUrl = (text: string): boolean =>
  // Must start with an http/https protocol
  // Can't contain any whitespace
  /^https?:\/\/\S+$/.test(text);

export const isTrelloUrl = (
  url: string,
  overrideTrelloHost: string = location.host,
): boolean => {
  try {
    return new URL(url).host === overrideTrelloHost;
  } catch (e) {
    return false;
  }
};

export const isTrelloAttachmentUrl = (url: string): boolean => {
  if (url.indexOf(attachmentsDomain) === 0) {
    return true;
  }
  try {
    return (
      !!new URL(url).pathname.match(
        /^\/1\/cards\/[a-f0-9]{24}\/attachments\/[a-f0-9]{24}\/download\/.*/,
      ) && isTrelloUrl(url)
    );
  } catch (e) {
    return false;
  }
};

export const urlEncode = (str: string): string => {
  type specialChars = '!' | "'" | '(' | ')' | '~' | '%20' | '%00';
  const specialCharsMap: { [key in specialChars]: string } = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00',
  };

  return encodeURIComponent(str).replace(
    /[!'()~]|%20|%00/g,
    (match: specialChars): string => specialCharsMap[match],
  );
};

/*
 * MS EdgeHTML 17 does not properly encode URLSearchParams if they include a space
 * character. Due to this, URL::toString() may throw. Catch for this here and
 * build up the url string manually.
 * https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/17865834/
 */
export const urlToString = (url: URL): string => {
  try {
    return url.toString();
  } catch (e) {
    const search = [...url.searchParams.entries()]
      .map(([key, value]) => `${urlEncode(key)}=${urlEncode(value)}`)
      .join('&');

    return `${url.protocol}//${url.host}${url.pathname}?${search}`;
  }
};
