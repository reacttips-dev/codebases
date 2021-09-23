'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Record } from 'immutable';
import { stageLabelTranslator } from 'property-translator/propertyTranslator';
var DEFAULTS = {
  lifecyclestage: null,
  vid: null,
  email: null,
  hs_analytics_first_timestamp: null,
  firstname: null,
  lastname: null,
  // maybe tacked on in selector level if fullIntel returns a social network profile for this email
  user: null,
  followsYou: null,
  followingThem: null
};

var Assist = /*#__PURE__*/function (_Record) {
  _inherits(Assist, _Record);

  function Assist() {
    _classCallCheck(this, Assist);

    return _possibleConstructorReturn(this, _getPrototypeOf(Assist).apply(this, arguments));
  }

  _createClass(Assist, [{
    key: "getName",
    value: function getName() {
      return [this.firstname, this.lastname].filter(function (i) {
        return i;
      }).join(' ');
    }
  }, {
    key: "getLifecycleStage",
    value: function getLifecycleStage() {
      var translatedStage = stageLabelTranslator({
        label: this.lifecyclestage,
        objectType: 'CONTACT',
        pipelineId: 'contacts-lifecycle-pipeline',
        // https://hubspot.slack.com/archives/C01FU5BG3RC/p1624549231219500?thread_ts=1622659434.071300&cid=C01FU5BG3RC
        stageId: this.lifecyclestage
      });
      return translatedStage || this.lifecyclestage;
    }
  }], [{
    key: "createFromArray",
    value: function createFromArray(data) {
      return new List(data.filter(function (a) {
        return !a.deleted && a.email;
      }).map(function (a) {
        return new Assist(a);
      })).sortBy(function (a) {
        return a.getName();
      });
    }
  }]);

  return Assist;
}(Record(DEFAULTS));

export { Assist as default };