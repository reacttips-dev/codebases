import { TriggeredCommand } from '@atlassian/butler-command-parser';
import { getTriggerMetadata } from './CommandMetadata';
import { Controller } from 'app/scripts/controller';

export enum ButlerTab {
  Rules = 'rules',
  BoardButton = 'board-button',
  CardButton = 'card-button',
  Schedule = 'scheduled',
  DueDate = 'on-date',
}

export const getButlerTabForRule = (
  command: TriggeredCommand,
): ButlerTab | undefined => {
  const commandType = getTriggerMetadata(command.TRIGGER)?.commandType;
  switch (commandType) {
    case 'rule':
      return ButlerTab.Rules;
    case 'schedule':
      return ButlerTab.Schedule;
    case 'on-date':
      return ButlerTab.DueDate;
    default:
      return;
  }
};

export const ButlerNewCommandId = 'new';

export const showButlerDirectory = async (
  idBoard: string,
  butlerTab?: ButlerTab,
  butlerCmdEdit?: string,
): Promise<void> => {
  return Controller.getCurrentBoardView().navigateToButlerView({
    tab: butlerTab,
    edit: butlerCmdEdit,
  });
};

export const toggleButler = async (): Promise<void> => {
  return Controller.getCurrentBoardView().toggleButlerView();
};
