import React, { useCallback } from 'react';
import { useSelectCoverQuery } from './SelectCoverQuery.generated';
import { useSelectPluginCoverQuery } from './SelectPluginCoverQuery.generated';
import { forTemplate } from '@trello/i18n';
import cx from 'classnames';

import { ModelCache } from 'app/scripts/db/model-cache';

import styles from './SelectPluginCover.less';

const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');

const format = forTemplate('card_cover_chooser');

interface SelectPluginCoverProps {
  cardId: string;
  boardId: string;
}

interface PluginCoverOption {
  id: string;
  title: string;
  iconUrl: string;
  selected: boolean;
}

export const SelectPluginCover: React.FunctionComponent<SelectPluginCoverProps> = ({
  cardId,
  boardId,
}) => {
  const { data: selectCoverQueryData } = useSelectCoverQuery({
    variables: { cardId },
    fetchPolicy: 'cache-only',
  });

  const { data } = useSelectPluginCoverQuery({
    variables: { boardId },
    fetchPolicy: 'cache-only',
  });

  const onPowerUpSelect = useCallback(
    async (idPlugin: string, el: EventTarget) => {
      const card = ModelCache.get('Card', cardId);
      const board = card?.getBoard();
      await PluginRunner.one({
        command: 'card-cover',
        plugin: idPlugin,
        card,
        board,
        list: card?.getList(),
        timeout: 5000,
        el,
      });
    },
    [cardId],
  );

  const card = selectCoverQueryData?.card;
  const board = data?.board;

  const availablePlugins = board?.plugins ?? [];
  const idPluginsEnabled = (board?.boardPlugins ?? []).map(
    (boardPlugin) => boardPlugin.idPlugin,
  );
  const enabledPluginsWithCoverSupport = availablePlugins.filter(
    (availablePlugin) =>
      idPluginsEnabled.includes(availablePlugin.id) &&
      availablePlugin.capabilities.includes('card-cover') &&
      availablePlugin.tags.includes('plugin-cover-beta'),
  );

  const selectedIdPluginCover = card?.cover?.idPlugin;

  const pluginCoverOptions: PluginCoverOption[] = enabledPluginsWithCoverSupport.map(
    (plugin) => ({
      id: plugin.id,
      title: plugin.name ?? '',
      iconUrl: plugin.icon.url,
      selected: plugin.id === selectedIdPluginCover,
    }),
  );

  if (pluginCoverOptions.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className={styles.heading}>{format('power-ups')}</h4>
      <div className={styles.pluginCoverTiles}>
        {pluginCoverOptions.map((pluginCoverOption) => (
          <button
            key={pluginCoverOption.id}
            className={cx('button', styles.pluginCoverTilesItem, {
              [styles.selected]: pluginCoverOption.id === selectedIdPluginCover,
            })}
            style={{
              backgroundImage: `url('${pluginCoverOption.iconUrl}')`,
              backgroundSize: 'contain',
            }}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={(e) => onPowerUpSelect(pluginCoverOption.id, e.target)}
          />
        ))}
      </div>
    </div>
  );
};
