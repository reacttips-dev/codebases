'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { alertSuccess, alertFailure } from '../../utils/alerts';
import { getIsRestorable } from 'crm-index-ui/crmObjects/methods/getIsRestorable';
import { getSingularForm } from 'crm-index-ui/crmObjects/methods/getSingularForm';
import { getPluralForm } from 'crm-index-ui/crmObjects/methods/getPluralForm';
import links from 'crm-legacy-links/links';
import UILink from 'UIComponents/link/UILink';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
export var doSuccessAlert = function doSuccessAlert(_ref) {
  var count = _ref.count,
      typeDef = _ref.typeDef;
  var singularObjectName = getSingularForm(typeDef);
  var pluralObjectName = getPluralForm(typeDef);
  var isRestorable = getIsRestorable(typeDef);
  var href = links.recyclingBin(typeDef.objectTypeId);
  return alertSuccess({
    options: {
      timeout: 15 * 1000
    },
    // 15 seconds
    message: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "index.alerts.bulkDelete.success.message",
      options: {
        count: count,
        singularObjectName: singularObjectName,
        pluralObjectName: pluralObjectName,
        restoreLink: isRestorable ? /*#__PURE__*/_jsx(UILink, {
          href: href,
          external: true,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "index.alerts.bulkDelete.success.restoreLink",
            options: {
              count: count,
              singularObjectName: singularObjectName,
              pluralObjectName: pluralObjectName
            }
          })
        }) : ''
      }
    })
  });
};
export var doFailureAlert = function doFailureAlert(count) {
  return alertFailure({
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.alerts.bulkDelete.failure.title",
      options: {
        count: count
      }
    })
  });
};