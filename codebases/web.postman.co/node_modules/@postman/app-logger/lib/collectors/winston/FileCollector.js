const winston = require('winston'),
    WinstonCollector = require('./WinstonCollector'),
    { file } = require('../../helpers/format'),
    format = winston.format.printf(file),

    MAX_FILES_COUNT = 5,
    MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * @extends WinstonCollector
 * @class WinstonFileCollector
 * @description This holds the basic details winston file collector
 */
class WinstonFileCollector extends WinstonCollector {
    /**
     * @method constructor
     * @description It calls the super with the winston file transport as its transport module
     * @param {[Object={}]} options
     * @param {String} options.file
     * @throws InvalidParamsException
     */
    constructor (options = {}) {

        if (typeof options !== 'object' || Array.isArray(options)) {
            throw new Error('InvalidParamsException: options should be of type object if provided');
        }

        let file = options.file;

        // Validate the file input
        if (!file || typeof file !== 'string') {
            throw new Error('InvalidParamsException: options.file should be a valid non empty string');
        }

        super(Object.assign(
            {},
            options,
            {
                transports: [new winston.transports.File({
                    filename: file,
                    maxFiles: MAX_FILES_COUNT,
                    maxsize: MAX_FILE_SIZE,
                    format
                })]
            })
        );
    }
}

module.exports = WinstonFileCollector;
