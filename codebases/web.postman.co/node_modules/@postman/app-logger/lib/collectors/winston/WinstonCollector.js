const winston = require('winston'),
    { consoleFormat } = require('../../helpers/format'),
    AbstractCollector = require('../AbstractCollector'),
    format = winston.format.printf(consoleFormat),
    { INFO } = require('../../constants/level');

/**
 * @extends AbstractCollector
 * @class WinstonCollector
 * @description This holds the basic details of winston collector, it uses the transport provided
 * otherwise uses winston console transport
 */
class WinstonCollector extends AbstractCollector {
    /**
     * @method constructor
     * @description It calls the super with the winston as its logger module
     * @param {[Object={}]} options
     * @throws InvalidParamsException
     */
    constructor (options = {}) {
        super(Object.assign(
            {},
            options,
            {
                transports: [
                    WinstonCollector._getLogger({
                        level: options.level || INFO,
                        transports: options.transports || [new winston.transports.Console({ format })]
                    })
                ]
            })
        );
    }

    /**
     * @method _getLogger
     * @param {Array = []} transports
     * @description It creates the winston logger with the transports available.
     * @return {WinstonInstance}
     */
    static _getLogger ({ level, transports }) {
        return winston.createLogger({ level, transports });
    }
}

module.exports = WinstonCollector;
