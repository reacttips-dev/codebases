import {
  CaughtError as _CaughtError,
  ErrorHandlerProps as _ErrorHandlerProps,
} from './ErrorBoundary';

export type CaughtError = _CaughtError;
export type ErrorHandlerProps = _ErrorHandlerProps;

export { ErrorBoundary, DefaultErrorHandler } from './ErrorBoundary';
export { ErrorDetails } from './ErrorDetails';
