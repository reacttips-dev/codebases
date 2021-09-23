'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import { useCallback, useContext } from 'react';
import SocialContext from '../components/app/SocialContext';
import { useDispatch, useSelector } from 'react-redux';
import { getAppRoot, APP_SECTIONS, ACCOUNT_TYPES, LINKEDIN_DELETION_GAP_DAYS } from '../lib/constants';
import { onDismissBanner } from '../redux/actions/users';
import { uppercaseFirstLetter } from '../lib/utils';
import { getPortalId } from '../redux/selectors';
import UIAlert from 'UIComponents/alert/UIAlert';
import UILink from 'UIComponents/link/UILink';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import FormattedDateTime from 'I18n/components/FormattedDateTime';

function AccountsStatusBannerAlert(_ref) {
  var id = _ref.id,
      isExpired = _ref.isExpired,
      accounts = _ref.accounts,
      section = _ref.section,
      dismissedBanners = _ref.dismissedBanners;
  var portalId = useSelector(getPortalId);

  var _useContext = useContext(SocialContext),
      trackInteraction = _useContext.trackInteraction;

  var dispatch = useDispatch();
  var accountNames = accounts.map(function (a) {
    return a.name;
  }).toSet();
  var expiresAt = accounts.first().accountExpiresAt;
  var bannerId = id + "-" + expiresAt;
  var network = accounts.map(function (a) {
    return a.accountSlug;
  }).toSet();
  var expiration = isExpired ? 'isExpired' : 'willExpire';
  var isLinkedinSpecific = !network || network.isEmpty() || network.size > 1 ? false : network.first() === ACCOUNT_TYPES.linkedin;
  var networkSpecific = isLinkedinSpecific ? 'linkedin' : 'generic';
  var multipleAccounts = accountNames.size > 1 ? 'other' : 'one';
  var isSettings = section === APP_SECTIONS.settings ? 'settings' : 'default';
  var tooltipClickHandler = useCallback(function () {
    trackInteraction(('bannerAlert', {
      action: 'click settings link',
      section: section
    }));
  }, [section, trackInteraction]);
  var onCloseBanner = useCallback(function () {
    trackInteraction(('bannerAlert', {
      action: 'close banner',
      section: section
    }));
    dispatch(onDismissBanner(bannerId));
  }, [bannerId, trackInteraction, section, dispatch]);

  if (accountNames.isEmpty() || dismissedBanners.includes(bannerId)) {
    return null;
  }

  return /*#__PURE__*/_jsx(UIAlert, {
    className: "m-bottom-5",
    titleText: /*#__PURE__*/_jsx(FormattedJSXMessage, {
      message: "sui.accountsExpiringBanner.title." + expiration + "." + networkSpecific + "." + multipleAccounts + ".title_jsx",
      elements: {
        FormattedDateTime: FormattedDateTime
      },
      options: {
        pageName: accountNames.join(''),
        // we will show only page name when there's only 1 account
        daysLeft: I18n.moment(expiresAt).diff(I18n.moment(), 'days') || 1,
        expiresAt: expiresAt,
        network: network.size > 1 ? '' : uppercaseFirstLetter(network.first())
      }
    }),
    type: isExpired ? 'danger' : 'warning',
    closeable: true,
    onClose: onCloseBanner,
    children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
      message: "sui.accountsExpiringBanner." + isSettings + "." + expiration + "." + networkSpecific + "." + multipleAccounts + ".text_jsx",
      elements: {
        UILink: UILink,
        FormattedDateTime: FormattedDateTime
      },
      options: {
        onClick: tooltipClickHandler,
        count: accountNames.size,
        url: "/" + getAppRoot() + "/" + portalId + "/settings",
        deletionDateAt: I18n.moment(expiresAt).add(LINKEDIN_DELETION_GAP_DAYS, 'days'),
        pageName: accountNames.first(),
        expiresAt: expiresAt
      }
    })
  });
}

export default AccountsStatusBannerAlert;