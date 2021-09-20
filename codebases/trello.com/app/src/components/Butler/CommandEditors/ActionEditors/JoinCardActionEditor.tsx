import React from 'react';
import { JoinCardAction } from '@atlassian/butler-command-parser';
import { formatButlerCommand as format } from 'app/src/components/Butler/formatButlerCommand';
import { ActionEditor } from '../types';

export const JoinCardActionEditor: ActionEditor<JoinCardAction> = () => (
  <>{format('join_card_action')}</>
);
