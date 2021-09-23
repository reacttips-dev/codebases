export function getKey(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(error);
    return null;
  }
}
export function setKey(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(error);
  }
}
export function getBooleanKey(key) {
  return getKey(key) === 'true';
}