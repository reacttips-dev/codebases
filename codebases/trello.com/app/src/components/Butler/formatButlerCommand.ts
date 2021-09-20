import { forNamespace } from '@trello/i18n';

export const formatButlerCommand = forNamespace(['butler', 'command'], {
  shouldEscapeStrings: false,
  returnBlankForMissingStrings: true,
  canOmitSubstitutions: true,
});
