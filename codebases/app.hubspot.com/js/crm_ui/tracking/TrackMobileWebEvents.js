'use es6';

import { CrmLogger } from 'customer-data-tracking/loggers';
var eventName = 'use-android-app-installprompt';
window.addEventListener('beforeinstallprompt', function (evt) {
  CrmLogger.log(eventName, {
    what_event_subtype: 'seen'
  }); // On Windows 10 Edge, this event can fire with an undefined `userChoice`
  // May be related to users cancelling the PWA install dialog on Windows 10
  // See https://sentry.hubteam.com/sentry/crm/issues/353616/

  if (!evt.userChoice) {
    return;
  }

  evt.userChoice.then(function (choiceResult) {
    var platform = choiceResult.platform,
        outcome = choiceResult.outcome;
    CrmLogger.log(eventName, {
      what_event_subtype: outcome + " " + platform
    });
  }).done();
});