import React from 'react';
import { ModelCache } from 'app/scripts/db/model-cache';
import { forNamespace } from '@trello/i18n';
import { CheckIcon } from '@trello/nachos/icons/check';
import { FilterMode } from 'app/src/components/ViewFilters/types';
import { Attributes } from '../types';

import classNames from 'classnames';
import styles from './ModeList.less';

const format = forNamespace('filter mode');

interface ModeListProps {
  idBoard: string;
  filterMode: FilterMode;
  trackFilterItemClick: (attributes: Attributes) => void;
}

export const ModeList: React.FunctionComponent<ModeListProps> = ({
  idBoard,
  filterMode,
  trackFilterItemClick,
}) => {
  function toggleMode(filterModeValue: FilterMode) {
    const board = ModelCache.get('Board', idBoard);
    const filter = board?.filter;

    if (filter) {
      const modeString = filterModeValue === FilterMode.And ? 'and' : 'or';

      trackFilterItemClick({ type: 'mode' });
      filter.set('mode', modeString);
    }
  }

  const modeItemsList = [FilterMode.Or, FilterMode.And].map((modeValue) => {
    const modeString = modeValue === FilterMode.And ? 'and' : 'or';
    const isActive = filterMode === modeValue;

    return (
      <li
        key={modeValue}
        className={classNames(styles.modeListItem, isActive && styles.isActive)}
      >
        <a
          className={styles.modeListItemLink}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => toggleMode(modeValue)}
          role="button"
        >
          <span>{format(modeString)}</span>
          {isActive && (
            <CheckIcon
              size="small"
              dangerous_className={styles.modeListItemLinkIcon}
            />
          )}
        </a>
      </li>
    );
  });

  return <ul>{modeItemsList}</ul>;
};
