'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import FormattedDateTime from 'I18n/components/FormattedDateTime';
import UILink from 'UIComponents/link/UILink';
import { ACCOUNT_TYPES, CHANNEL_VALIDATION, DISCONNECT_SOCIAL_ACCOUNTS_FROM_HS, FACEBOOK_PERMISSIONS_LEARN_MORE_URL, FB_IG_SCOPES_LEARN_MORE_URL, CONNECT_SOCIAL_NETWORK_TO_HS, ACCOUNT_EXPIRED_DAYS_FACEBOOK, ACCOUNT_EXPIRED_DAYS_LINKEDIN } from '../../lib/constants';
import { setProp } from '../../lib/propTypes';

var LineBreak = function LineBreak() {
  return /*#__PURE__*/_jsx("div", {
    className: "m-bottom-3"
  });
};

var getLearnMoreUrl = function getLearnMoreUrl(errors) {
  if (errors.includes(CHANNEL_VALIDATION.EXPIRED) || errors.includes(CHANNEL_VALIDATION.WILL_EXPIRE)) {
    return DISCONNECT_SOCIAL_ACCOUNTS_FROM_HS;
  } else if (errors.includes(CHANNEL_VALIDATION.FB_PAGE_PERMISSIONS)) {
    return FACEBOOK_PERMISSIONS_LEARN_MORE_URL;
  } else if (errors.includes(CHANNEL_VALIDATION.FB_CHANNEL_SCOPES)) {
    return FB_IG_SCOPES_LEARN_MORE_URL;
  }

  return CONNECT_SOCIAL_NETWORK_TO_HS;
};

var isFacebookOrInstagramChannel = function isFacebookOrInstagramChannel(accountSlug) {
  return accountSlug === ACCOUNT_TYPES.instagram || accountSlug === ACCOUNT_TYPES.facebook;
};

var getTooltipMessage = function getTooltipMessage(userCanConfigure, errors, accountSlug) {
  var message;

  if (errors.size > 1) {
    if (isFacebookOrInstagramChannel(accountSlug)) {
      if (errors.includes(CHANNEL_VALIDATION.EXPIRED)) {
        message = "sui.accounts.table.messages.accountIssues.MULTIPLE_EXPIRED." + (userCanConfigure ? 'canConfigure' : 'canNotConfigure') + ".message_jsx";
      } else if (errors.includes(CHANNEL_VALIDATION.WILL_EXPIRE)) {
        message = "sui.accounts.table.messages.accountIssues.MULTIPLE_WILL_EXPIRE." + (userCanConfigure ? 'canConfigure' : 'canNotConfigure') + ".message_jsx";
      } else {
        message = "sui.accounts.table.messages.accountIssues.MULTIPLE_PERMISSIONS." + (userCanConfigure ? 'canConfigure' : 'canNotConfigure') + ".message_jsx";
      }
    } else {
      message = "sui.accounts.table.messages.accountIssues." + errors.first() + "." + (userCanConfigure ? 'canConfigure' : 'canNotConfigure') + ".other.message_jsx";
    }
  } else {
    var error = errors.first();

    if (error === CHANNEL_VALIDATION.EXPIRED || error === CHANNEL_VALIDATION.WILL_EXPIRE) {
      if (isFacebookOrInstagramChannel(accountSlug)) {
        message = "sui.accounts.table.messages.accountIssues." + error + "." + (userCanConfigure ? 'canConfigure' : 'canNotConfigure') + ".facebookOrInstagram.message_jsx";
      } else {
        message = "sui.accounts.table.messages.accountIssues." + error + "." + (userCanConfigure ? 'canConfigure' : 'canNotConfigure') + ".other.message_jsx";
      }
    } else {
      message = "sui.accounts.table.messages.accountIssues." + error + "." + (userCanConfigure ? 'canConfigure' : 'canNotConfigure') + ".message_jsx";
    }
  }

  return message;
};

var getExpiringDaysFromNetwork = function getExpiringDaysFromNetwork(network) {
  if (network === ACCOUNT_TYPES.facebook || network === ACCOUNT_TYPES.instagram) {
    return ACCOUNT_EXPIRED_DAYS_FACEBOOK;
  }

  return ACCOUNT_EXPIRED_DAYS_LINKEDIN;
};

var AccountIssuesTooltipContent = function AccountIssuesTooltipContent(props) {
  var onClickReauthorize = props.onClickReauthorize,
      expiresAt = props.expiresAt,
      userCanConfigure = props.userCanConfigure,
      publishingErrors = props.publishingErrors,
      accountSlug = props.accountSlug;
  var message = getTooltipMessage(userCanConfigure, publishingErrors, accountSlug);
  return /*#__PURE__*/_jsx(FormattedJSXMessage, {
    message: message,
    elements: {
      UILink: UILink,
      FormattedDateTime: FormattedDateTime,
      LineBreak: LineBreak
    },
    options: {
      network: props.accountSlug.replace(/\b\w/g, function (l) {
        return l.toUpperCase();
      }),
      reconnectUrl: onClickReauthorize,
      learnMoreUrl: getLearnMoreUrl(publishingErrors),
      expiresAt: expiresAt,
      days: getExpiringDaysFromNetwork(props.accountSlug)
    }
  });
};

AccountIssuesTooltipContent.propTypes = {
  publishingErrors: setProp.isRequired,
  accountSlug: PropTypes.string.isRequired,
  userCanConfigure: PropTypes.bool.isRequired,
  expiresAt: PropTypes.number,
  onClickReauthorize: PropTypes.func.isRequired
};
export default AccountIssuesTooltipContent;