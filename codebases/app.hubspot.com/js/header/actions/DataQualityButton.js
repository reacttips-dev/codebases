'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { CONTACT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { CrmObjectTypeRecord } from 'crm_data/crmObjectTypes/CrmObjectTypeRecords';
import { isWordPress } from 'hubspot-plugin-common'; // import * as PageTypes from 'customer-data-objects/view/PageTypes';

import PortalIdParser from 'PortalIdParser';
import UIButton from 'UIComponents/button/UIButton'; // import UILockedFeature from 'ui-addon-upgrades/decorators/UILockedFeature';
// import UILock from 'ui-addon-upgrades/icons/UILock';

import FormattedMessage from 'I18n/components/FormattedMessage';
import withGateOverride from 'crm_data/gates/withGateOverride';
var portalId = PortalIdParser.get(); // NOTE: data quality only exists for contacts

export var getDataQualityLink = function getDataQualityLink(objectTypeId) {
  switch (objectTypeId) {
    case CONTACT_TYPE_ID:
      {
        return "/property-health-ui/" + portalId + "/contacts";
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
        return 'dataQualityCenterNoPermissions.CONTACT';
      }

    default:
      {
        return null;
      }
  }
};

var DataQualityButton = function DataQualityButton(_ref) {
  var objectTypeId = _ref.typeDef.objectTypeId,
      hasAllScopes = _ref.hasAllScopes,
      hasAllGates = _ref.hasAllGates;
  var href = getDataQualityLink(objectTypeId);

  if (!href || isWordPress) {
    return null;
  }

  var hasDQGate = withGateOverride('DataQuality:PropertyFormatter:V1', hasAllGates('DataQuality:PropertyFormatter:V1'));
  var hasDQPermissionScope = hasAllScopes('property-formatter-read') || hasAllScopes('property-formatter-write');
  var canEditDataQuality = hasDQGate && hasDQPermissionScope;

  if (!canEditDataQuality) {
    return null;
  } // TODO: will enable this code when the feature block image is here
  // const upgradeData = {
  //   app: 'crm_ui',
  //   screen: PageTypes.INDEX,
  //   upgradeProduct: 'marketing-pro',
  //   uniqueId: 'property-health-ui',
  // };
  // const hasDataQualityFeature =
  //   (hasAllScopes('DataQuality:PropertyFormatter:V1') &&
  //     (hasAllScopes('property-formatter-read') ||
  //       hasAllScopes('property-formatter-write'))) ||
  //   hasAllScopes('super-admin');
  // if (!hasDataQualityFeature) {
  //   return (
  //     <UILockedFeature
  //       isDropdownOption={true}
  //       modalMountDelay={0}
  //       modalKey="property-health-ui"
  //       upgradeData={upgradeData}
  //     >
  //       <UIButton data-test-id="manage-data-blocked-quality-button">
  //         <FormattedMessage
  //           message="topbarContents.dataQualityCenter"
  //           useGap={true}
  //         />
  //         <UILock />
  //       </UIButton>
  //     </UILockedFeature>
  //   );
  // }


  return /*#__PURE__*/_jsx(UIButton, {
    "data-test-id": "data-quality-action-button",
    external: true,
    href: href,
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "topbarContents.dataQualityCenter"
    })
  });
};

DataQualityButton.propTypes = {
  hasAllScopes: PropTypes.func.isRequired,
  hasAllGates: PropTypes.func.isRequired,
  typeDef: PropTypes.instanceOf(CrmObjectTypeRecord)
};
export default DataQualityButton;