'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import pick from 'transmute/pick';
import { Set as ImmutableSet } from 'immutable';
import StageChangeDialog from 'customer-data-properties/dialog/StageChangeDialog';
import Promptable from 'UIComponents/decorators/Promptable';
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import ProvideReferenceResolvers from 'reference-resolvers/ProvideReferenceResolvers';
import { getPropertyInputResolverCreators } from 'customer-data-properties/resolvers/PropertyInputResolvers';
import { NOT_SPECIFIED } from '../constants/FieldLevelPermissionTypes';
import RevenueStageChangeDialog from 'customer-data-properties/revenue/RevenueStageChangeDialog';
var closeDealStageProperties = ['closedate', 'closed_lost_reason', 'closed_won_reason'];
var closeTicketStageProperties = ['hs_ticket_category', 'hs_resolution'];

function getDialog(scopes, objectType) {
  // this should only ever be applied to portals 53/99535353
  if (objectType === DEAL && scopes && ImmutableSet(scopes).has('revenue-deal-stage-change-dialog')) {
    return RevenueStageChangeDialog;
  }

  return StageChangeDialog;
}

export default (function (_ref) {
  var getPropertyInputResolver = _ref.getPropertyInputResolver,
      PropertyInput = _ref.PropertyInput,
      subject = _ref.subject,
      prevStage = _ref.prevStage,
      nextStage = _ref.nextStage,
      objectType = _ref.objectType,
      prevProperties = _ref.prevProperties,
      nextProperties = _ref.nextProperties,
      stageProperties = _ref.stageProperties,
      saveCallback = _ref.saveCallback,
      cancelCallback = _ref.cancelCallback,
      settings = _ref.settings,
      subjectProperties = _ref.subjectProperties,
      _ref$getPropertyPermi = _ref.getPropertyPermission,
      getPropertyPermission = _ref$getPropertyPermi === void 0 ? function () {
    return NOT_SPECIFIED;
  } : _ref$getPropertyPermi,
      scopes = _ref.scopes;
  var closeStageProperties = objectType === TICKET ? closeTicketStageProperties : closeDealStageProperties;
  var dialog = ProvideReferenceResolvers(getPropertyInputResolverCreators())(getDialog(scopes, objectType));
  Promptable(dialog)({
    nextProperties: nextProperties,
    prevStage: prevStage,
    nextStage: nextStage,
    objectType: objectType,
    prevProperties: prevProperties,
    properties: stageProperties,
    subject: subject,
    getPropertyInputResolver: getPropertyInputResolver,
    PropertyInput: PropertyInput,
    settings: settings,
    subjectProperties: subjectProperties,
    getPropertyPermission: getPropertyPermission
  }).then(function (data) {
    var allowableStages = stageProperties.map(function (prop) {
      return prop.get('property');
    }).toJS();
    var changes = pick([].concat(_toConsumableArray(Array.from(allowableStages)), _toConsumableArray(Array.from(closeStageProperties))), data);
    return saveCallback(changes);
  }, function () {
    cancelCallback();
  });
});