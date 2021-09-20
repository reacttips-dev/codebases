export function isShortId(id: string | number) {
  return /^[0-9]{1,8}$/.test(id.toString());
}
