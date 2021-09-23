import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Map as ImmutableMap, fromJS as _fromJS } from 'immutable';
export var CALL_META_PROPERTIES = {
  toNumber: 'hs_call_to_number',
  fromNumber: 'hs_call_from_number',
  status: 'hs_call_status',
  externalId: 'hs_call_external_id',
  durationMilliseconds: 'hs_call_duration',
  externalAccountId: 'hs_call_external_account_id',
  body: 'hs_call_body',
  disposition: 'hs_call_disposition',
  calleeObjectType: 'hs_call_callee_object_type',
  calleeObjectId: 'hs_call_callee_object_id',
  // BET Specfic values
  unknownVisitorConversation: 'hs_unknown_visitor_conversation'
};
export var CALL_ENGAGEMENT_PROPERTIES = {
  activityType: 'hs_activity_type',
  // BET Specfic values
  followUpAction: 'hs_follow_up_action',
  productName: 'hs_product_name',
  atMentionedOwnerIds: 'hs_at_mentioned_owner_ids'
};
var DEFAULTS = {
  portalId: undefined,
  objectId: undefined,
  properties: ImmutableMap(),
  version: undefined,
  secondaryIdentifier: undefined,
  isDeleted: false,
  objectType: undefined
};

var Engagement = /*#__PURE__*/function (_Record) {
  _inherits(Engagement, _Record);

  function Engagement() {
    _classCallCheck(this, Engagement);

    return _possibleConstructorReturn(this, _getPrototypeOf(Engagement).apply(this, arguments));
  }

  _createClass(Engagement, null, [{
    key: "fromJS",
    value: function fromJS(data) {
      return new Engagement({
        portalId: data.portalId,
        objectId: data.objectId,
        properties: _fromJS(data.properties || {}),
        version: data.version,
        isDeleted: data.isDeleted,
        secondaryIdentifier: data.secondaryIdentifier,
        objectType: data.objectType
      });
    }
  }, {
    key: "mergeProperties",
    value: function mergeProperties(properties, engagement) {
      var updatedEngagement = engagement;
      Object.keys(properties).forEach(function (propertyKey) {
        updatedEngagement = updatedEngagement.mergeIn(['properties', propertyKey], _fromJS(properties[propertyKey]));
      });
      return updatedEngagement;
    }
  }]);

  return Engagement;
}(Record(DEFAULTS, 'Engagement'));

export { Engagement as default };