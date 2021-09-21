import { patchMethod, XHR_SYNC, XHR_URL, XHR_METHOD, XHR_IGNORE } from './patch-utils';
import { SCHEDULE, INVOKE, XMLHTTPREQUEST, ADD_EVENT_LISTENER_STR } from '../constants';
export function patchXMLHttpRequest(callback) {
  var XMLHttpRequestPrototype = XMLHttpRequest.prototype;

  if (!XMLHttpRequestPrototype || !XMLHttpRequestPrototype[ADD_EVENT_LISTENER_STR]) {
    return;
  }

  var READY_STATE_CHANGE = 'readystatechange';
  var LOAD = 'load';
  var ERROR = 'error';
  var TIMEOUT = 'timeout';
  var ABORT = 'abort';

  function invokeTask(task, status) {
    if (task.state !== INVOKE) {
      task.state = INVOKE;
      task.data.status = status;
      callback(INVOKE, task);
    }
  }

  function scheduleTask(task) {
    if (task.state === SCHEDULE) {
      return;
    }

    task.state = SCHEDULE;
    callback(SCHEDULE, task);
    var target = task.data.target;

    function addListener(name) {
      target[ADD_EVENT_LISTENER_STR](name, function (_ref) {
        var type = _ref.type;

        if (type === READY_STATE_CHANGE) {
          if (target.readyState === 4 && target.status !== 0) {
            invokeTask(task, 'success');
          }
        } else {
          var status = type === LOAD ? 'success' : type;
          invokeTask(task, status);
        }
      });
    }

    addListener(READY_STATE_CHANGE);
    addListener(LOAD);
    addListener(TIMEOUT);
    addListener(ERROR);
    addListener(ABORT);
  }

  var openNative = patchMethod(XMLHttpRequestPrototype, 'open', function () {
    return function (self, args) {
      if (!self[XHR_IGNORE]) {
        self[XHR_METHOD] = args[0];
        self[XHR_URL] = args[1];
        self[XHR_SYNC] = args[2] === false;
      }

      return openNative.apply(self, args);
    };
  });
  var sendNative = patchMethod(XMLHttpRequestPrototype, 'send', function () {
    return function (self, args) {
      if (self[XHR_IGNORE]) {
        return sendNative.apply(self, args);
      }

      var task = {
        source: XMLHTTPREQUEST,
        state: '',
        type: 'macroTask',
        data: {
          target: self,
          method: self[XHR_METHOD],
          sync: self[XHR_SYNC],
          url: self[XHR_URL],
          status: ''
        }
      };

      try {
        scheduleTask(task);
        return sendNative.apply(self, args);
      } catch (e) {
        invokeTask(task, ERROR);
        throw e;
      }
    };
  });
}