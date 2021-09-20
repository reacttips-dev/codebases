import { TrelloWindow } from '@trello/window-types';
declare const window: TrelloWindow;

export const trackGTMEvent = (update: object) => {
  const gtm = window.dataLayer;
  if (gtm) {
    gtm.push(update);
  }
};
