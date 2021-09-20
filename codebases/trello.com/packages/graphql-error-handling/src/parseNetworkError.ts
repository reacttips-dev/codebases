import { NetworkError } from './network-error';
import { Errors, ErrorExtensionsType, ErrorExtensions } from './errors';

interface FormattedServerError {
  error?: string;
  message?: string;
}

/**
 * @param message String that looks up the corresponding error code
 * returns extensions
 */
const getCodeFromMessage = (message: string): ErrorExtensionsType | null => {
  for (const key of Object.keys(Errors)) {
    if (message.match(key)) {
      return Errors[key] as ErrorExtensionsType;
    }
  }
  return null;
};

/**
 * @param error Formatted server error from text or json response
 * server could send back an error code thats just "ERROR",
 * which doesn't tell us much. So here, if the code is in
 * the extensions, use that, otherwise, look up the message
 */
const getErrorCode = (
  error: FormattedServerError,
): ErrorExtensionsType | null => {
  if (
    error?.error !== 'UNKNOWN_ERROR' &&
    ErrorExtensions[error?.error as ErrorExtensionsType]
  ) {
    return error.error as ErrorExtensionsType;
  }

  if (error?.message) {
    return getCodeFromMessage(error?.message);
  }

  return null;
};

/**
 * @param error Formatted server error from text or json response
 * @param status Status number from response
 * Will take json and attempt to find NetworkError for it
 */
const parseJSONError = (
  error: FormattedServerError,
  status: number,
): NetworkError => {
  const code = getErrorCode(error);
  return new NetworkError(error.message || '', {
    // this error wouldn't actually be ErrorExtensionsType, since
    // getErrorCode didn't return it. But we want to cast it as that
    // for proper ts lint usage in components.
    code: (code
      ? code
      : error?.error
      ? error?.error
      : 'UNKNOWN_ERROR') as ErrorExtensionsType,
    status,
  });
};

/**
 * @param response response from fetch request that was non 200
 * Takes a response from fetch request and attempts to
 * transform it into an instance of NetworkError
 * to be easily used by consumers in src/components
 */
export const parseNetworkError = async (
  response: Response,
): Promise<NetworkError> => {
  const contentType = response.headers.get('content-type') ?? '';

  let error = null;
  /**
   * Server will some times send a text response, and other
   * times send a json response. We are trying to converge
   * all errors on a standard format, but are not there yet.
   */
  if (contentType.includes('application/json')) {
    try {
      // clone because body can only be read once
      error = await response.clone().json();
      return parseJSONError(error, response.status);
    } catch {
      // noop
    }
  }

  const message = await response.text();
  try {
    error = JSON.parse(message) as FormattedServerError;
    return parseJSONError(error, response.status);
  } catch (e) {
    const code = getCodeFromMessage(message);
    if (code) {
      return new NetworkError(message, {
        code: code as ErrorExtensionsType,
        status: response.status,
      });
    }
  }

  return new NetworkError(message, {
    code: 'UNKNOWN_ERROR' as ErrorExtensionsType,
    status: response.status,
  });
};
