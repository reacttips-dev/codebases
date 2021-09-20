import { forNamespace } from './forNamespace';

const formatServerError = forNamespace('server error');

const tryParseJsonMessage = (str: string) => {
  try {
    return JSON.parse(str).message;
  } catch (e) {
    return null;
  }
};

export const localizeServerError = (
  resOrString: string | Error | XMLHttpRequest,
) => {
  let message = '';

  // NOTE: In the CoffeeScript version of this function, we are also checking
  // for `resOrString.responseJSON`, but that isn't necessary if we aren't
  // using ApiAjax, which we are not in TypeScript land.
  if (typeof resOrString === 'string') {
    message = tryParseJsonMessage(resOrString) || resOrString;
  } else if (resOrString instanceof XMLHttpRequest) {
    message = resOrString.responseText;
  } else {
    // Error message was passed in
    message = tryParseJsonMessage(resOrString.message) || resOrString.message;
  }

  const localizedError = formatServerError(message);

  if (Array.isArray(localizedError)) {
    // Could not find the key
    return localizedError.join('').replace(/^server error\./, '');
  } else {
    return localizedError;
  }
};
