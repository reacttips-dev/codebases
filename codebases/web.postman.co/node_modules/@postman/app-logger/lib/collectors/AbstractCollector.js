/**
 * @class AbstractCollector
 * @description It holds the overall instance of a collector
 * @throws InvalidParamsException
 */
class AbstractCollector {
    /**
     * @method constructor
     * @param {Object} options
     * @param {Array=[]} options.transports
     */
    constructor (options = {}) {
        if (typeof options !== 'object' || Array.isArray(options)) {
            throw new Error('InvalidParamsException: options should be of type object if provided');
        }

        if (options.transports && !Array.isArray(options.transports)) {
            throw new Error('InvalidParamsException: options.transports should be of type array if provided');
        }
        this.transports = options.transports || [console];
    }

    /**
     * @method log
     * @description It wraps logger module and pass the message to it.
     * It,
     * - Pass the message as object { message: sanitizedInput }
     * @param {[String]} level
     * @param {*} message
     */
    log (level, message) {
        this.transports.forEach((transport) => {
            transport.log(level, message);
        });
    }
}

module.exports = AbstractCollector;
