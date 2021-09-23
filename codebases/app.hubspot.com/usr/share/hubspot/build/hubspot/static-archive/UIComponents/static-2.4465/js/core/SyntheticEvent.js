'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";

var SyntheticEventClass = /*#__PURE__*/function () {
  function SyntheticEventClass(value, evt) {
    _classCallCheck(this, SyntheticEventClass);

    var target = {
      value: value
    };
    this.target = target;
    this.currentTarget = target;
    this.source = evt;
  }

  _createClass(SyntheticEventClass, [{
    key: "preventDefault",
    value: function preventDefault() {
      if (this.source) {
        this.source.preventDefault();
      }
    }
  }, {
    key: "stopPropagation",
    value: function stopPropagation() {
      if (this.source) {
        this.source.stopPropagation();
      }
    }
  }]);

  return SyntheticEventClass;
}();

function SyntheticEvent(value, evt) {
  return new SyntheticEventClass(value, evt);
}

SyntheticEvent.constructor = SyntheticEventClass;
export default SyntheticEvent;