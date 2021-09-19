import logger, { logError, logToServer } from 'middleware/logger';

export const ERROR_WEBLAB_TRIGGER_NON_200 = 'ERROR_WEBLAB_TRIGGER_NON_200';
export const ERROR_AKITA_ESTIMATE_NON_200 = 'ERROR_AKITA_ESTIMATE_NON_200';
export const ERROR_CANNOT_CONFIRM_PURCHASE_OOS = 'ERROR_CANNOT_CONFIRM_PURCHASE_OOS';
export const ERROR_CANNOT_CONFIRM_PURCHASE_OTHER = 'ERROR_CANNOT_CONFIRM_PURCHASE_OTHER';
export const ERROR_EMPTY_CART = 'ERROR_EMPTY_CART';
export const ERROR_NOT_AUTHENTICATED = 'ERROR_NOT_AUTHENTICATED';
export const ERROR_QUANTITY_CHANGE_REQUEST_VALIDATION = 'ERROR_QUANTITY_CHANGE_REQUEST_VALIDATION';
export const ERROR_REQUEST_VALIDATION = 'ERROR_REQUEST_VALIDATION';
export const ERROR_PURCHASE_NOT_FOUND = 'ERROR_PURCHASE_NOT_FOUND';
export const ERROR_INVALID_GIFT_OPTIONS = 'ERROR_INVALID_GIFT_OPTIONS';
export const CHECKOUT_GIFT_OPTIONS_ERROR = 'checkout.input.invalid';
export const CHECKOUT_QUANTITY_CHANGE_ERROR = 'quantity.invalid';
export const CHECKOUT_EMPTY_CART_ERROR = 'checkout.cart.empty';
export const CHECKOUT_CV_EXISTS_ON_FINALIZE_ERROR = 'constraint.violations.exist';
export const CHECKOUT_PURCHASE_NOT_FOUND = 'purchase.not.found';
export const REDEEMABLE_REWARDS_NOT_FOUND = 'REDEEMABLE_REWARDS_NOT_FOUND';
export const CHECKOUT_EDIT_INACTIVE_ADDRESS = 'address.inactive.exception';
export const ERROR_EDIT_INACTIVE_ADDRESS = 'ERROR_EDIT_INACTIVE_ADDRESS';
export const ERROR_ALREADY_ENROLLED_IN_REWARDS = 'ERROR_ALREADY_ENROLLED_IN_REWARDS';
export const ERROR_CUSTOMER_IS_BANNED_FROM_REWARDS = 'ERROR_CUSTOMER_IS_BANNED_FROM_REWARDS';
export const REPETITIVE_TRANSPORTATION_OPERATION_ERROR = 'REPETITIVE_TRANSPORTATION_OPERATION_ERROR';
export const MIXED_RETURN_ERROR = 'MIXED_RETURN_ERROR';

type ResponseMapper<T> = (response: Response<T>) => T;
type StatusCodeResponseMapper<T> = Record<number, ResponseMapper<T>>;

/**
 * Simple class representing an error that occurred while performing an API request.
 */
export class FetchError extends Error {
  url: string;
  status: number;
  statusText: string;
  id?: string;
  extraInformation?: string;
  detailedMessage: string;
  constructor(url: string, status: number, statusText: string, id?: string, extraInformation = '') {
    super();
    this.url = url;
    this.status = status;
    this.statusText = statusText;
    this.id = id;
    this.extraInformation = extraInformation;
    this.detailedMessage = `API Fetch Error ${status} ${statusText} ${url}`;
  }
}

/**
 * fetchErrorMiddleware - inspects fetch response for error codes and throws an error if the response >= 400. Converts response to JSON if successful.
 *
 * @return {Object}  the parsed JSON response
 */
export function fetchErrorMiddleware<T>(response: Response<T>) {
  if (response.status >= 400) {
    throw new FetchError(response.url, response.status, response.statusText);
  }
  return response.json();
}

