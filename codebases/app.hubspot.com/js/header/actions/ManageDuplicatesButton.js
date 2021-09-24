'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { COMPANY_TYPE_ID, CONTACT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { CrmObjectTypeRecord } from 'crm_data/crmObjectTypes/CrmObjectTypeRecords';
import { isWordPress } from 'hubspot-plugin-common';
import * as PageTypes from 'customer-data-objects/view/PageTypes';
import PortalIdParser from 'PortalIdParser';
import UIButton from 'UIComponents/button/UIButton';
import PermissionTooltip from 'customer-data-objects-ui-components/permissions/PermissionTooltip';
import UILockedFeature from 'ui-addon-upgrades/decorators/UILockedFeature';
import UILock from 'ui-addon-upgrades/icons/UILock';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
var portalId = PortalIdParser.get(); // NOTE: Duplicates only exists for contacts and companies

export var getDuplicatesLink = function getDuplicatesLink(objectTypeId) {
  switch (objectTypeId) {
    case CONTACT_TYPE_ID:
      {
        return "/duplicates/" + portalId + "/contacts";
      }

    case COMPANY_TYPE_ID:
      {
        return "/duplicates/" + portalId + "/companies";
      }

    default:
      {
        return null;
      }
  }
};
export var getPermissionsTooltipKey = function getPermissionsTooltipKey(objectTypeId) {
  switch (objectTypeId) {
    case CONTACT_TYPE_ID:
      {
        return 'duplicatesCenterNoPermissions.CONTACT';
      }

    case COMPANY_TYPE_ID:
      {
        return 'duplicatesCenterNoPermissions.COMPANY';
      }

    default:
      {
        return null;
      }
  }
};
var upgradeData = {
  app: 'crm_ui',
  screen: PageTypes.INDEX,
  upgradeProduct: 'marketing-pro',
  uniqueId: 'records-dedupe'
};

var ManageDuplicatesButton = function ManageDuplicatesButton(_ref) {
  var objectTypeId = _ref.typeDef.objectTypeId,
      hasAllScopes = _ref.hasAllScopes;
  var href = getDuplicatesLink(objectTypeId);

  if (!href || isWordPress) {
    return null;
  } // HACK: We do not have a 'duplicates-access' scope, so we use these two scopes as a proxy
  // to check if the user can manage duplicates. If we did have an access scope, we would instead
  // be checking 'duplicates-write' here.


  var canEditDuplicates = hasAllScopes('super-admin') || hasAllScopes('crm-edit-all');

  if (!canEditDuplicates) {
    return /*#__PURE__*/_jsx(PermissionTooltip, {
      placement: "left",
      tooltipKey: getPermissionsTooltipKey(objectTypeId),
      children: /*#__PURE__*/_jsx(UIButton, {
        "data-test-id": "manage-duplicates-permissions-button",
        external: true,
        disabled: true,
        href: href,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "topbarContents.duplicatesCenter"
        })
      })
    });
  } // HACK: We do not have a 'duplicates-access' scope, so we use write to determine if
  // the portal has access to the feature. If we did have an access scope, we would use
  // that here.


  var hasDuplicatesFeature = hasAllScopes('duplicates-write');

  if (!hasDuplicatesFeature) {
    return /*#__PURE__*/_jsx(UILockedFeature, {
      isDropdownOption: true,
      modalMountDelay: 0,
      modalKey: "records-dedupe",
      upgradeData: upgradeData,
      children: /*#__PURE__*/_jsxs(UIButton, {
        "data-test-id": "manage-duplicates-pql-button",
        children: [/*#__PURE__*/_jsx(FormattedMessage, {
          message: "topbarContents.duplicatesCenter",
          useGap: true
        }), /*#__PURE__*/_jsx(UILock, {})]
      })
    });
  }

  return /*#__PURE__*/_jsx(UIButton, {
    "data-test-id": "manage-duplicates-action-button",
    external: true,
    href: href,
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "topbarContents.duplicatesCenter"
    })
  });
};

ManageDuplicatesButton.propTypes = {
  hasAllScopes: PropTypes.func.isRequired,
  typeDef: PropTypes.instanceOf(CrmObjectTypeRecord)
};
export default ManageDuplicatesButton;