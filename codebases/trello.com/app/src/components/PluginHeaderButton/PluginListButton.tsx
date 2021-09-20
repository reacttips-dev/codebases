import React, { Suspense } from 'react';
import cx from 'classnames';

import { forTemplate } from '@trello/i18n';
import { PowerUpIcon } from '@trello/nachos/icons/power-up';
import { Button } from '@trello/nachos/button';
import { usePopover, Popover } from '@trello/nachos/popover';
import { PluginHeaderButtonTestIds } from '@trello/test-ids';
import { Spinner } from '@trello/nachos/spinner';

import styles from './PluginListButton.less';
import { Board } from './PluginHeaderButton.types';
import { usePluginListButtonQuery } from './PluginListButtonQuery.generated';
import { useLazyComponent } from '@trello/use-lazy-component';

const format = forTemplate('board_header_pup_dropdown');

interface PluginListButtonProps {
  openDirectory: () => object;
  openEnabled: () => object;
  board: Board;
  container: Element;
}

export const PluginListButton: React.FunctionComponent<PluginListButtonProps> = ({
  openDirectory,
  openEnabled,
  board,
  container,
}: PluginListButtonProps) => {
  const PluginListPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "plugin-list-popover" */ 'app/src/components/PluginHeaderButton'
      ),
    {
      namedImport: 'PluginListPopover',
    },
  );
  const numPlugins = board?.boardPluginList?.length
    ? board.boardPluginList.length
    : 0;
  const idBoard = board.id;
  const { data, error } = usePluginListButtonQuery({
    variables: { idBoard },
  });
  const backgroundBrightness = error
    ? 'dark'
    : data?.board?.prefs?.backgroundBrightness;

  const { triggerRef, toggle, popoverProps } = usePopover<HTMLButtonElement>();

  return (
    <div>
      <Button
        data-test-id={PluginHeaderButtonTestIds.HeaderButton}
        className={styles.pluginDropdownButton}
        ref={triggerRef}
        appearance={
          backgroundBrightness === 'dark' ? 'transparent' : 'transparent-dark'
        }
        iconBefore={<PowerUpIcon />}
        onClick={toggle}
      >
        {format('power-ups')}
        {numPlugins !== 0 ? (
          <span
            data-test-id={PluginHeaderButtonTestIds.HeaderPluginLength}
            className={cx(
              styles.pluginsEnabledButtonText,
              backgroundBrightness === 'dark' ? styles.dark : styles.light,
            )}
          >
            {numPlugins}
          </span>
        ) : null}
      </Button>
      <Popover title={format('power-ups')} {...popoverProps}>
        <Suspense fallback={<Spinner centered />}>
          <PluginListPopover
            board={board}
            container={container}
            openDirectory={openDirectory}
            openEnabled={openEnabled}
            toggle={toggle}
          />
        </Suspense>
      </Popover>
    </div>
  );
};
