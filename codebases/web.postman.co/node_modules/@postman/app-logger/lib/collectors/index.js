module.exports = {
    Console: require('./winston/WinstonCollector'),
    File: require('./winston/FileCollector'),
    Sentry: require('./winston/SentryCollector')
};
