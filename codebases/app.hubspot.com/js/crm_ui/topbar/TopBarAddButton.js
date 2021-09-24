'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import PortalIdParser from 'PortalIdParser';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIButton from 'UIComponents/button/UIButton';
import { COMPANY, CONTACT, DEAL, TASK, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import UIColumn from 'UIComponents/column/UIColumn';
import PermissionTooltip from 'customer-data-objects-ui-components/permissions/PermissionTooltip';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import withGateOverride from 'crm_data/gates/withGateOverride';
import { useStoreDependency } from 'general-store';
import ObjectBuilderClient from 'object-builder-ui-client';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import ScopesContainer from '../../containers/ScopesContainer';
import canCreate from '../utils/canCreate';
import BizOpsCreateContactContainer from '../modals/dialogs/bizops/BizOpsCreateContactContainer';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { betDealCreationRestricted } from 'customer-data-objects/permissions/BETPermissions';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import { isScoped } from '../../containers/ScopeOperators';
import { CreateObjectEmbeddedDialog, useDeepLinks } from 'object-embed-client';
import { useCallback, useRef, useState } from 'react';
import emptyFunction from 'react-utils/emptyFunction';
import { CRM_UI } from 'customer-data-objects/property/PropertySourceTypes';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
var hasObjectEmbedPlusDependency = {
  stores: [IsUngatedStore],
  deref: function deref() {
    return withGateOverride('CRM:object-embed-plus-dev', IsUngatedStore.get('CRM:object-embed-plus-dev'));
  }
};
var hasContactObjectEmbedPlusDependency = {
  stores: [IsUngatedStore],
  deref: function deref() {
    return withGateOverride('CRM:object-embed-plus:CONTACT:index', IsUngatedStore.get('CRM:object-embed-plus:CONTACT:index'));
  }
};
var hasCompanyObjectEmbedPlusDependency = {
  stores: [IsUngatedStore],
  deref: function deref() {
    return withGateOverride('CRM:object-embed-plus:COMPANY:index', IsUngatedStore.get('CRM:object-embed-plus:COMPANY:index'));
  }
};
var hasDealObjectEmbedPlusDependency = {
  stores: [IsUngatedStore],
  deref: function deref() {
    return withGateOverride('CRM:object-embed-plus:DEAL:index', IsUngatedStore.get('CRM:object-embed-plus:DEAL:index'));
  }
};
var hasTicketObjectEmbedPlusDependency = {
  stores: [IsUngatedStore],
  deref: function deref() {
    return withGateOverride('CRM:object-embed-plus:TICKET:index', IsUngatedStore.get('CRM:object-embed-plus:TICKET:index'));
  }
};

var betCreateContactHandler = function betCreateContactHandler() {
  CrmLogger.logForBizOps(CONTACT, {
    action: 'Coldsource Contact Modal - Add Contact Clicked'
  });
  return BizOpsCreateContactContainer();
};

var getDefaultPipelineProperty = function getDefaultPipelineProperty(objectType, pipelineId) {
  var pipelineProperty = {};

  if (objectType === DEAL && pipelineId) {
    pipelineProperty = {
      pipeline: pipelineId
    };
  }

  if (objectType === TICKET && pipelineId) {
    pipelineProperty = {
      hs_pipeline: pipelineId
    };
  }

  return pipelineProperty;
};

var CreateButton = function CreateButton(_ref) {
  var onClick = _ref.onClick,
      objectType = _ref.objectType,
      disabled = _ref.disabled;
  var key;

  switch (objectType) {
    case COMPANY:
      key = 'contentToolbar.addCompanyButton';
      break;

    case DEAL:
      key = 'contentToolbar.addDealButton';
      break;

    case CONTACT:
      key = 'contentToolbar.addContactButton';
      break;

    case TASK:
      key = 'contentToolbar.addTaskButton';
      break;

    case TICKET:
      key = 'contentToolbar.addTicketButton';
      break;

    default:
      key = null;
  }

  return /*#__PURE__*/_jsx(UIButton, {
    use: "primary",
    size: "small",
    onClick: onClick,
    className: "add-obj",
    "data-onboarding": "new-object-button",
    "data-selenium-test": "new-object-button",
    disabled: disabled,
    children: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: key
    })
  });
};

CreateButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  objectType: AnyCrmObjectTypePropType.isRequired,
  onClick: PropTypes.func.isRequired
};

var BETButtonLogicWrapper = function BETButtonLogicWrapper(_ref2) {
  var disabled = _ref2.disabled,
      objectType = _ref2.objectType,
      onClick = _ref2.onClick;

  var defaultButton = /*#__PURE__*/_jsx(AddButton, {
    onClick: onClick,
    disabled: disabled,
    objectType: objectType
  });

  switch (objectType) {
    case CONTACT:
      {
        var isBetCreateContact = isScoped(ScopesContainer.get(), 'bet-contact-creation-flow-access');
        return isBetCreateContact ? /*#__PURE__*/_jsx(AddButton, {
          onClick: betCreateContactHandler,
          disabled: disabled,
          objectType: objectType
        }) : defaultButton;
      }

    case DEAL:
      {
        var betRestricted = betDealCreationRestricted(ScopesContainer.get());
        return betRestricted ? /*#__PURE__*/_jsx(BetRestrictedAddDealButton, {
          onClick: onClick,
          objectType: objectType
        }) : defaultButton;
      }

    default:
      return defaultButton;
  }
};

