/* eslint-disable @trello/filename-case */

import React from 'react';
import { Trigger } from '@atlassian/butler-command-parser';
import { TriggerEditor } from '../types';

import { CardIntoListTriggerEditor } from './CardIntoListTriggerEditor';
import { CertainDaysTriggerEditor } from './CertainDaysTriggerEditor';
import { EveryDayTriggerEditor } from './EveryDayTriggerEditor';

export const renderTriggerEditor: TriggerEditor<Trigger> = ({
  trigger,
  ...rest
}) => {
  if (trigger.EVERY) {
    switch (trigger.EVERY.type) {
      case 'EVERY_DAY':
        return <EveryDayTriggerEditor trigger={trigger.EVERY} {...rest} />;
      case 'CERTAIN_DAYS':
        return <CertainDaysTriggerEditor trigger={trigger.EVERY} {...rest} />;
      default:
        return null;
    }
  } else if (trigger.WHEN) {
    switch (trigger.WHEN.type) {
      case 'CARD_INTO_LIST':
        return <CardIntoListTriggerEditor trigger={trigger.WHEN} {...rest} />;
      default:
        return null;
    }
  }
  return null;
};
