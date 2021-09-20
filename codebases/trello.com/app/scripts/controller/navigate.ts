import Backbone from '@trello/backbone';
import { TrelloStorage } from '@trello/storage';
import { clientVersion } from '@trello/config';
import {
  shouldReloadToUpdate,
  startTime,
  reloadedToUpdateStorageKey,
} from '@trello/client-updater';
import { getLocation } from '@trello/router';
import { getRouteIdFromPathname } from '@trello/routes';
import { BackboneHistoryNavigateOptions } from 'app/src/router/Router.types';
import { TrelloWindow } from '@trello/window-types';
declare const window: TrelloWindow;

export const navigate = (
  path: string,
  options?: BackboneHistoryNavigateOptions,
) => {
  // If we're due for an update, refresh the page instead of routing client-
  // side.
  if (shouldReloadToUpdate(path)) {
    const nextUrl = new URL(path, window.location.origin);
    // Write info about the current session to local storage, so that we can
    // pick it up on the next page load and send an operational event
    try {
      TrelloStorage.set(reloadedToUpdateStorageKey, {
        fromClientVersion: clientVersion,
        fromRoute: getRouteIdFromPathname(getLocation().pathname),
        toRoute: getRouteIdFromPathname(nextUrl.pathname),
        sessionLengthInSeconds: (Date.now() - startTime) / 1000,
      });
    } catch (e) {
      // We can't do anything for storage write errors at this point, we're
      // about to reload anyhow
    }

    window.location.href = nextUrl.href;
    return;
  }

  Backbone.history.navigate(path, options);
};
