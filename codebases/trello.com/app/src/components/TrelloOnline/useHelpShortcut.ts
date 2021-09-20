import { Key, useShortcut, Scope } from '@trello/keybindings';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { navigate } from 'app/scripts/controller/navigate';
import { Controller } from 'app/scripts/controller';
import { currentModelManager } from 'app/scripts/controller/currentModelManager';

const onShortcut = () => {
  if (currentModelManager.onAnyBoardView()) {
    navigate('/shortcuts/overlay');
    Controller.shortcutsOverlayPage();
  } else {
    navigate('/shortcuts', {
      trigger: true,
    });
  }

  return Analytics.sendPressedShortcutEvent({
    shortcutName: 'shortcutsPage',
    source: getScreenFromUrl(),
    keyValue: '?',
  });
};

export const useHelpShortcut = () => {
  useShortcut(onShortcut, {
    scope: Scope.Global,
    key: Key.QuestionMark,
  });
};
