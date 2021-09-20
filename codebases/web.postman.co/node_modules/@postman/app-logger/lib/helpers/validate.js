const { ERROR, WARN, INFO } = require('../constants/level'),
    allowedLevels = {
        [ERROR]: true,
        [WARN]: true,
        [INFO]: true
    };


module.exports = {
    /**
     * @method isValidLevel
     * @description It checks whether the provided level is valid
     * @param {String} level
     * @returns {Boolean}
     */
    isValidLevel: (level) => {
        return Boolean(allowedLevels[level]);
    }
};
