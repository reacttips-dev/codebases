'use es6';

import { GenericValidationError } from '../constants/errors';
export function javascriptErrorFromValidationErrors(validationErrors) {
  if (!validationErrors || !validationErrors.length) {
    return null;
  }

  if (validationErrors.length > 1) {
    var error = new Error('There were multiple errors fetching data');
    error.status = 400;
    error.responseJSON = validationErrors;
    return error;
  }

  var validationError = validationErrors[0];

  switch (validationError.__typename) {
    // today all validation errors are generic, in the future we will likely
    // begin to enumerate these errors individually to allow for more structured
    // metadata.
    case GenericValidationError:
      {
        var _error = new Error(validationError.message);

        _error.status = 400;
        _error.responseJSON = validationError;
        return _error;
      }

    default:
      {
        var _error2 = new Error('Unknown error occurred');

        _error2.status = 400;
        _error2.responseJSON = validationError;
        return _error2;
      }
  }
}