import React, { useEffect, useMemo, useCallback, useContext } from 'react';
import { Button } from '@trello/nachos/button';
import { PopoverList } from 'app/src/components/PopoverList';
import { LabelsFilter } from 'app/src/components/ViewFilters/filters';
import {
  CardLabel,
  LabelColor,
  labelColorToColorBlindPattern,
} from '@atlassian/trello-canonical-components/src/card-front/CardLabel';
import {
  ActionSubjectIdType,
  ActionSubjectType,
  ActionType,
  Analytics,
} from '@trello/atlassian-analytics';
import { forTemplate } from '@trello/i18n';
import { sortLabels } from 'app/src/components/Label';

const format = forTemplate('multi_board_table_view');

const formatFilterCardsSearchResults = forTemplate(
  'filter_cards_search_results',
  { returnBlankForMissingStrings: true },
);

import styles from './LabelsFilterPopoverContent.less';
import { ViewFiltersContext } from 'app/src/components/ViewFilters';

type PopoverTarget = 'quickFilters' | 'headerCell';

interface Board {
  labels: {
    name: string;
    color?: string | undefined | null;
  }[];
}

interface Member {
  prefs?:
    | {
        colorBlind: boolean;
      }
    | null
    | undefined;
}

interface LabelsFilterPopoverContentProps {
  showResetButton: boolean;

  popoverTarget: PopoverTarget;
  idOrg: string;

  labelsFilter: LabelsFilter;
  setLabelsFilter: (labelsFilter: LabelsFilter) => void;
  boards: Board[] | undefined;
  member: Member;
}

const getUniqueLabels = (boards: Board[]) => {
  const labelsMap = new Map<string | null, Set<string>>();
  return boards.reduce((acc, curr) => {
    const uniqueLabelsFromBoard = curr.labels
      ? curr.labels.filter((label) => {
          const color = label.color || null;
          const colorSet = labelsMap.get(color);
          if (!colorSet) {
            labelsMap.set(
              color,
              new Set<string>([label.name]),
            );

            return true;
          }

          if (!colorSet.has(label.name)) {
            colorSet.add(label.name);
            return true;
          }

          return false;
        })
      : [];

    return [...acc, ...uniqueLabelsFromBoard];
  }, []);
};

const sendAnalyticsUIEvent = ({
  action,
  actionSubject,
  actionSubjectId,
  attributes,
  idOrg,
}: {
  action: ActionType;
  actionSubject: ActionSubjectType;
  actionSubjectId: ActionSubjectIdType;
  attributes?: {
    totalLabelFilters?: number;
    popoverTarget?: PopoverTarget;
  };

  idOrg: string;
}) => {
  Analytics.sendUIEvent({
    action,
    actionSubject,
    actionSubjectId,
    source: 'filterTableByLabelInlineDialog',
    attributes,
    containers: {
      organization: {
        id: idOrg,
      },
    },
  });
};

export const LabelsFilterPopoverContent = ({
  showResetButton,

  popoverTarget,
  idOrg,

  labelsFilter,
  setLabelsFilter,
  boards,
  member,
}: LabelsFilterPopoverContentProps) => {
  const clearLabelFilter = useCallback(() => {
    setLabelsFilter(new LabelsFilter());
    sendAnalyticsUIEvent({
      action: 'reset',
      actionSubject: 'filter',
      actionSubjectId: 'resetTableLabelFilter',
      attributes: {
        popoverTarget,
      },
      idOrg,
    });
  }, [setLabelsFilter, idOrg, popoverTarget]);

  const toggleFilterValue = useCallback(
    ([color, name]) => {
      setLabelsFilter(labelsFilter.toggle(color, name));

      let totalUniqueLabels = 0;
      for (const colorSet of labelsFilter.values()) {
        totalUniqueLabels += colorSet.size;
      }

      sendAnalyticsUIEvent({
        action: 'toggled',
        actionSubject: 'filter',
        actionSubjectId: 'filterTableByLabel',
        attributes: {
          totalLabelFilters: totalUniqueLabels,
          popoverTarget,
        },
        idOrg,
      });
    },
    [setLabelsFilter, labelsFilter, idOrg, popoverTarget],
  );

  if (!boards || !member) {
    throw new Error('Failed to get label header cell details from cache.');
  }

  const colorBlind = member?.prefs?.colorBlind;

  const isChecked = useCallback(
    ([color, name]) => labelsFilter.isEnabled(color, name),
    [labelsFilter],
  );

  const labelItems = useMemo(() => {
    const labels = getUniqueLabels(boards);

    return sortLabels(labels).map(({ name, color }) => {
      let defaultName = name;

      const formattedName = name
        ? name
        : formatFilterCardsSearchResults('color-label-default', {
            color,
          });

      if (!Array.isArray(formattedName)) {
        defaultName = formattedName;
      }

      return {
        name: name || defaultName,
        value: [color, name],
        checked: isChecked,
        onClick: toggleFilterValue,
        icon: (
          <CardLabel
            color={(color || 'gray') as LabelColor}
            className={styles.labelModSquare}
            pattern={
              colorBlind
                ? labelColorToColorBlindPattern[color as LabelColor]
                : null
            }
          />
        ),
      };
    });
  }, [colorBlind, boards, isChecked, toggleFilterValue]);

  return (
    <>
      <PopoverList
        items={labelItems}
        searchable
        searchPlaceholder={format('search-labels')}
      />
      {showResetButton && (
        <Button
          className={styles.clearButton}
          appearance="default"
          shouldFitContainer
          onClick={clearLabelFilter}
        >
          {format('reset-label-filters')}
        </Button>
      )}
    </>
  );
};

export const useClearLabelsFiltersWhenRemovingBoards = (boards?: Board[]) => {
  const { viewFilters } = useContext(ViewFiltersContext);
  // When boards are removed from the table view, we want to remove any selected labels that are
  // unique to the removed boards.
  useEffect(() => {
    if (!boards || !viewFilters.editable) {
      return;
    }

    // All of the labels on all boards as a map from color => set of label names for that color.
    const labels = getUniqueLabels(boards);
    const labelsByColorMap = new Map();
    labels.forEach((labelItem) => {
      const { color, name } = labelItem;
      if (labelsByColorMap.has(color)) {
        labelsByColorMap.get(color).add(name);
      } else {
        labelsByColorMap.set(color, new Set([name]));
      }
    });

    // Copy all filters over unless they don't exist on any of the boards after update.
    const newFilterValue = new LabelsFilter();
    viewFilters.filters.labels.forEach((names, color) => {
      names.forEach((name) => {
        const colorLabels = labelsByColorMap.get(color);
        if (colorLabels && colorLabels.has(name)) {
          newFilterValue.enable(color, name);
        }
      });
    });

    if (!newFilterValue.equals(viewFilters.filters.labels)) {
      viewFilters.setFilter(newFilterValue);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boards]); // We only want this to fire when the selected boards have changed.
};
