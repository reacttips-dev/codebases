var moment = require('moment');

function isValidMoment(testMoment) {
  if (typeof moment.isMoment === 'function' && !moment.isMoment(testMoment)) {
    return false;
  }

  /* istanbul ignore else  */
  if (typeof testMoment.isValid === 'function') {
    // moment 1.7.0+
    return testMoment.isValid();
  }

  /* istanbul ignore next */
  return !isNaN(testMoment);
}

module.exports = {
  isValidMoment : isValidMoment,
};
