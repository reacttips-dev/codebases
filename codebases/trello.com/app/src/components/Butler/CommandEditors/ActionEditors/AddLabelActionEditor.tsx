import React from 'react';
import { AddLabelAction } from '@atlassian/butler-command-parser';
import { formatButlerCommand as format } from 'app/src/components/Butler/formatButlerCommand';
import { LabelSelector } from '../LabelSelector';
import { ActionEditor } from '../types';

export const AddLabelActionEditor: ActionEditor<AddLabelAction> = ({
  action,
  update,
  idBoard,
}) => (
  <>
    {format('add_label_action', {
      label: (
        <React.Fragment key="add-label-label">
          {format('the label', {
            color: (
              <LabelSelector
                key="labelSelector"
                idBoard={idBoard}
                width="190px"
                value={action.ADD_LABEL_ACTION.LABEL}
                // eslint-disable-next-line react/jsx-no-bind
                onChange={(label) => {
                  update((draft: AddLabelAction) => {
                    draft.ADD_LABEL_ACTION.LABEL = label;
                  });
                }}
              />
            ),
            title: undefined,
          })}
        </React.Fragment>
      ),
      target: format('the card'),
    })}
  </>
);
