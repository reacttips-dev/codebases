import type { Command } from '@atlassian/butler-command-parser';
import { getTriggerType } from './TriggerMetadata';

export const getAnalyticsAttributesForCommand = (
  command: Command,
): { trigger: string | null; actions: string[] } => ({
  trigger: getTriggerType(command.TRIGGER),
  actions: command.ACTION.map(({ type }) => type),
});
