export const makeHyphensUnbreakable = (text: string) => {
  const unbreakableHyphen = '&#8209;'
  return text.replace(/-/g, unbreakableHyphen)
}
