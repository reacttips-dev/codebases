'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { CrmObjectTypeRecord } from 'crm_data/crmObjectTypes/CrmObjectTypeRecords';
import { getSingularForm } from '../../crmObjects/methods/getSingularForm';
import { MARKETING_EVENT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
export var getCreateAccessScopes = function getCreateAccessScopes(objectTypeId) {
  switch (objectTypeId) {
    case MARKETING_EVENT_TYPE_ID:
      return ['marketing-events-read', 'marketing-events-write'];

    default:
      return ['custom-object-access', 'custom-object-write'];
  }
};

var CreateObjectButton = function CreateObjectButton(_ref) {
  var hasAllScopes = _ref.hasAllScopes,
      onCreateObject = _ref.onCreateObject,
      typeDef = _ref.typeDef;
  var hasCreateAccess = hasAllScopes.apply(void 0, _toConsumableArray(getCreateAccessScopes(typeDef.objectTypeId)));
  var objectName = getSingularForm(typeDef);
  return /*#__PURE__*/_jsx(UITooltip, {
    disabled: hasCreateAccess,
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "indexPage.header.createObjectButton.customObjectDisabledTooltip"
    }),
    children: /*#__PURE__*/_jsx(UIButton, {
      size: "small",
      className: "m-left-3",
      disabled: !hasCreateAccess,
      onClick: onCreateObject,
      use: "primary",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "indexPage.header.createObjectButton.customObjectButtonText",
        options: {
          objectName: objectName
        }
      })
    })
  });
};

CreateObjectButton.propTypes = {
  hasAllScopes: PropTypes.func.isRequired,
  onCreateObject: PropTypes.func.isRequired,
  typeDef: PropTypes.instanceOf(CrmObjectTypeRecord)
};
export default CreateObjectButton;