import Cookie from 'js-cookie';
import {
  isChrome,
  isDesktop,
  isEdge,
  isFirefox,
  isSafari,
} from './browser-detect';
import { TrelloWindow } from '@trello/window-types';
declare const window: TrelloWindow;

export function isEmbeddedDocument(): boolean {
  // When we run in Cypress, the header is hidden because Trello is running in an iframe.
  // We want to override this behavior so that the header is always shown when running in Cypress.
  const runsInCypress: boolean = window.Cypress !== undefined;

  const force_embeddedDocument =
    Cookie.get('force_embeddedDocument') === 'true';

  return (
    force_embeddedDocument || (window.top !== window.self && !runsInCypress)
  );
}

export const isTabActive = (): boolean =>
  document.visibilityState === 'visible';

export const isHighDPI = (): boolean => window.devicePixelRatio > 1;

// Safari 14 still not able to dynamically change favicon
export const supportsDynamicFavicon = (): boolean =>
  isChrome() || isFirefox() || isEdge();

export const supportsFancyPeel = (): boolean =>
  isChrome() || isFirefox() || isSafari();

export const isEmbeddedInMSTeams = (): boolean => {
  if (!isEmbeddedDocument()) {
    return false;
  }

  const search = new URLSearchParams(window.location.search);
  return search.has('iframeSource') && search.get('iframeSource') === 'msteams';
};

export const dontUpsell = (): boolean => isDesktop() || isEmbeddedInMSTeams();
