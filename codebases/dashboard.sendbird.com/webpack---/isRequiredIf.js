const VALIDATOR_ARG_ERROR_MESSAGE =
  'The typeValidator argument must be a function ' +
  'with the signature function(props, propName, componentName).';

const MESSAGE_ARG_ERROR_MESSAGE =
  'The error message is optional, but must be a string if provided.';

const propIsRequired = (condition, props, propName, componentName) => {
  if (typeof condition === 'boolean') {
    return condition;
  } else if (typeof condition === 'function') {
    return condition(props, propName, componentName);
  } else if (Boolean(condition) === true) {
    return Boolean(condition);
  }

  return false;
};

const propExists = (props, propName) => Object.hasOwnProperty.call(props, propName);

const missingPropError = (props, propName, componentName, message) => {
  if (message) {
    return new Error(message);
  }

  return new Error(
    `Required ${props[propName]} \`${propName}\`` +
    ` was not specified in \`${componentName}\`.`,
  );
};

const guardAgainstInvalidArgTypes = (typeValidator, message) => {
  if (typeof typeValidator !== 'function') {
    throw new TypeError(VALIDATOR_ARG_ERROR_MESSAGE);
  }

  if (Boolean(message) && typeof message !== 'string') {
    throw new TypeError(MESSAGE_ARG_ERROR_MESSAGE);
  }
};

const isRequiredIf = (typeValidator, condition, message) => {
  guardAgainstInvalidArgTypes(typeValidator, message);

  return (props, propName, componentName, ...rest) => {
    if (propIsRequired(condition, props, propName, componentName)) {
      if (propExists(props, propName)) {
        return typeValidator(props, propName, componentName, ...rest);
      }

      return missingPropError(props, propName, componentName, message);
    }

    // Is not required, so just run typeValidator.
    return typeValidator(props, propName, componentName, ...rest);
  };
};

export default isRequiredIf;
