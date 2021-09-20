/* eslint-disable import/no-default-export */
import { HeaderTestIds } from '@trello/test-ids';
import { MemberAvatar } from 'app/src/components/MemberAvatar';
import { getMe } from 'app/gamma/src/selectors/members';
import { State } from 'app/gamma/src/modules/types';
import React, {
  useCallback,
  FunctionComponent,
  Suspense,
  useState,
  useEffect,
} from 'react';
import { connect } from 'react-redux';
import { MemberModel } from 'app/gamma/src/types/models';
import HeaderButton from './button';
import styles from './header.less';
import classNames from 'classnames';
import { usePopover, Popover, PopoverScreen } from '@trello/nachos/popover';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { forTemplate } from '@trello/i18n';
import { defaultRouter } from 'app/src/router';
import { useLazyComponent } from '@trello/use-lazy-component';
import { AtlassianAccountMigrationStageOverlay } from 'app/src/components/AtlassianAccountMigrationStage/AtlassianAccountMigrationStageOverlay';
import { isStageActionable } from 'app/src/components/AtlassianAccountMigrationStage/isStageActionable';
import { useAtlassianAccountMigrationStage } from 'app/src/components/AtlassianAccountMigrationStage/useAtlassianAccountMigrationStage';
import { useAccountSwitcherDismissNewMutation } from 'app/gamma/src/components/popovers/account-switcher/AccountSwitcherDismissNewMutation.generated';
import { clientVersion } from '@trello/config';
import { Analytics } from '@trello/atlassian-analytics';
import { ProductFeatures } from '@trello/product-features';

const format = forTemplate('header_member_menu');
const formatHeaderUser = forTemplate('header_user');

interface Props {
  hasMemberData: boolean;
  member: MemberModel | undefined;
}

enum Screen {
  MemberMenu,
  AddAccountMenu,
}

const mapStateToProps = (state: State) => {
  return {
    hasMemberData: !!getMe(state),
    member: getMe(state),
    hasCrown: ProductFeatures.isFeatureEnabled(
      'crown',
      getMe(state)?.products?.[0],
    ),
  };
};

