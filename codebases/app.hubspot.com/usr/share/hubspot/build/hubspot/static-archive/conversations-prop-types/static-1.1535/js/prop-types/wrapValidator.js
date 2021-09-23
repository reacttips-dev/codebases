'use es6';

export var wrapValidator = function wrapValidator(validator, typeName) {
  var typeChecker = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return Object.assign(validator.bind(), {
    typeName: typeName,
    typeChecker: typeChecker,
    isRequired: Object.assign(validator.isRequired.bind(), {
      typeName: typeName,
      typeChecker: typeChecker,
      typeRequired: true
    })
  });
};