var BetRestrictedAddDealButton = function BetRestrictedAddDealButton() {
  // Is is an information button that is rendered if the user has restricted access
  // It is not clickable and doesn't require a onclick handler.
  return /*#__PURE__*/_jsx(UITooltip, {
    title: I18n.text('bet.BETDealPermissions.cannotCreateDeal'),
    placement: "left bottom",
    disabled: false,
    children: /*#__PURE__*/_jsx(CreateButton, {
      onClick: emptyFunction,
      objectType: DEAL,
      disabled: true
    })
  });
};

var AddButton = function AddButton(_ref3) {
  var disabled = _ref3.disabled,
      objectType = _ref3.objectType,
      onClick = _ref3.onClick;
  var isDisabled = disabled || !canCreate(objectType);
  var objectTypeLabel = I18n.text("genericTypes." + objectType);
  return /*#__PURE__*/_jsx(PermissionTooltip, {
    tooltipKey: "createDisabled",
    tooltipOptions: {
      objectTypeLabel: objectTypeLabel
    },
    placement: "left bottom",
    disabled: !isDisabled,
    children: /*#__PURE__*/_jsx(CreateButton, {
      onClick: onClick,
      objectType: objectType,
      disabled: isDisabled
    })
  });
};

var TopBarAddButton = function TopBarAddButton(props) {
  var _rootUrl;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showObjectBuilder = _useState2[0],
      toggleShowObjectBuilder = _useState2[1];

  var dialog = useRef();
  var hasObjectEmbedPlus = useStoreDependency(hasObjectEmbedPlusDependency);
  var hasContactObjectEmbedPlus = useStoreDependency(hasContactObjectEmbedPlusDependency);
  var hasCompanyObjectEmbedPlus = useStoreDependency(hasCompanyObjectEmbedPlusDependency);
  var hasDealObjectEmbedPlus = useStoreDependency(hasDealObjectEmbedPlusDependency);
  var hasTicketObjectEmbedPlus = useStoreDependency(hasTicketObjectEmbedPlusDependency);
  var hasObjectBuilderGate = hasObjectEmbedPlus || hasContactObjectEmbedPlus && props.objectType === CONTACT || hasCompanyObjectEmbedPlus && props.objectType === COMPANY || hasDealObjectEmbedPlus && props.objectType === DEAL || hasTicketObjectEmbedPlus && props.objectType === TICKET;

  var onClick = function onClick() {
    if (hasObjectBuilderGate) {
      toggleShowObjectBuilder(true);
    } else {
      dialog.current.show();
    }
  };

  var pipelineProperty = getDefaultPipelineProperty(props.objectType, props.pipelineId);

  var _useDeepLinks = useDeepLinks(),
      _useDeepLinks2 = _slicedToArray(_useDeepLinks, 3),
      showOnMount = _useDeepLinks2[0],
      objectType = _useDeepLinks2[1],
      defaultPropertiesFromUrl = _useDeepLinks2[2];

  var defaultProperties = Object.assign({}, pipelineProperty, {}, defaultPropertiesFromUrl);
  var rootUrl = (_rootUrl = {}, _defineProperty(_rootUrl, CONTACT, 'contact'), _defineProperty(_rootUrl, COMPANY, 'company'), _defineProperty(_rootUrl, DEAL, 'deal'), _defineProperty(_rootUrl, TICKET, 'ticket'), _rootUrl);
  var onClose = useCallback(function (_ref4) {
    var createdObjectId = _ref4.createdObjectId;
    toggleShowObjectBuilder(false);

    if (createdObjectId) {
      props.onCreateSuccess({
        objectId: createdObjectId
      });
      window.location.href = "/contacts/" + PortalIdParser.get() + "/" + rootUrl[props.objectType] + "/" + createdObjectId;
    }
  }, [props, rootUrl]);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(UIColumn, {
      className: "m-left-3",
      children: /*#__PURE__*/_jsx("div", {
        className: "add-control",
        children: /*#__PURE__*/_jsx(BETButtonLogicWrapper, {
          disabled: props.disabled,
          objectType: props.objectType,
          onClick: onClick
        })
      })
    }), hasObjectBuilderGate && showObjectBuilder ? /*#__PURE__*/_jsx(ObjectBuilderClient, {
      appInfo: {},
      objectTypeId: ObjectTypesToIds[props.objectType],
      onClose: onClose
    }) : /*#__PURE__*/_jsx(CreateObjectEmbeddedDialog, {
      defaultProperties: defaultProperties,
      objectType: objectType || props.objectType,
      onCreate: props.onCreateSuccess,
      pipelineId: props.pipelineId,
      ref: dialog,
      showOnMount: showOnMount,
      sourceApp: CRM_UI,
      use: "sidebar"
    })]
  });
};

TopBarAddButton.propTypes = {
  disabled: PropTypes.bool,
  objectType: ObjectTypesType.isRequired,
  pipelineId: PropTypes.string,
  onCreateSuccess: PropTypes.func
};
export default TopBarAddButton;