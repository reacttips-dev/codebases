/* eslint-disable import/no-default-export*/
import { State } from 'app/gamma/src/modules/types';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { PopoverMenuButton } from 'app/src/components/PopoverMenu';
import { getMe } from 'app/gamma/src/selectors/members';
import { MemberModel } from 'app/gamma/src/types/models';
import { forTemplate } from '@trello/i18n';
import { AccountItem } from './account-item';
import { TrelloStorage } from '@trello/storage';
import { identityBaseUrl, siteDomain } from '@trello/config';
import styles from './account-switcher.less';
import { Analytics } from '@trello/atlassian-analytics';

const format = forTemplate('header_account_switcher');
// eslint-disable-next-line @trello/no-module-logic
const AaSwitcherUrlParams = new URLSearchParams({
  prompt: 'select_account',
  continue: `${siteDomain}/auth/atlassian/callback`,
  application: 'trello',
});
// eslint-disable-next-line @trello/no-module-logic
const AaSwitcherPageUrl = `${identityBaseUrl}/login?${AaSwitcherUrlParams.toString()}`;

interface AccountSwitcherMenuStateProps {
  me: MemberModel | undefined;
}
interface AccountSwitcherMenuDispatchProps {
  onClickAddAccount: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  hasAaAccount: boolean | undefined;
}

interface AccountSwitcherStateProps {
  currentAccount: MemberModel | undefined;
  hasAddedAccount: boolean;
}

interface AccountSwitcherProps
  extends AccountSwitcherStateProps,
    AccountSwitcherMenuDispatchProps {}

export class AccountSwitcher extends React.Component<AccountSwitcherProps> {
  render() {
    const {
      onClickAddAccount,
      currentAccount,
      hasAddedAccount,
      hasAaAccount,
    } = this.props;
    const {
      name,
      email,
      id,
      avatarSource,
      initials,
      username,
      isAaMastered,
      oneTimeMessagesDismissed = [],
    } = currentAccount || {};
    const avatars = currentAccount?.avatars ?? undefined;

    const SwitchAccounts = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'link',
        source: 'memberMenuInlineDialog',
        actionSubjectId: 'settingsSwitchAccountsLink',
      });
      window.location.href = AaSwitcherPageUrl;
    };

    const hasClickedAddAccount = oneTimeMessagesDismissed?.includes(
      'headerMemberMenuAddAccount',
    );

    return (
      <>
        <AccountItem
          name={name}
          email={email}
          id={id}
          avatarSource={avatarSource}
          avatars={avatars}
          initials={initials}
          username={username}
        ></AccountItem>
        {(isAaMastered || hasAaAccount) && hasAddedAccount && (
          <PopoverMenuButton
            // eslint-disable-next-line react/jsx-no-bind
            onClick={SwitchAccounts}
            title={format('switch-account')}
          ></PopoverMenuButton>
        )}
        <PopoverMenuButton onClick={onClickAddAccount} appendSeparator={true}>
          <span
            className={!hasClickedAddAccount ? styles.addAccountNew : ''}
            data-new-string={format('new')}
          >
            {format('add-another-account')}
          </span>
        </PopoverMenuButton>
      </>
    );
  }
}

interface AccountSwitcherMenuProps
  extends AccountSwitcherMenuStateProps,
    AccountSwitcherMenuDispatchProps {}

const mapStateToProps = (state: State): AccountSwitcherMenuStateProps => {
  const me = getMe(state);

  return {
    me,
  };
};

const AccountSwitcherMenu: React.FunctionComponent<AccountSwitcherMenuProps> = ({
  onClickAddAccount,
  me,
  hasAaAccount,
}) => {
  const [hasAddedAccount, setHasAddedAccount] = useState(false);
  useEffect(() => {
    setHasAddedAccount(
      TrelloStorage.get('accountSwitcherAccountAdded') === 'true',
    );
  }, []);

  return (
    <AccountSwitcher
      currentAccount={me}
      onClickAddAccount={onClickAddAccount}
      hasAddedAccount={hasAddedAccount}
      hasAaAccount={hasAaAccount}
    ></AccountSwitcher>
  );
};

export default connect(mapStateToProps)(AccountSwitcherMenu);
