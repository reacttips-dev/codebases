export const needsAtlassianAccountRelinkedConfirmation = (
  oneTimeMessagesDismissed: string[],
) =>
  oneTimeMessagesDismissed.includes('aa-relinked') &&
  !oneTimeMessagesDismissed.includes('aa-relinked-confirmation');
