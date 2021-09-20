/* eslint-disable import/no-default-export */
import { dontUpsell, isTouch } from '@trello/browser';
import Cookies from 'js-cookie';
import {
  PopoverMenu,
  PopoverMenuButton,
  PopoverMenuLink,
} from 'app/src/components/PopoverMenu';
import { State } from 'app/gamma/src/modules/types';
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { hasMemberOrOrgAccount } from 'app/gamma/src/selectors/accounts';
import { getMe } from 'app/gamma/src/selectors/members';
import { MemberModel } from 'app/gamma/src/types/models';
import { HeaderTestIds } from '@trello/test-ids';
import { forTemplate } from '@trello/i18n';
import AccountSwitcherMenu from 'app/gamma/src/components/popovers/account-switcher';
import { featureFlagClient } from '@trello/feature-flag-client';

const format = forTemplate('header_member_menu');

interface MemberMenuStateProps {
  canLogout: boolean;
  me: MemberModel | undefined;
  showBillingUrl: boolean;
}

interface MemberMenuDispatchProps {
  onClickShortcuts: () => void;
  onClickMenuLink: () => void;
  onClickAddAccount: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  useAccountSwitcher: boolean | undefined;
  hasAaAccount: boolean | undefined;
}

interface MemberMenuProps
  extends MemberMenuStateProps,
    MemberMenuDispatchProps {}

const mapStateToProps = (state: State): MemberMenuStateProps => {
  const me = getMe(state);
  const legacyGoldAccountCheck = hasMemberOrOrgAccount(state);
  const goldSunsetEnabled = featureFlagClient.get(
    'nusku.repackaging-gtm.gold-sunset',
    false,
  );

  return {
    canLogout: !!(me && me.loginTypes && me.loginTypes.length),
    me,
    showBillingUrl:
      !dontUpsell() &&
      (goldSunsetEnabled ? Boolean(me?.paidAccount) : legacyGoldAccountCheck),
  };
};

const HeaderMemberMenu: React.FunctionComponent<MemberMenuProps> = ({
  canLogout,
  me,
  useAccountSwitcher,
  showBillingUrl,
  onClickShortcuts,
  onClickMenuLink,
  onClickAddAccount,
  hasAaAccount,
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  if (!me) {
    return null;
  }

  return (
    <>
      {/* Hidden form used for logging out */}
      <form
        method="post"
        action="/logout"
        style={{ display: 'none' }}
        ref={formRef}
      >
        <input name="dsc" defaultValue={Cookies.get('dsc')} />
      </form>
      <PopoverMenu>
        {useAccountSwitcher && (
          <AccountSwitcherMenu
            onClickAddAccount={onClickAddAccount}
            hasAaAccount={hasAaAccount}
          ></AccountSwitcherMenu>
        )}
        <>
          <PopoverMenuLink
            href={`/${me.username}/profile`}
            title={format('profile-and-visibility')}
            testId={HeaderTestIds.MemberMenuProfile}
            onClick={onClickMenuLink}
          />
          <PopoverMenuLink
            href={`/${me.username}/activity`}
            title={format('activity')}
            onClick={onClickMenuLink}
          />
          <PopoverMenuLink
            // this className is needed by Desktop for the My Cards MenuItem
            className={'js-cards'}
            href={`/${me.username}/cards`}
            title={format('cards')}
            testId={HeaderTestIds.MemberMenuCards}
            onClick={onClickMenuLink}
          />
          <PopoverMenuLink
            href={`/${me.username}/account`}
            title={format('settings')}
            appendSeparator={!showBillingUrl}
            testId={HeaderTestIds.MemberMenuSettings}
            onClick={onClickMenuLink}
          />
          {showBillingUrl && (
            <PopoverMenuLink
              href={`/${me.username}/billing`}
              title={format('billing')}
              appendSeparator
              onClick={onClickMenuLink}
            />
          )}
        </>
        <PopoverMenuLink
          appendSeparator={isTouch() && me.isAaMastered}
          title={format('help')}
          href={`/contact?url=${encodeURIComponent(location.href)}`}
          target="_blank"
        />
        {!isTouch() && (
          <PopoverMenuButton
            title={format('shortcuts')}
            onClick={onClickShortcuts}
            appendSeparator={me.isAaMastered}
          />
        )}
        {canLogout && (
          <PopoverMenuButton
            title={format('log-out')}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              formRef.current?.submit();
            }}
            testId={HeaderTestIds.MemberMenuLogout}
          />
        )}
      </PopoverMenu>
    </>
  );
};

export default connect(mapStateToProps)(HeaderMemberMenu);
