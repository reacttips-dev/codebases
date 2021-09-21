var _serviceCreators;

import ApmServer from './apm-server';
import ConfigService from './config-service';
import LoggingService from './logging-service';
import { CONFIG_CHANGE, CONFIG_SERVICE, LOGGING_SERVICE, APM_SERVER } from './constants';
import { __DEV__ } from '../state';
var serviceCreators = (_serviceCreators = {}, _serviceCreators[CONFIG_SERVICE] = function () {
  return new ConfigService();
}, _serviceCreators[LOGGING_SERVICE] = function () {
  return new LoggingService({
    prefix: '[Elastic APM] '
  });
}, _serviceCreators[APM_SERVER] = function (factory) {
  var _factory$getService = factory.getService([CONFIG_SERVICE, LOGGING_SERVICE]),
      configService = _factory$getService[0],
      loggingService = _factory$getService[1];

  return new ApmServer(configService, loggingService);
}, _serviceCreators);

var ServiceFactory = function () {
  function ServiceFactory() {
    this.instances = {};
    this.initialized = false;
  }

  var _proto = ServiceFactory.prototype;

  _proto.init = function init() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    var configService = this.getService(CONFIG_SERVICE);
    configService.init();

    var _this$getService = this.getService([LOGGING_SERVICE, APM_SERVER]),
        loggingService = _this$getService[0],
        apmServer = _this$getService[1];

    configService.events.observe(CONFIG_CHANGE, function () {
      var logLevel = configService.get('logLevel');
      loggingService.setLevel(logLevel);
    });
    apmServer.init();
  };

  _proto.getService = function getService(name) {
    var _this = this;

    if (typeof name === 'string') {
      if (!this.instances[name]) {
        if (typeof serviceCreators[name] === 'function') {
          this.instances[name] = serviceCreators[name](this);
        } else if (__DEV__) {
          console.log('Cannot get service, No creator for: ' + name);
        }
      }

      return this.instances[name];
    } else if (Array.isArray(name)) {
      return name.map(function (n) {
        return _this.getService(n);
      });
    }
  };

  return ServiceFactory;
}();

export { serviceCreators, ServiceFactory };