/**
 * generates a response handler similar to fetchErrorMiddleware, however it will not throw fetch errors for error codes included in allowedResponseCodes
 * @param  {Array}  [allowedResponseCodes=[]] the integer response codes (above 400) that should also be considered legal
 * @param  {StatusCodeResponseMapper} [responseMapper={}] the response mapper for mapping a specific status code's response
 * @return {function}                           The function to pass to a fetch .then
 */
export function fetchErrorMiddlewareAllowedErrors<T>(allowedResponseCodes: number[] = [], responseMapper: StatusCodeResponseMapper<T> = {}) {
  return (response: Response<T>) => {
    if (response.status >= 400 && allowedResponseCodes.indexOf(response.status) === -1) {
      throw new FetchError(response.url, response.status, response.statusText);
    }

    const mapper = responseMapper[response.status];
    if (mapper) {
      return mapper(response);
    }

    return response.json();
  };
}

/**
 * generates a response handler similar to fetchErrorMiddleware, however it will not throw fetch errors for error codes included in allowedResponseCodes, will log all errors to server even if not failing
 * @param  {Array}  [allowedResponseCodes=[]] the integer response codes (above 400) that should also be considered legal
 * @return {function}                           The function to pass to a fetch .then
 */
export function fetchErrorMiddlewareAllowedErrorsWithServerLogging<T>(allowedResponseCodes: number[] = [], prefix = 'API') {
  return (response: Response<T>) => {
    if (response.status >= 400 && allowedResponseCodes.indexOf(response.status) === -1) {
      logToServer(`[${prefix}]: Error code ${response.status} from call ${response.url}`);
      throw new FetchError(response.url, response.status, response.statusText);
    }

    return response.json();
  };
}

export function fetchErrorMiddlewareAllowAllErrorsWithServerLogging<T>(prefix = 'API') {
  return (response: Response<T>) => {
    if (response.status >= 400) {
      logToServer(`[${prefix}]: Error code ${response.status} from call ${response.url}`);
    }
    return response.json();
  };
}

/**
 * fetchErrorMiddlewareMaybeJson - inspects fetch response for error codes and
 * throws an error if the response >= 400. Converts response to JSON if
 * successful and there is body text returned. If there is no body text, returns null.
 *
 * @return {type}  description
 */
export function fetchErrorMiddlewareMaybeJson<T>(response: Response<T>) {
  if (response.status >= 400) {
    throw new FetchError(response.url, response.status, response.statusText);
  }
  return response.text().then(text => {
    if (text) {
      return JSON.parse(text);
    } else {
      return null;
    }
  });
}

/**
 * fetchErrorMiddleware - inspects fetch response for error codes and throws an error if the response >= 500. In the case of a 400 Converts response to JSON if successful.
 *
 * @return {type}  description
 */
export function fetchAllowNotFoundErrorMiddleware<T>(response: Response<T>) {
  if (response.status >= 500) {
    throw new FetchError(response.url, response.status, response.statusText);
  } else if (response.status === 404) {
    return null;
  }
  return response.json();
}

/**
 * Middleware for handling mafia responses which indicate the user is not
 * authenticated. This middleware will redirect the user to auth. Throws
 * a FetchError when auth is required.
 *
 * @param  {object}   response  Fetch repsonse
 * @return {function}           Fetch Middleware
 */

export const authError = new Set([
  'purchase.access.forbidden',
  'customer.auth.required',
  'invalid.atmain',
  'Access is denied',
  'auth.invalid',
  'Full authentication is required to access this resource',
  'Customer not recognized'
]);

export const fetchApiNotAuthenticatedMiddleware = <T>(response: Response<T>) => {
  if (response.status !== 403) {
    return response;
  }
  return response.json().then((json: any) => {
    if (authError.has(json.id) || authError.has(json.error) || authError.has(json.message)) {
      throw new FetchError(response.url, response.status, response.statusText, ERROR_NOT_AUTHENTICATED);
    } else {
      return response;
    }
  });
};

