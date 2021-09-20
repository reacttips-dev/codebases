/* eslint-disable import/no-default-export */
import React, { FunctionComponent, Suspense, useCallback } from 'react';
import { HeaderTestIds } from '@trello/test-ids';
import { GearIcon } from '@trello/nachos/icons/gear';
import { isDevserver } from '@trello/config';
import { memberId } from '@trello/session-cookie';
import classnames from 'classnames';
import styles from './header.less';
import HeaderButton from './button';
import { usePopover, Popover, PopoverScreen } from '@trello/nachos/popover';

import { forNamespace, forTemplate } from '@trello/i18n';
import { useLazyComponent } from '@trello/use-lazy-component';
import { useChannelSwitcherButtonChannelsQuery } from './ChannelSwitcherButtonChannelsQuery.generated';

const viewTitle = forNamespace('view title');
const formatHeaderUser = forTemplate('header_user');

interface ChannelSwitcherButtonProps {
  hostname?: string;
  redesign?: boolean;
}

// Show channel picker if user is allowed to view multiple channels
// OR if we're not on production (to make development easier)
const shouldShowChannelPicker = (
  hostname: string,
  allowed: string[] = [],
): boolean => {
  if (hostname !== 'trello.com') {
    return true;
  }

  return allowed.length > 1;
};

enum Screen {
  Accessibility,
  ChannelSwitcherScreen,
  FeatureFlagScreen,
  HydraScreen,
  OneTimeMessagesDismissedScreen,
  InAppNewAccountForm,
  LanguageScreen,
}

export const ChannelSwitcherButton: FunctionComponent<ChannelSwitcherButtonProps> = ({
  hostname = window.location.hostname,
  redesign,
}) => {
  const {
    toggle,
    triggerRef,
    popoverProps,
    push,
  } = usePopover<HTMLButtonElement>({
    initialScreen: Screen.ChannelSwitcherScreen,
  });
  const { data } = useChannelSwitcherButtonChannelsQuery({
    variables: {
      memberId: memberId || '',
    },
    fetchPolicy: 'cache-only',
  });
  const showButton = shouldShowChannelPicker(
    hostname,
    data?.member?.channels?.allowed,
  );

  const ChannelSwitcher = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "channel-switcher-popover" */ 'app/gamma/src/components/popovers/channel-switcher/channel-switcher'
      ),
    { preload: showButton, namedImport: 'ChannelSwitcher' },
  );

  const FeatureFlagList = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "feature-flag-list" */ 'app/gamma/src/components/popovers/channel-switcher/FeatureFlagList'
      ),
    { preload: popoverProps.isVisible, namedImport: 'FeatureFlagList' },
  );

  const HydraChooser = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "hydra-chooser-menu" */ 'app/gamma/src/components/popovers/hydra-chooser'
      ),
    { preload: popoverProps.isVisible, namedImport: 'HydraChooserContainer' },
  );

  const OneTimeMessagesDismissedList = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "onetime-messages-menu" */ 'app/src/components/OneTimeMessagesDismissedList'
      ),
    {
      namedImport: 'OneTimeMessagesDismissedList',
      preload: popoverProps.isVisible,
    },
  );

  const LanguageList = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "language-override-menu" */ 'app/src/components/LanguageList'
      ),
    {
      namedImport: 'LanguageList',
      preload: popoverProps.isVisible,
    },
  );

  const InAppNewAccountForm = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "devserver-in-app-new-account-form" */ '@trello/devserver/middleware/static/src/InAppNewAccountForm'
      ),
    {
      namedImport: 'InAppNewAccountForm',
      preload: popoverProps.isVisible,
    },
  );

  const AccessibilityMenu = useLazyComponent(
    () => import(/* webpackChunkName: "accessibility" */ '@trello/a11y'),
    {
      namedImport: 'AccessibilityMenu',
      preload: popoverProps.isVisible,
    },
  );

  const onSelectHandler = useCallback(
    (screen: Screen) => () => {
      push(screen);
    },
    [push],
  );
  if (!showButton) {
    return null;
  }

  return (
    <>
      <HeaderButton
        icon={<GearIcon color="light" />}
        onClick={toggle}
        ref={triggerRef}
        testId={HeaderTestIds.ChannelPickerButton}
        ariaLabel={formatHeaderUser('switch-channels')}
        className={classnames(redesign && styles.headerButtonRedesign)}
      />

      <Popover {...popoverProps} testId={HeaderTestIds.ChannelPickerPopover}>
        <Suspense fallback={null}>
          <PopoverScreen
            id={Screen.ChannelSwitcherScreen}
            title={viewTitle('switch channels')}
          >
            <ChannelSwitcher
              onSelectAccessibility={onSelectHandler(Screen.Accessibility)}
              onSelectHydraChooser={onSelectHandler(Screen.HydraScreen)}
              onSelectFeatureFlags={onSelectHandler(Screen.FeatureFlagScreen)}
              onSelectOneTimeMessagesDismissed={onSelectHandler(
                Screen.OneTimeMessagesDismissedScreen,
              )}
              onSelectLanguage={onSelectHandler(Screen.LanguageScreen)}
              onSelectedTestAuthTokens={onSelectHandler(
                Screen.InAppNewAccountForm,
              )}
            />
          </PopoverScreen>
          <PopoverScreen
            id={Screen.HydraScreen}
            title={viewTitle('select client version')}
          >
            <HydraChooser />
          </PopoverScreen>
          <PopoverScreen
            id={Screen.FeatureFlagScreen}
            title={viewTitle('feature flags')}
          >
            <FeatureFlagList />
          </PopoverScreen>
          <PopoverScreen
            id={Screen.OneTimeMessagesDismissedScreen}
            title="oneTimeMessagesDismissed"
          >
            <OneTimeMessagesDismissedList memberId={memberId || ''} />
          </PopoverScreen>
          <PopoverScreen
            id={Screen.InAppNewAccountForm}
            title="New Account Form"
          >
            <InAppNewAccountForm />
          </PopoverScreen>
          <PopoverScreen id={Screen.Accessibility} title="Accessibility">
            <AccessibilityMenu />
          </PopoverScreen>
          <PopoverScreen id={Screen.LanguageScreen} title="Language">
            <LanguageList
              isDevserver={
                process.env.NODE_ENV === 'development' || Boolean(isDevserver)
              }
            />
          </PopoverScreen>
        </Suspense>
      </Popover>
    </>
  );
};

export default ChannelSwitcherButton;
