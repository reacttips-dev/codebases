'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _get from "@babel/runtime/helpers/esm/get";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Set as ImmutableSet } from 'immutable';

var CampaignRecord = /*#__PURE__*/function (_Record) {
  _inherits(CampaignRecord, _Record);

  function CampaignRecord() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref$utm = _ref.utm,
        utm = _ref$utm === void 0 ? '' : _ref$utm,
        json = _objectWithoutProperties(_ref, ["utm"]);

    _classCallCheck(this, CampaignRecord);

    return _possibleConstructorReturn(this, _getPrototypeOf(CampaignRecord).call(this, Object.assign({}, json, {
      utm: utm,
      utms: new ImmutableSet([utm])
    })));
  }

  _createClass(CampaignRecord, [{
    key: "merge",
    //Override merge method to ignore properties not definied in CampaignRecord above
    //Only necessary until we get to version 4 of immutable
    value: function merge(campaign) {
      var _this = this;

      var campaignJson = campaign.toJS ? campaign.toJS() : campaign;
      var filtered = Object.keys(campaignJson).reduce(function (acc, key) {
        if (_this.has(key)) {
          acc[key] = campaignJson[key];
        }

        return acc;
      }, {});
      return _get(_getPrototypeOf(CampaignRecord.prototype), "merge", this).call(this, filtered);
    }
  }], [{
    key: "from",
    value: function from(json) {
      return new CampaignRecord(json);
    }
  }]);

  return CampaignRecord;
}(Record({
  actualBudget: null,
  attributionEnabled: null,
  audience: '',
  colorHex: null,
  createdAt: null,
  createdBy: null,
  deleted: false,
  endedAt: null,
  goal: '',
  goals: {},
  guid: null,
  display_name: '',
  notes: null,
  objectId: null,
  owner: null,
  portalId: null,
  projectedBudget: null,
  revenue: null,
  startedAt: null,
  updatedAt: null,
  templateGuid: null,
  utm: '',
  utms: new ImmutableSet()
}));

export default CampaignRecord;