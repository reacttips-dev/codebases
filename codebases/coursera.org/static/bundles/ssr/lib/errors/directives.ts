/* eslint-disable no-use-before-define */
// Throwing any of these directives in SSR will bubble up to Express in server-renderer/render.js

/**
 * When adding directives, please add it to this helper function.
 */
export function isDirective(error: Error) {
  return internalServerError(error) != null || redirectError(error) != null || notFoundError(error) != null;
}

// Thrown to trigger a 5xx
export const INTERNAL_SERVER_ERROR = 'InternalServerError';
export class InternalServerError extends Error {
  url: string;

  statusCode: number;

  constructor(url: string) {
    super();
    Error.captureStackTrace?.(this, InternalServerError);
    this.name = 'InternalServerError';
    this.url = url;
    this.message = `Encountered InternalServerError when processing: ${url}`;
    this.statusCode = 500;
  }
}
// Create a separate type constructor / validator because `instanceof`
// does not work properly on built ins like Error objects.
export function internalServerError(error: Error): InternalServerError | null {
  if (error.name === INTERNAL_SERVER_ERROR) {
    return error as InternalServerError;
  } else {
    return null;
  }
}

// Thrown to trigger a 3xx
export const REDIRECT_ERROR = 'RedirectError';
export class RedirectError extends Error {
  statusCode: number;

  message: string;

  redirectUri: string;

  constructor(statusCode: number, redirectUri: string) {
    super();
    Error.captureStackTrace?.(this, RedirectError);
    this.name = REDIRECT_ERROR;
    this.statusCode = statusCode;
    this.message = `Redirecting to ${redirectUri}`;
    this.redirectUri = redirectUri;
  }
}
// Create a separate type constructor / validator because `instanceof`
// does not work properly on built ins like Error objects.
export function redirectError(error: Error): RedirectError | null {
  if (error.name === REDIRECT_ERROR) {
    return error as RedirectError;
  } else {
    return null;
  }
}

// Thrown to trigger a 404
export const NOT_FOUND_ERROR = 'NotFoundError';
export class NotFoundError extends Error {
  statusCode: number;

  constructor() {
    super();
    Error.captureStackTrace?.(this, NotFoundError);
    this.name = NOT_FOUND_ERROR;
    this.message = 'NotFoundError triggered by application.';
    this.statusCode = 404;
  }
}
// Create a separate type constructor / validator because `instanceof`
// does not work properly on built ins like Error objects.
export function notFoundError(error: Error): NotFoundError | null {
  if (error.name === NOT_FOUND_ERROR) {
    return error as NotFoundError;
  } else {
    return null;
  }
}
