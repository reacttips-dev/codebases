import invariant from 'react-utils/invariant';
var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'; // https://github.com/facebook/prop-types/blob/master/lib/ReactPropTypesSecret.js

export default function check(object, propTypes) {
  var propName;

  for (propName in propTypes) {
    if (Object.prototype.hasOwnProperty.call(propTypes, propName)) {
      var error = propTypes[propName](object, propName, JSON.stringify(object), 'prop', null, ReactPropTypesSecret);

      if (error) {
        invariant(true, error.message);
      }
    }
  }
}