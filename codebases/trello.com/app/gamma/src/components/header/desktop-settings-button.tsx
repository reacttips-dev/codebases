/* eslint-disable import/no-default-export */
import classNames from 'classnames';
import { GearIcon } from '@trello/nachos/icons/gear';
import React from 'react';

import HeaderButton from './button';
import styles from './header.less';

const noop = () => {};

interface DesktopSettingsButtonProps {
  redesign?: boolean;
}
/**
 * This button has click handler binding in the desktop code via jQuery. Ugh.
 */
const DesktopSettingsButton: React.FunctionComponent<DesktopSettingsButtonProps> = ({
  redesign,
}) => {
  return (
    <HeaderButton
      className={classNames(
        'paws-open-preferences',
        styles.desktopSettingsButton,
        redesign && styles.headerButtonRedesign,
      )}
      icon={<GearIcon color="light" />}
      onClick={noop}
    />
  );
};

export default DesktopSettingsButton;
