import fetch from 'isomorphic-fetch';

export function postMartyPixel(qs, fetcher = fetch) {
  const reqUrl = `/martypixel?${qs}`;
  return fetcher(reqUrl, {
    method: 'POST',
    credentials: 'include'
  });
}
