export const safeCiEq = (s1, s2) =>
  (typeof s1 === 'string' ? s1.toLowerCase() : null) ===
  (typeof s2 === 'string' ? s2.toLowerCase() : null);

export const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};
