import React from 'react';
import classNames from 'classnames';
import { forNamespace } from '@trello/i18n';
import { CheckIcon } from '@trello/nachos/icons/check';

import { ModelCache } from 'app/scripts/db/model-cache';
import {
  DueFilter,
  BoardDueFilterString,
} from 'app/src/components/ViewFilters/filters';

import { DueFilterCriteriaOption } from 'app/src/components/FilterPopover/FilterCriteriaOptions';
import { Attributes } from '../types';

import styles from './DueList.less';

const format = forNamespace('due date filter');

interface DueListProps {
  idBoard: string;
  dueList: DueFilterCriteriaOption[];
  dueFilter: DueFilter;
  trackFilterItemClick: (attributes: Attributes) => void;
}

export const DueList: React.FunctionComponent<DueListProps> = ({
  idBoard,
  dueList,
  dueFilter,
  trackFilterItemClick,
}) => {
  function toggleDue(dueValue: BoardDueFilterString) {
    const board = ModelCache.get('Board', idBoard);
    const filter = board?.filter;

    if (filter) {
      trackFilterItemClick({ type: 'date' });

      let valueToToggle = dueValue;
      if (filter.get('due') === dueValue) {
        valueToToggle = null;
      }

      filter.set('due', valueToToggle);
    }
  }

  const NO_DUE: Omit<DueFilterCriteriaOption, 'filterableWords'> = {
    value: 'notdue',
    label: format('notdue'),
  };

  const dueItemsList = [NO_DUE, ...dueList].map(({ value, label }) => {
    const isActive = dueFilter.toBoardString() === value;

    return (
      <li
        key={value}
        className={classNames(styles.dueListItem, isActive && styles.isActive)}
      >
        <a
          className={styles.dueListItemLink}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => toggleDue(value)}
          role="button"
        >
          <span>{label}</span>
          {isActive && (
            <CheckIcon
              size="small"
              dangerous_className={styles.dueListItemLinkIcon}
            />
          )}
        </a>
      </li>
    );
  });

  return <ul>{dueItemsList}</ul>;
};
