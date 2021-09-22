import { ErrorTree } from 'bundles/peer/types/ErrorTree';
import { ValidationError } from 'bundles/assess-common/types/ValidationErrors';

import React from 'react';
import initBem from 'js/lib/bem';

import 'css!./__styles__/InlineValidationError';

const bem = initBem('InlineValidationError');

type Props = {
  errorTree?: ErrorTree;
  validationError?: ValidationError | null;
};

const InlineValidationError = ({ errorTree, validationError }: Props) => {
  if ((validationError && validationError.debugMessage) || (errorTree && errorTree.errors.length > 0)) {
    let errorMsg = '';
    if (validationError && validationError.debugMessage) {
      errorMsg = validationError.debugMessage;
    } else if (errorTree && errorTree.errors.length > 0) {
      errorMsg = errorTree.errors.map((error) => error.errorMessage).join(' ');
    }

    return <div className={bem(undefined, undefined, 'body-1-text')}>{errorMsg}</div>;
  }
  return null;
};

export default InlineValidationError;
