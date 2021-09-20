import React from 'react';
import { CardIntoListTrigger } from '@atlassian/butler-command-parser';
import { formatButlerCommand as format } from 'app/src/components/Butler/formatButlerCommand';
import { CommandSelect, SelectOption } from '../CommandSelect';
import { useActionDestination } from '../useActionDestination';
import { TriggerEditor } from '../types';

export const CardIntoListTriggerEditor: TriggerEditor<CardIntoListTrigger> = ({
  trigger,
  update,
  idBoard,
}) => {
  const { lists, loading } = useActionDestination({ initialIdBoard: idBoard });

  return (
    <>
      {format('when_card_is_added_into_list_trigger', {
        list: (
          <CommandSelect
            key="when-card-into-list-trigger-list"
            width="180px"
            isLoading={loading}
            isSearchable={true}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={({ label }: SelectOption) => {
              update((draft) => {
                (draft.WHEN as CardIntoListTrigger).CARD_INTO_LIST.$LIST = label;
              });
            }}
            options={lists}
            placeholder={format('list name')}
            value={trigger.CARD_INTO_LIST.$LIST ?? null}
          />
        ),
      })}
    </>
  );
};
