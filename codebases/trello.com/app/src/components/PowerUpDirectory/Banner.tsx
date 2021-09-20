import React from 'react';
import classNames from 'classnames';
import { forTemplate } from '@trello/i18n';
import styles from './Banner.less';
import {
  useWorkspaceNavigation,
  useWorkspaceNavigationHidden,
} from 'app/src/components/WorkspaceNavigation';

const format = forTemplate('directory');
interface BannerProps {
  readonly heading: string;
  readonly paragraph: string;
}

export const Banner: React.FunctionComponent<BannerProps> = ({
  heading,
  paragraph,
}) => {
  const [
    {
      expanded: _workspaceNavigationExpanded,
      enabled: _workspaceNavigationEnabled,
    },
  ] = useWorkspaceNavigation();
  const [
    { hidden: _workspaceNavigationHidden },
  ] = useWorkspaceNavigationHidden();
  const workspaceNavigationExpanded =
    _workspaceNavigationEnabled &&
    !_workspaceNavigationHidden &&
    _workspaceNavigationExpanded;

  return (
    <div
      className={classNames(styles.directoryBannerContainer, {
        [styles.workspaceNavigationExpanded]: workspaceNavigationExpanded,
      })}
    >
      <div
        className={classNames(styles.directoryBanner, {
          [styles.workspaceNavigationExpanded]: workspaceNavigationExpanded,
        })}
      >
        <div>
          <h1 className={styles.bannerHeading}>{format(heading)}</h1>
          <p className={styles.bannerParagraph}>{format(paragraph)}</p>
          <div />
        </div>
      </div>
    </div>
  );
};
