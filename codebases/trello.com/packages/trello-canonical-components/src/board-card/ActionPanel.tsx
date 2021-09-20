import React from 'react';
import cx from 'classnames';
import { N200 } from '@trello/colors';
import styles from './ActionPanel.less';

import JoinIcon from '../icons/JoinIcon';
import SubscribeIcon from '../icons/SubscribeIcon';
import VoteIcon from '../icons/VoteIcon';

interface ActionPanelRowProps {
  className?: string;
  slim?: boolean;
  alignRight?: boolean;
}

export const ActionPanelRow: React.FC<ActionPanelRowProps> = ({
  alignRight,
  slim,
  children,
}) => {
  const panelClasses = cx(
    styles.actionPanelRow,
    slim && styles.slim,
    alignRight && styles.alignRight,
  );
  return <div className={panelClasses}>{children}</div>;
};

interface ActionPanelProps {
  className?: string;
  hideBorder?: boolean;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  hideBorder,
  className,
  children,
}) => {
  const panelClasses = cx(
    styles.actionPanel,
    className,
    hideBorder && styles.hideBorder,
  );
  return <div className={panelClasses}>{children}</div>;
};

export const ActionButtons: React.FC = ({ children }) => {
  const buttonsClasses = cx(
    styles.actionButtons,
    React.Children.count(children) < 3 && styles.alignStart,
  );
  return <div className={buttonsClasses}>{children}</div>;
};

interface ActionButtonProps {
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  className,
}) => (
  <button className={cx(styles.actionButton, className)}>{children}</button>
);

interface IconButtonProps extends ActionButtonProps {
  icon: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  children,
  className,
}) => (
  <ActionButton className={className}>
    <span className={styles.icon}>{icon}</span>
    <span className={styles.actionButtonLabel}>{children}</span>
  </ActionButton>
);

export const JoinButton: React.FC<ActionButtonProps> = ({ className }) => (
  <IconButton className={className} icon={<JoinIcon color={N200} />}>
    Join
  </IconButton>
);

export const SubscribeButton: React.FC<ActionButtonProps> = ({ className }) => (
  <IconButton className={className} icon={<SubscribeIcon color={N200} />}>
    Subscribe
  </IconButton>
);

export const VoteButton: React.FC<ActionButtonProps> = ({ className }) => (
  <IconButton className={className} icon={<VoteIcon color={N200} />}>
    Vote
  </IconButton>
);

export const Input: React.FC = (props) => (
  <input className={styles.actionInput} {...props} />
);
