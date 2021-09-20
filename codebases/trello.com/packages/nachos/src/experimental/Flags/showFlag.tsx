import React from 'react';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { Analytics } from '@trello/atlassian-analytics';
import { CheckCircleIcon } from '@trello/nachos/icons/check-circle';
import { InformationIcon } from '@trello/nachos/icons/information';
import { WarningIcon } from '@trello/nachos/icons/warning';
import { Red500 } from '@trello/colors';
import { flagsState } from './flagsState';
import { DismissFlagArgs, FlagArgs, AppearanceTypes } from './types';
import styles from './Flag.less';

export const dismissFlag = ({
  id,
  dismissedVia = 'programmatic',
}: DismissFlagArgs) => {
  flagsState.setValue((current: FlagArgs[]) => {
    const filtered = current.filter((flag) => flag.id !== id);

    // Only track manual dismissals; tracking auto just doubles our event load.
    if (dismissedVia !== 'auto' && current.length !== filtered.length) {
      Analytics.sendOperationalEvent({
        actionSubject: 'flag',
        action: 'dismissed',
        source: '@trello/flags',
        attributes: { flagId: id, dismissedVia },
      });
    }

    return filtered;
  });
};

interface FlagImage {
  src: string;
  alt?: string;
}

interface ShowFlagArgs extends Omit<FlagArgs, 'icon'> {
  /**
   * Matches appearances defined in Atlaskit, but we always use the default
   * appearance under the hood to opt out of opinionated presets. Instead,
   * this maps to a commonly paired icon for convenience.
   */
  appearance?: AppearanceTypes;
  /**
   * Custom icon to pass in. Overrides whatever is mapped to `appearance`.
   */
  icon?: React.ReactNode;
  /** Convenience option to pass in an image asset to use as an icon.
   * Overrides `icon` and `appearance` props.
   */
  image?: FlagImage;
}

const getFlagIconForImage = ({ src, alt }: FlagImage): React.ReactNode => (
  <img className={styles.imageIcon} src={src} alt={alt} />
);

/** Most of the time, rendering an icon when dispatching a flag is too bulky;
 * this maps the existing appearance icon to a common icon. Custom icons are
 * still supported where desired.
 */
const mapAppearanceToIcon = (appearance?: AppearanceTypes): React.ReactNode => {
  switch (appearance) {
    case 'error':
      return <ErrorIcon label="Error" primaryColor={Red500} />;
    case 'success':
      return <CheckCircleIcon color="green" size="large" />;
    case 'warning':
      return <WarningIcon label="Warning" color="yellow" size="large" />;
    case 'info':
    case 'normal':
    default:
      return <InformationIcon size="large" />;
  }
};

export const showFlag = ({
  appearance,
  icon,
  image,
  isAutoDismiss,
  msTimeout,
  ...args
}: ShowFlagArgs) => {
  const flag: FlagArgs = {
    ...args,
    icon: image
      ? getFlagIconForImage(image)
      : icon ?? mapAppearanceToIcon(appearance),
    isAutoDismiss: isAutoDismiss ?? !!msTimeout,
    msTimeout,
  };
  flagsState.setValue((current: FlagArgs[]) => {
    const index = current.findIndex(({ id }) => id === flag.id);
    // If flag is not found, add it
    if (index === -1) {
      Analytics.sendOperationalEvent({
        actionSubject: 'flag',
        action: 'shown',
        source: '@trello/flags',
        attributes: {
          flagId: flag.id,
          appearance,
          concurrentCount: current.length,
          isReplacement: false,
        },
      });
      return [flag, ...current];
    }
    // If flag already exists, replace it
    const shallow: FlagArgs[] = [...current];
    Analytics.sendOperationalEvent({
      actionSubject: 'flag',
      action: 'shown',
      source: '@trello/flags',
      attributes: {
        flagId: flag.id,
        appearance,
        // If we're replacing the current flag, don't count it as concurrent,
        // since we're not adding to the number of flags currently visible.
        concurrentCount: current.length - 1,
        isReplacement: true,
      },
    });
    shallow[index] = flag;
    return shallow;
  });
  return () => dismissFlag({ id: flag.id });
};
