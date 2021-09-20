import React from 'react';
import { EveryDayTrigger } from '@atlassian/butler-command-parser';
import { formatButlerCommand as format } from 'app/src/components/Butler/formatButlerCommand';
import { TriggerEditor } from '../types';

export const EveryDayTriggerEditor: TriggerEditor<EveryDayTrigger> = () => (
  <>{format('every_day_trigger')}</>
);
