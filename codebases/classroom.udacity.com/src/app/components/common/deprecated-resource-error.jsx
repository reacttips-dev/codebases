import InternalError from './internal-error';
import React from 'react';
import { __ } from 'services/localization-service';

export const DEPRECATED_ERROR_MESSAGE = __(
  'The resource at this URL is no longer supported.'
);

export const DeprecatedResourceError = () => (
  <InternalError message={DEPRECATED_ERROR_MESSAGE} />
);

export default DeprecatedResourceError;
