'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useSelector } from 'react-redux';
import AccountsStatusBannerAlert from './AccountsStatusBannerAlert';
import { getExpiredChannels } from '../redux/selectors/channels';
import { APP_SECTIONS } from '../lib/constants';
import { getDismissedBanners } from '../redux/actions/users';

function AccountsStatusBanner() {
  var channels = useSelector(getExpiredChannels);
  var dismissedBanners = useSelector(getDismissedBanners);

  if (!channels || channels && channels.get('expired').isEmpty() && channels.get('willExpire').isEmpty()) {
    return null;
  }

  var accountsExpired = channels.get('expired');
  var accountsWillExpire = channels.get('willExpire');
  return /*#__PURE__*/_jsxs("div", {
    children: [!accountsExpired.isEmpty() && /*#__PURE__*/_jsx(AccountsStatusBannerAlert, {
      dismissedBanners: dismissedBanners,
      section: APP_SECTIONS.manage,
      isExpired: true,
      accounts: accountsExpired,
      id: "expired-accounts"
    }), !accountsWillExpire.isEmpty() && /*#__PURE__*/_jsx(AccountsStatusBannerAlert, {
      dismissedBanners: dismissedBanners,
      section: APP_SECTIONS.manage,
      isExpired: false,
      accounts: accountsWillExpire,
      id: "will-expire-accounts"
    })]
  });
}

export default AccountsStatusBanner;