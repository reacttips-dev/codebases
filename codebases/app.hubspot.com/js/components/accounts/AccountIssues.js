'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UITooltipContent from 'UIComponents/tooltip/UITooltipContent';
import UIStatusTag from 'UIComponents/tag/UIStatusTag';
import { CHANNEL_VALIDATION, CHANNEL_VALIDATION_ERRORS } from '../../lib/constants';
import { setProp } from '../../lib/propTypes';
import { passPropsFor } from '../../lib/utils';
import AccountIssuesTooltipContent from './AccountIssuesTooltipContent';
var TAG_STATUS = {
  ERROR: 'error',
  WARNING: 'warning'
};

var getAccountStatusMessage = function getAccountStatusMessage(userCanConfigure, errors, expiresAt) {
  if (errors.size > 1) {
    return I18n.text('sui.accounts.table.messages.accountIssues.multipleIssues');
  }

  var error = errors.first();
  var daysDifference = I18n.moment(expiresAt).diff(I18n.moment(), 'days');

  switch (error) {
    case CHANNEL_VALIDATION.EXPIRED:
      return I18n.text("sui.accounts.table.messages.accountIssues." + error + "." + (userCanConfigure ? 'canConfigure' : 'canNotConfigure') + ".overview");

    case CHANNEL_VALIDATION.WILL_EXPIRE:
      return I18n.text("sui.accounts.table.messages.accountIssues." + error + ".overview", {
        // When the difference is less than 24h, moment().diff() returns 0.
        count: daysDifference || 1
      });

    default:
      return I18n.text("sui.accounts.table.messages.accountIssues." + error + ".overview");
  }
};

var getStatusTagType = function getStatusTagType(errors) {
  return errors.some(function (error) {
    return CHANNEL_VALIDATION_ERRORS.includes(error);
  }) ? TAG_STATUS.ERROR : TAG_STATUS.WARNING;
};

var AccountIssues = function AccountIssues(props) {
  var renderTooltipContent = function renderTooltipContent() {
    props.trackInteraction('render tooltip', {
      errors: props.publishingErrors.join(', ')
    }, {
      onlyOnce: true
    });
    return /*#__PURE__*/_jsx(UITooltipContent, {
      children: /*#__PURE__*/_jsx(AccountIssuesTooltipContent, Object.assign({}, passPropsFor(props, AccountIssuesTooltipContent)))
    });
  };

  var expiresAt = props.expiresAt,
      publishingErrors = props.publishingErrors,
      userCanConfigure = props.userCanConfigure;

  if (publishingErrors.isEmpty()) {
    return null;
  }

  return /*#__PURE__*/_jsx(UITooltip, {
    Content: renderTooltipContent,
    use: "longform",
    children: /*#__PURE__*/_jsx(UIStatusTag, {
      use: getStatusTagType(publishingErrors),
      children: /*#__PURE__*/_jsx("a", {
        className: "account-status",
        children: getAccountStatusMessage(userCanConfigure, publishingErrors, expiresAt)
      })
    })
  });
};

AccountIssues.propTypes = {
  publishingErrors: setProp.isRequired,
  accountSlug: PropTypes.string.isRequired,
  userCanConfigure: PropTypes.bool.isRequired,
  expiresAt: PropTypes.number,
  onClickReauthorize: PropTypes.func.isRequired,
  trackInteraction: PropTypes.func.isRequired
};
export default AccountIssues;