import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import enviro from 'enviro'; // @ts-expect-error dependency missing types

import OutpostErrorReporter from 'outpost/OutpostErrorReporter';
var OUTPOST_IDENTIFIER = 'onboarding-tours';
var ELEMENT_LOAD_TIMEDOUT = 'Element load timed out';
var LOAD_TOUR_ERROR = 'Error loading tour';

var SentryManager = /*#__PURE__*/function () {
  function SentryManager() {
    _classCallCheck(this, SentryManager);

    this.outpostErrorReporter = new OutpostErrorReporter(OUTPOST_IDENTIFIER, {
      disabled: !enviro.deployed('sentry')
    });
  }

  _createClass(SentryManager, [{
    key: "getMessage",
    value: function getMessage(name, tourId, stepId) {
      return name + ":\n      tour id: " + tourId + "\n      step id: " + stepId;
    }
  }, {
    key: "reportElementLoadTimeout",
    value: function reportElementLoadTimeout(tourId, stepId) {
      this.reportSentry(tourId, stepId, ELEMENT_LOAD_TIMEDOUT);
    }
  }, {
    key: "reportSentry",
    value: function reportSentry(tourId, stepId, name) {
      this.outpostErrorReporter.report({
        fileName: OUTPOST_IDENTIFIER,
        message: this.getMessage(name, tourId, stepId),
        name: name
      }, {
        stepId: stepId,
        tourId: tourId
      });
    }
  }, {
    key: "reportLoadTourError",
    value: function reportLoadTourError(error, tourId) {
      this.outpostErrorReporter.report({
        fileName: OUTPOST_IDENTIFIER,
        message: tourId + ": failed at " + error.message + " when attempting to load tour with id " + tourId,
        name: LOAD_TOUR_ERROR
      }, {
        tourId: tourId
      });
    }
  }]);

  return SentryManager;
}();

export default new SentryManager();