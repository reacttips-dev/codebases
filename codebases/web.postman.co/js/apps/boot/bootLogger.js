const path = require('path'),
    { Originator, Collectors } = require('@postman/app-logger');

/**
 * @method bootLogger
 * @description It initiates the logger and attaches the logger instance to pm object
 * @param {Function} cb
 */
function bootLogger (cb) {
  let FileCollector = Collectors.File,
      ConsoleCollector = Collectors.Console,
      origin = pm.windowConfig.process,
      windowURL = new URL(window.location.href),
      sessionId = windowURL.searchParams.get('sessionId'),
      logPath = windowURL.searchParams.get('logPath'),
      collectors = [];

  try {
    postman_env !== 'production' && collectors.push(new ConsoleCollector());

    if (window.SDK_PLATFORM !== 'browser') {
      collectors.push(new FileCollector({
        file: path.resolve(logPath, `${window.process.type}-${origin}.log`)
      }));
    }

    pm.logger = new Originator({ origin, collectors, sessionId });
  }
  catch (e) {
    pm.logger = console; // defaults to console

    // Don't fail the boot if logger fails
    pm.logger.error('Logger initialization failed', e);
  }
  finally {
    cb();
  }
}


export default bootLogger;
