import { perfSentryApi } from 'crm-fe-perf/perfSentryApi';
import { bender } from 'legacy-hubspot-bender-context';
var BaseContainerFactory = {
  create: function create(name) {
    if (!name) {
      throw new Error('Container name must be supplied');
    }

    var _data = null;
    var container = {
      set: function set(data) {
        _data = data;
        return _data;
      },
      get: function get() {
        return _data;
      }
    };
    return {
      name: name,
      getContainer: function getContainer(loggingOptions) {
        if (loggingOptions) {
          var optionalMessage = '';
          var extra;

          if (typeof loggingOptions === 'object') {
            extra = loggingOptions.extra;
            optionalMessage = loggingOptions.message ? " " + loggingOptions.message : '';
          }

          var deployable = bender.project;
          var loggingMessage = "[CONTAINERS] [" + deployable + "] " + this.name + ".getContainer() accessed." + optionalMessage;
          var tags = {
            deployable: deployable
          };
          perfSentryApi.send(loggingMessage, extra, {
            tags: tags
          });
        }

        return container;
      },
      setContainer: function setContainer(newContainer) {
        if (typeof newContainer.get !== 'function') {
          throw new Error('container must contain a get function');
        }

        if (typeof newContainer.set !== 'function') {
          throw new Error('container must contain a set function');
        }

        container = newContainer;
      }
    };
  }
};
export default BaseContainerFactory;