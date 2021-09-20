const serializeError = require('serialize-error'),
    CircularJSON = require('circular-json'),

    /**
    * @description It sanitizes the message it receives, using serializeError if it is error
    * or uses circularjson stringify for other types.
    * @param {*=''} message
    * @return {*}
    */
    sanitizeMessage = (message) => {
        return message instanceof Error ? JSON.stringify(serializeError(message)) : CircularJSON.stringify(message);
    };

/**
 * @description it iterates over the messages to sanitize
 * @param {Array=} messages
 * @returns {String}
 */
module.exports = (messages) => {

    // There is a case where circularjson.stringify was encoding the ~ characters.
    // To avoid that, we pass each argument to stringify instead as a whole
    // https://github.com/WebReflection/circular-json/issues/45
    if (Array.isArray(messages)) {
        return messages.map(sanitizeMessage).join(',');
    }

    return sanitizeMessage(messages);
};
