const sanitize = require('./sanitize');

module.exports = {
    /**
     * @description It format the message it receives for file
     * @param {[Object={}]} info
     * @return {String}
     */
    file (info = {}) {
        let messages = '';
        try {
            messages = sanitize(info.messages);
        }
        catch (e) {
            console.error(e);
        }
        return `[${info.sessionId}][${info.timestamp}][${info.origin}][${info.level}][${messages}]`;
    },

    /**
     * @description It format the message it receives, for console
     * @param {[Object={}]} info
     * @return {*}
     */
    consoleFormat (info = {}) {
        let messages = '';
        try {
            messages = sanitize(info.messages);
        }
        catch (e) {
            console.error(e);
        }
        return `${info.timestamp} ${info.origin} ${info.level} ${messages}`;
    }
};
