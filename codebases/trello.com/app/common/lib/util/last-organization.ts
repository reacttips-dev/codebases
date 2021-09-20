/* eslint-disable import/no-default-export, @trello/disallow-filenames */
import { TrelloStorage } from '@trello/storage';

export default function lastOrganization(
  storage: typeof TrelloStorage = TrelloStorage,
) {
  const orgIdKey = 'idLastOrganization';
  const noOrgId = 'none';

  return {
    NO_ORGANIZATION: noOrgId,
    LAST_ORGANIZATION: orgIdKey,

    set(idOrganization: string): void {
      storage.set(orgIdKey, idOrganization ? idOrganization : noOrgId);
    },

    get(): string | null {
      const value = storage.get(orgIdKey);

      return typeof value === 'string' ? value : null;
    },
  };
}
