import React, { useMemo } from 'react';
import { SortListAction } from '@atlassian/butler-command-parser';
import { formatButlerCommand as format } from 'app/src/components/Butler/formatButlerCommand';
import { CommandSelect, SelectOption } from '../CommandSelect';
import { LabelSelector } from '../LabelSelector';
import { useActionDestination } from '../useActionDestination';
import { ActionEditor } from '../types';

type SortListOption = keyof SortListAction['SORT_LIST_ACTION'];

interface FieldOption extends SelectOption {
  value: Exclude<
    SortListOption,
    '$LIST' | 'SORT_ASCENDING' | 'SORT_DESCENDING'
  >;
}

const FIELD_OPTIONS: FieldOption[] = [
  { label: format('age'), value: 'SORT_BY_AGE' },
  // { label: format('custom field'), value: 'SORT_BY_CUSTOM_FIELD' },
  // { label: format('date in title'), value: 'SORT_BY_DATE_IN_TITLE' },
  { label: format('start date'), value: 'SORT_BY_START_DATE' },
  { label: format('due date'), value: 'SORT_BY_DUE_DATE' },
  { label: format('the label'), value: 'SORT_BY_LABEL' },
  { label: format('time in list'), value: 'SORT_BY_TIME_IN_LIST' },
  { label: format('name'), value: 'SORT_BY_TITLE' },
  { label: format('votes'), value: 'SORT_BY_VOTES' },
];

interface DirectionOption extends SelectOption {
  value: Extract<SortListOption, 'SORT_ASCENDING' | 'SORT_DESCENDING'>;
}

const DIRECTION_OPTIONS: DirectionOption[] = [
  { label: format('ascending'), value: 'SORT_ASCENDING' },
  { label: format('descending'), value: 'SORT_DESCENDING' },
];

export const SortListActionEditor: ActionEditor<SortListAction> = ({
  action,
  update,
  idBoard,
}) => {
  const isListSpecified = !!action.SORT_LIST_ACTION.$LIST;
  const { lists, loading } = useActionDestination({
    initialIdBoard: idBoard,
    skip: !isListSpecified,
  });
  const field = useMemo(
    () => FIELD_OPTIONS.find(({ value }) => !!action.SORT_LIST_ACTION[value]),
    [action],
  );
  const sortDirection: DirectionOption = action.SORT_LIST_ACTION.SORT_ASCENDING
    ? DIRECTION_OPTIONS[0]
    : DIRECTION_OPTIONS[1];

  const renderLabelSelector = () => {
    if (!action.SORT_LIST_ACTION.SORT_BY_LABEL) {
      return null;
    }
    const { SORT_LABEL } = action.SORT_LIST_ACTION.SORT_BY_LABEL;
    const value = Array.isArray(SORT_LABEL) ? SORT_LABEL[0] : SORT_LABEL;
    return (
      <LabelSelector
        key="sort-list-by-label-selector"
        idBoard={idBoard}
        value={value}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={(label) => {
          update((draft: SortListAction) => {
            draft.SORT_LIST_ACTION.SORT_BY_LABEL = {
              SORT_LABEL: label,
            };
          });
        }}
      />
    );
  };

  return (
    <>
      {format('sort_list_action', {
        list: format('the list', {
          title: isListSpecified ? (
            <CommandSelect
              key="sort-list-list"
              width="180px"
              isLoading={loading}
              isSearchable={true}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={({ label }: SelectOption) => {
                update((draft: SortListAction) => {
                  draft.SORT_LIST_ACTION.$LIST = label;
                });
              }}
              options={lists}
              placeholder={format('list name')}
              value={action.SORT_LIST_ACTION.$LIST}
            />
          ) : undefined,
        }),
        field: (
          <React.Fragment key="sort-list-field">
            <CommandSelect
              key="sort-list-field-select"
              // eslint-disable-next-line react/jsx-no-bind
              onChange={({ value }: FieldOption) => {
                if (field?.value !== value) {
                  update((draft: SortListAction) => {
                    const {
                      $LIST,
                      SORT_ASCENDING,
                      SORT_DESCENDING,
                    } = draft.SORT_LIST_ACTION;
                    draft.SORT_LIST_ACTION = {
                      $LIST,
                      SORT_ASCENDING,
                      SORT_DESCENDING,
                      [value]:
                        value === 'SORT_BY_LABEL' ? { SORT_LABEL: {} } : true,
                    };
                  });
                }
              }}
              options={FIELD_OPTIONS}
              value={field}
              width="180px"
            />
            {renderLabelSelector()}
          </React.Fragment>
        ),
        direction: (
          <CommandSelect
            key="sort-list-direction"
            // eslint-disable-next-line react/jsx-no-bind
            onChange={({ value }: DirectionOption) => {
              update((draft: SortListAction) => {
                const {
                  SORT_ASCENDING,
                  SORT_DESCENDING,
                  ...rest
                } = draft.SORT_LIST_ACTION;
                draft.SORT_LIST_ACTION = {
                  ...rest,
                  [value]: true,
                };
              });
            }}
            options={DIRECTION_OPTIONS}
            value={sortDirection}
            width="150px"
          />
        ),
        secondary_sort: undefined,
      })}
    </>
  );
};
