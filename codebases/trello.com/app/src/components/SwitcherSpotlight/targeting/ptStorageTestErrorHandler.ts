import { StorageTestErrorHandler } from './useIsLocalStorageEnabled';
import { Analytics } from '@trello/atlassian-analytics';

export const ptStorageTestErrorHandler: StorageTestErrorHandler = ({
  message,
  details,
}) => {
  try {
    let boards: number = 0;
    let collabs: number = 0;
    let sites: number = 0;
    let cacheSize: number = 0;

    const parsed = JSON.parse(details?.attemptedValue ?? '');

    if (
      typeof parsed === 'object' &&
      parsed.boards &&
      parsed.collaborators &&
      parsed.sites
    ) {
      boards = Object.keys(parsed.boards).length;
      collabs = Object.keys(parsed.collaborators).length;
      sites = Object.keys(parsed.sites).length;
      cacheSize = details?.attemptedValue?.length ?? 0;
    }

    Analytics.sendOperationalEvent({
      action: 'errored',
      actionSubject: 'SwitcherNudgeLocalStorageCheck',
      source: 'unknown',
      attributes: {
        message,
        boards,
        collabs,
        sites,
        cacheSize,
      },
    });
  } catch (e) {
    // no need to do anything here
  }
};
