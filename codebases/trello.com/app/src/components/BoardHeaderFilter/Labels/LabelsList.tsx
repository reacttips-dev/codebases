import React, { useState, useEffect } from 'react';
import { forTemplate, forNamespace } from '@trello/i18n';
import { Attributes } from '../types';
import { LabelItem } from './LabelItem';
import { NO_LABELS } from 'app/common/lib/util/satisfies-filter';

import classnames from 'classnames';
// eslint-disable-next-line @trello/less-matches-component
import styles from './LabelItem.less';

import { LabelFilterCriteriaOption } from 'app/src/components/FilterPopover/FilterCriteriaOptions';
import { LabelsFilter } from 'app/src/components/ViewFilters/filters';
import { ModelCache } from 'app/scripts/db/model-cache';

const format = forTemplate('filter_cards_search_results');
const formatFiltering = forNamespace('filtering');

interface LabelsListProps {
  idBoard: string;
  labels: Omit<
    LabelFilterCriteriaOption,
    'filterableWords' | 'label' | 'value'
  >[];
  labelsFilter: LabelsFilter;
  isColorBlind: boolean;
  trackFilterItemClick: (attributes: Attributes) => void;
}

export const LabelsList: React.FunctionComponent<LabelsListProps> = ({
  idBoard,
  labels,
  labelsFilter,
  isColorBlind,
  trackFilterItemClick,
}) => {
  const [showAllLabels, setShowAllLabels] = useState(false);
  const LABELS_TO_DISPLAY = 5;

  function toggleLabel(idLabel: string) {
    const board = ModelCache.get('Board', idBoard);
    const filter = board?.filter;
    filter?.toggleIdLabel(idLabel);
  }

  function expandLabels() {
    setShowAllLabels(true);
  }

  const firstLabelsToDisplay = labels.slice(0, LABELS_TO_DISPLAY);

  useEffect(() => {
    // First check if we have any enabled labels that aren't shown
    const minimizedLabels = labels.slice(LABELS_TO_DISPLAY);

    const enabledLabelsUnderFold = minimizedLabels.some(({ name, color }) =>
      labelsFilter.isEnabled(color, name),
    );

    if (enabledLabelsUnderFold) {
      expandLabels();
    }
  }, [labels, labelsFilter]);

  const labelsToShow = showAllLabels ? labels : firstLabelsToDisplay;

  const DEFAULT_LABEL = (
    <LabelItem
      key={'none'}
      id={'none'}
      name={formatFiltering(NO_LABELS)}
      color="grey"
      toggleLabel={toggleLabel}
      isActive={labelsFilter.isEnabled(NO_LABELS, NO_LABELS)}
      isColorBlind={isColorBlind}
      trackFilterItemClick={trackFilterItemClick}
    />
  );

  const labelItemsList = [
    DEFAULT_LABEL,
    ...labelsToShow.map(({ id, name, color }) => (
      <LabelItem
        key={id}
        id={id}
        name={name}
        color={color || ''}
        toggleLabel={toggleLabel}
        isActive={labelsFilter.isEnabled(color, name)}
        isColorBlind={isColorBlind}
        trackFilterItemClick={trackFilterItemClick}
      />
    )),
  ];

  const numLabelsRemaining = Math.max(labels.length - LABELS_TO_DISPLAY, 0);

  return (
    <ul>
      {labelItemsList}
      {!showAllLabels && labels.length > LABELS_TO_DISPLAY && (
        <li className={classnames(styles.labelListItem, 'showAllLabels')}>
          <a
            className={styles.labelListItemLink}
            onClick={expandLabels}
            role="button"
          >
            <span
              className={classnames(
                styles.labelListItemLinkName,
                styles.modQuiet,
              )}
            >
              {format('show-all-labels-remaininglabels-hidden', {
                remainingLabels: numLabelsRemaining,
              })}
            </span>
          </a>
        </li>
      )}
    </ul>
  );
};
