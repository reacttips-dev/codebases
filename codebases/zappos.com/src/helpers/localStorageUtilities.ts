import { logDebug } from 'middleware/logger';

// Don't use these directly unless you really need to.  Otherwise you should go through the
// localStorage reducer as it puts the data into redux and also saves to/ hydrates from localStorage automatically
export const loadFromLocalStorage = <T>(key: string, fallback?: T) => {
  try {
    const serializedData = window.localStorage.getItem(key);
    if (serializedData === null) {
      return fallback;
    }
    return JSON.parse(serializedData);
  } catch (err) {
    logDebug('Local storage not enabled for this user', err);
    return fallback;
  }
};

export const saveToLocalStorage = (key: string, data: any) => {
  try {
    const serializedData = JSON.stringify(data);
    window.localStorage.setItem(key, serializedData);
  } catch (err) {
    logDebug('Local storage not enabled for this user', err);
  }
};
