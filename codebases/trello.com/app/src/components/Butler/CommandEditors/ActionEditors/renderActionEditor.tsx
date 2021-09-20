/* eslint-disable @trello/filename-case */

import React from 'react';
import { Action } from '@atlassian/butler-command-parser';
import { ActionEditor } from '../types';

import { CopyCardActionEditor } from './CopyCardActionEditor';
import { MoveCardActionEditor } from './MoveCardActionEditor';
import { MarkDueDateCompleteActionEditor } from './MarkDueDateCompleteActionEditor';
import { RemoveFromCardActionEditor } from './RemoveFromCardActionEditor';
import { JoinCardActionEditor } from './JoinCardActionEditor';
import { AddDueDateActionEditor } from './AddDueDateActionEditor';
import { SortListActionEditor } from './SortListActionEditor';
import { AddLabelActionEditor } from './AddLabelActionEditor';

export const renderActionEditor: ActionEditor<Action> = ({
  action,
  index,
  ...rest
}) => {
  const key = `${action.type}-${index}`;
  switch (action.type) {
    case 'COPY_CARD_ACTION':
      return <CopyCardActionEditor key={key} action={action} {...rest} />;
    case 'MOVE_CARD_ACTION':
      return <MoveCardActionEditor key={key} action={action} {...rest} />;
    case 'MARK_DUE_COMPLETE_ACTION':
    case 'UNMARK_DUE_COMPLETE_ACTION':
      return (
        <MarkDueDateCompleteActionEditor key={key} action={action} {...rest} />
      );
    case 'REMOVE_FROM_CARD_ACTION':
      return <RemoveFromCardActionEditor key={key} action={action} {...rest} />;
    case 'JOIN_CARD_ACTION':
      return <JoinCardActionEditor key={key} action={action} {...rest} />;
    case 'ADD_DUE_DATE_ACTION':
    case 'ADD_START_DATE_ACTION':
      return <AddDueDateActionEditor key={key} action={action} {...rest} />;
    case 'SORT_LIST_ACTION':
      return <SortListActionEditor key={key} action={action} {...rest} />;
    case 'ADD_LABEL_ACTION':
      return <AddLabelActionEditor key={key} action={action} {...rest} />;
    default:
      return null;
  }
};
