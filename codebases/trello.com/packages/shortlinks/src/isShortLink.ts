export function isShortLink(shortLink: string) {
  return typeof shortLink === 'string' && /^[a-zA-Z0-9]{8}$/.test(shortLink);
}
