'use es6';

var longTasksByInput = {};
var inputsUsedThisSession = [];
var lastEventTimeStampByInput = {};
var lastTextInputUsed = null;
var perfObs;

var sendData = function sendData(hasPluginStacks) {
  if (window.newrelic) {
    Object.keys(longTasksByInput).forEach(function (inputName) {
      window.newrelic.addPageAction('longInputTasks', {
        inputName: inputName,
        longTaskCount: longTasksByInput[inputName],
        didReceiveEvents: inputsUsedThisSession.includes(inputName),
        hasPluginStacks: hasPluginStacks
      });
    });
  }
};

export var setupTextInputPerformanceMeasuring = function setupTextInputPerformanceMeasuring(hasPluginStacks) {
  if (window.PerformanceObserver) {
    try {
      if (!perfObs) {
        // only create perfObs and add beforeunload listener once/session
        perfObs = new window.PerformanceObserver(function (list) {
          var entries = list.getEntries();
          entries.forEach(function (entry) {
            var lastInputTimeStamp = lastEventTimeStampByInput[lastTextInputUsed];

            if (lastInputTimeStamp && entry.startTime < lastInputTimeStamp && entry.startTime + entry.duration > lastInputTimeStamp) {
              longTasksByInput[lastTextInputUsed]++;
            }
          });
        });
        window.addEventListener('beforeunload', function () {
          sendData(hasPluginStacks);
        });
      }

      perfObs.observe({
        entryTypes: ['longtask']
      });
    } catch (e) {// not all browsers suport longtask or PerformanceObserver.prototype.observe so catch if any of the above fails
      // for more information see https://git.hubteam.com/HubSpot/customer-data-rte/pull/120
    }
  }
};
export var registerNewInput = function registerNewInput(inputName) {
  longTasksByInput[inputName] = 0;
  var didRecordUsage = false;
  return function (inputEvent) {
    if (!didRecordUsage) {
      inputsUsedThisSession.push(inputName);
      didRecordUsage = true;
    }

    lastTextInputUsed = inputName;
    lastEventTimeStampByInput[inputName] = inputEvent.timeStamp;
  };
};