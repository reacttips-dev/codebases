'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { KOALA, GYPSUM } from 'HubStyleTokens/colors';
import partial from 'transmute/partial';
import { hasSalesProSeat } from 'SequencesUI/lib/permissions';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIButton from 'UIComponents/button/UIButton';
import Small from 'UIComponents/elements/Small';
import UILockedFeature from 'ui-addon-upgrades/decorators/UILockedFeature';
import UILock from 'ui-addon-upgrades/icons/UILock';

var EnrollContactFooter = function EnrollContactFooter(_ref) {
  var selectedContacts = _ref.selectedContacts,
      onConfirm = _ref.onConfirm,
      onReject = _ref.onReject;
  var shouldShowPQL = !hasSalesProSeat();
  var numberOfContactsSelected = selectedContacts.size;
  return /*#__PURE__*/_jsx(UIDialogFooter, {
    style: {
      borderTop: "solid 1px " + KOALA,
      background: GYPSUM
    },
    children: /*#__PURE__*/_jsxs(UIFlex, {
      align: "center",
      children: [/*#__PURE__*/_jsx(UIButton, {
        use: "primary",
        disabled: selectedContacts.isEmpty(),
        onClick: partial(onConfirm, selectedContacts),
        "data-selenium-test": "enroll-contact-footer-next-button",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.enroll.footer.next"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        onClick: onReject,
        "data-selenium-test": "enroll-contact-footer-cancel-button",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.enroll.footer.cancel"
        })
      }), !!numberOfContactsSelected && /*#__PURE__*/_jsx(Small, {
        className: "p-left-4",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.enroll.footer.selectedCount",
          options: {
            numberOfContactsSelected: numberOfContactsSelected
          }
        })
      }), shouldShowPQL && /*#__PURE__*/_jsx(UILockedFeature, {
        modalKey: "sequences-legacy-starter-upgrade",
        upgradeData: {
          app: 'sequences-ui',
          screen: 'summary',
          upgradeProduct: 'sales-professional',
          uniqueId: 'sequences-ui-bulk-enroll'
        },
        children: /*#__PURE__*/_jsxs(UIButton, {
          use: "link",
          className: "m-left-auto",
          children: [/*#__PURE__*/_jsx(FormattedMessage, {
            message: "summary.enroll.footer.enrollMultipleContacts"
          }), /*#__PURE__*/_jsx(UILock, {
            className: "m-left-1"
          })]
        })
      })]
    })
  });
};

EnrollContactFooter.propTypes = {
  selectedContacts: PropTypes.instanceOf(ImmutableMap),
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};
export default EnrollContactFooter;