export const fetchMafiaValidationErrorMiddleware = <T>(response: Response<T>) => {
  if (response.status !== 400) {
    return response;
  }

  return response.json().then((json: any) => {
    let hasValidationError = false;

    switch (true) {
      case !json:
        break;
      case json.id === 'address.validation.exception':
      case json.id === 'validation.exception':
      case json.id === 'input.invalid':
        hasValidationError = true;
        break;
    }

    if (hasValidationError) {
      throw new FetchError(response.url, response.status, response.statusText, ERROR_REQUEST_VALIDATION, json.extraInformation);
    }

    return response;
  });
};

/**
 * fetchPixelErrorMiddleware - if error calling the /pixel endpoint, or it doesn't have the expected response, just log to screen.
 *
 * @return {type}  description
 */
export function fetchPixelErrorMiddleware(response: Response) {
  if (response.status >= 500) {
    logger('Error calling /pixel endpoint, not firing pixel server');
    return null;
  } else if (response.status === 404) {
    logger('Unable to locate /pixel endpoint, not firing pixel server');
    return null;
  }

  return response.json();
}

/**
 * fetchMartyPixelErrorMiddleware - if error calling the /martypixel endpoint, or it doesn't have the expected response, just log to screen.
 *
 * @return {type}  description
 */
export function fetchMartyPixelErrorMiddleware<T>(response: Response<T>) {
  if (response.status >= 500) {
    logError('Error calling /martypixel endpoint, not firing pixel server');
    return null;
  } else if (response.status === 404) {
    logError('Unable to locate /martypixel endpoint, not firing pixel server');
    return null;
  }

  return response;
}

/**
 * fetchNon200Middleware - If not a 200, then throw error
 *
 * @return {type}  description
 */
export function fetchNon200Middleware<T>(response: Response<T>) {
  if (response.status === 200) {
    return response.text();
  } else {
    throw new FetchError(response.url, response.status, response.statusText);
  }
}

export function fetchCustomerIsBannedFromRewardsMiddleware<T>(response: Response<T>) {
  const { status, url, statusText } = response;
  if (status === 403) {
    return response.json().then((json: any) => {
      let hasValidationError = false;

      switch (true) {
        case !json:
          break;
        case json.error?.message === 'Customer is banned from enrollment':
          hasValidationError = true;
          break;
      }

      if (hasValidationError) {
        throw new FetchError(url, status, statusText, ERROR_CUSTOMER_IS_BANNED_FROM_REWARDS, json.extraInformation);
      }

      throw new FetchError(url, status, statusText, ERROR_NOT_AUTHENTICATED);
    });

  }
  return response;
}

export function fetchCustomerAleradyEnrolledRewardsMiddleware<T>(response: Response<T>) {
  const { status, url, statusText } = response;
  if (status === 400) {
    return response.json().then((json: any) => {
      let hasValidationError = false;

      switch (true) {
        case !json:
          break;
        case json.error?.message === 'Customer is already enrolled.':
          hasValidationError = true;
          break;
      }

      if (hasValidationError) {
        throw new FetchError(url, status, statusText, ERROR_ALREADY_ENROLLED_IN_REWARDS, json.extraInformation);
      }

      return response;
    });

  }
  return response;
}

export function fetchTransportationOptionErrorMiddleware<T extends { id: string }>(response: Response<T>) {
  const { status, url, statusText } = response;
  if (status === 400) {
    return response.json().then((json: T) => {

      if (json.id === 'prior.contract.id') {
        throw new FetchError(url, status, statusText, REPETITIVE_TRANSPORTATION_OPERATION_ERROR);
      }

      return response;
    });
  }
  return response;
}

// This middleware handle errors when there is an mixed FC return error, this only refer to FindZen ATM
export function fetchMixedReturnErrorMiddleware<T extends { id: string }>(response: Response<T>) {
  const { status, url, statusText } = response;
  if (status === 400) {
    return response.json().then((json: T) => {

      if (json.id === 'ineligible.return.capable.destinations') {
        throw new FetchError(url, status, statusText, MIXED_RETURN_ERROR);
      }

      return response;
    });
  }
  return response;
}
