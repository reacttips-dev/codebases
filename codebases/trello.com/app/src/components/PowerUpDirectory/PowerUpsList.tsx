/* eslint-disable react/no-danger */
import classNames from 'classnames';
import React from 'react';

import { PowerUpItemType } from 'app/src/components/PowerUp';
import { PowerUpItem } from './PowerUpItem';
import { Plugins } from './types';

import styles from './PowerUpsList.less';

import { PowerUpTestIds } from '@trello/test-ids';
import {
  useWorkspaceNavigation,
  useWorkspaceNavigationHidden,
} from 'app/src/components/WorkspaceNavigation';

interface PowerUpsListProps {
  title?: string;
  plugins: Plugins;
  type?: PowerUpItemType;
  testId?: PowerUpTestIds;
}

export const PowerUpsList: React.FunctionComponent<PowerUpsListProps> = ({
  title,
  plugins,
  type = PowerUpItemType.Description,
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

  const powerUpItems = plugins.map((plugin) => {
    return <PowerUpItem key={plugin.id} type={type} plugin={plugin} />;
  });

  return (
    <div className={styles.directoryPowerUpsList}>
      <div
        className={classNames(styles.directoryPowerUpsListHeader, {
          [styles.workspaceNavigationExpanded]: workspaceNavigationExpanded,
        })}
      >
        {title && <h2 dangerouslySetInnerHTML={{ __html: title }} />}
      </div>
      <div
        className={classNames(styles.flexRowWrap, styles.powerUpsList, {
          [styles.workspaceNavigationExpanded]: workspaceNavigationExpanded,
        })}
        data-test-id={PowerUpTestIds.PowerUpsList}
      >
        {powerUpItems}
      </div>
    </div>
  );
};