const HeaderMemberMenuButton: FunctionComponent<Props> = ({
  hasMemberData,
  member,
}) => {
  const {
    name = '',
    username = '',
    id = '',
    avatarSource = undefined,
    isAaMastered = false,
    oneTimeMessagesDismissed = [],
    confirmed = false,
    idEnterprise = '',
    email = '',
  } = member || {};
  const userTitle = `${name}${username && ` (${username})`}`;
  const [dismissNew] = useAccountSwitcherDismissNewMutation();

  const [isMigrationOverlayOpen, setMigrationOverlayOpen] = useState(false);
  const [hasAaAccount, setHasAaAccount] = useState(false);
  const { stage, refetchStage } = useAtlassianAccountMigrationStage();

  const [useAccountSwitcher, setUseAccountSwitcher] = useState(false);
  const useAccountSwitcherFlag = useFeatureFlag('aa4a.account-switcher', false);
  const useAccountSwitcherEnterpriseFlag = useFeatureFlag(
    'aa4a.account-switcher-enterprise',
    false,
  );
  const popoverTitle = useAccountSwitcher
    ? format('account')
    : `${member?.name} (${member?.username})`;

  useEffect(() => {
    async function checkForAtlassianAccount(memberEmail: string) {
      const queryString = new URLSearchParams({
        email: memberEmail,
      }).toString();
      const res = await fetch(`/auth/accountSwitcher/policy?${queryString}`, {
        method: 'GET',
        headers: {
          'X-Trello-Client-Version': clientVersion,
          credentials: 'include',
        },
      });
      if (!res.ok) {
        throw new Error('error getting account switcher policy');
      }
      const { reason, url } = await res.json();
      //if the email is ineligible for migration but the url doesn't point to
      //the trello login, we know they already have an Aa and can use the switcher
      const hasAa =
        reason === 'migration ineligible' &&
        !url.startsWith(window.location.origin);
      setHasAaAccount(hasAa);
      setUseAccountSwitcher(hasAa);
    }

    if (idEnterprise && useAccountSwitcherEnterpriseFlag && confirmed) {
      if (isAaMastered) {
        setUseAccountSwitcher(true);
      } else {
        checkForAtlassianAccount(email || '');
      }
    } else {
      setUseAccountSwitcher(useAccountSwitcherFlag && confirmed);
    }
  }, [
    confirmed,
    email,
    idEnterprise,
    isAaMastered,
    useAccountSwitcherFlag,
    useAccountSwitcherEnterpriseFlag,
  ]);

  const {
    toggle,
    push,
    hide,
    triggerRef,
    popoverProps,
  } = usePopover<HTMLButtonElement>({
    initialScreen: Screen.MemberMenu,
  });
  const onClick = useCallback(() => {
    if (!hasMemberData) {
      return;
    }

    Analytics.sendClickedButtonEvent({
      buttonName: 'memberMenuHeaderButton',
      source: 'appHeader',
      attributes: {
        memberId: member!.id,
      },
    });

    toggle();

    Analytics.sendViewedComponentEvent({
      componentType: 'inlineDialog',
      componentName: 'memberMenuInlineDialog',
      source: 'appHeader',
      attributes: {
        memberId: member!.id,
      },
    });
  }, [member, hasMemberData, toggle]);

  const HeaderMemberMenu = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "header-member-menu-popover" */ 'app/gamma/src/components/popovers/header-member-menu'
      ),
  );

  const AddAccount = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "header-member-menu-add-account" */ 'app/gamma/src/components/popovers/account-switcher/add-account'
      ),
    {
      preload: popoverProps.isVisible && isAaMastered,
    },
  );

  const UpgradeAccount = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "header-member-menu-add-account" */ 'app/gamma/src/components/popovers/account-switcher/upgrade-account'
      ),
    {
      preload: popoverProps.isVisible && !isAaMastered,
    },
  );

  const onClickAddAccount = async () => {
    if (!oneTimeMessagesDismissed?.includes('headerMemberMenuAddAccount')) {
      dismissNew({
        variables: {
          memberId: 'me',
          messageId: `headerMemberMenuAddAccount`,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addOneTimeMessagesDismissed: {
            id: 'me',
            oneTimeMessagesDismissed: oneTimeMessagesDismissed!.concat([
              `headerMemberMenuAddAccount`,
            ]),
            __typename: 'Member',
          },
        },
      });
    }
    push(Screen.AddAccountMenu);
  };

  return (
    <>
      <HeaderButton
        // this className is needed by Desktop for the My Cards MenuItem
        className={classNames(
          'js-open-header-member-menu',
          styles.memberButton,
        )}
        onClick={onClick}
        ref={triggerRef}
        testId={HeaderTestIds.MemberMenuButton}
        title={userTitle}
        ariaLabel={formatHeaderUser('member-menu')}
      >
        <MemberAvatar avatarSource={avatarSource} idMember={id} size={32} />
      </HeaderButton>
      <Popover {...popoverProps} title={`${popoverTitle}`}>
        <Suspense fallback={null}>
          <PopoverScreen
            id={Screen.MemberMenu}
            testId={HeaderTestIds.MemberMenuPopover}
            noHorizontalPadding
          >
            <HeaderMemberMenu
              // eslint-disable-next-line react/jsx-no-bind
              onClickShortcuts={() => {
                defaultRouter.setRoute('/shortcuts');
                hide();
              }}
              onClickMenuLink={hide}
              // eslint-disable-next-line react/jsx-no-bind
              onClickAddAccount={onClickAddAccount}
              useAccountSwitcher={useAccountSwitcher}
              hasAaAccount={hasAaAccount}
            />
          </PopoverScreen>
          <PopoverScreen
            id={Screen.AddAccountMenu}
            title={format('add-another-account')}
            noHorizontalPadding
          >
            {isAaMastered || hasAaAccount ? (
              <AddAccount />
            ) : (
              <UpgradeAccount
                // eslint-disable-next-line react/jsx-no-bind
                onClickUpdateAccount={() => {
                  Analytics.sendUIEvent({
                    action: 'clicked',
                    actionSubject: 'button',
                    source: 'accountSwitcherAddAccountInlineDialog',
                    actionSubjectId: 'accountSwitcherUpdateAccountButton',
                  });
                  setMigrationOverlayOpen(true);
                  hide();
                }}
                isMigratable={isStageActionable(stage)}
              ></UpgradeAccount>
            )}
          </PopoverScreen>
        </Suspense>
      </Popover>
      {isMigrationOverlayOpen && (
        <AtlassianAccountMigrationStageOverlay
          stage={stage}
          attributes={{
            stage,
            origin: 'accountSwitcherUpdateButton',
          }}
          // eslint-disable-next-line react/jsx-no-bind
          onComplete={() => {
            setMigrationOverlayOpen(false);
            refetchStage();
          }}
          // eslint-disable-next-line react/jsx-no-bind
          onDismiss={() => setMigrationOverlayOpen(false)}
        />
      )}
    </>
  );
};

export default connect(mapStateToProps)(HeaderMemberMenuButton);
