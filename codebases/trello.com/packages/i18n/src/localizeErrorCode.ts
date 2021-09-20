import { forNamespace } from './forNamespace';

export function localizeErrorCode(model: string, code: string) {
  const localizedError = forNamespace(['error handling', model])(code);
  if (Array.isArray(localizedError)) {
    // Could not find the key
    return localizedError.join('').replace(/^error handling\./, '');
  } else {
    return localizedError;
  }
}
