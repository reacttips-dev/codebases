'use es6';

import Raven from 'Raven';
import { sendRequestQuotePurchaseNotification } from 'ui-addon-upgrades/_core/common/api/requestNotificationsApi';
import * as tracker from 'ui-addon-upgrades/_core/common/eventTracking/tracker';
import wrapWithErrorMonitoring from 'ui-addon-upgrades/_core/common/reliability/wrapWithErrorMonitoring';
export var requestQuotePurchase = wrapWithErrorMonitoring('requestQuotePurchase', function (_ref) {
  var hub = _ref.hub;
  return sendRequestQuotePurchaseNotification(hub).then(function () {
    // ********** PUBLIC EVENT **********
    // Public Events help teams across HubSpot automate work and customize experiences based on user actions.
    // Speak with #product-insight and your PM before any shipping any changes to this event incl. event name, properties, values, and when it occurs.
    // Read more about Public Events on the wiki: https://wiki.hubspotcentral.net/display/PM/Public+Events+-+Amplitude+events+ready+for+HubSpot+team+use+and+automation
    tracker.track('requestUpgradeInteraction', {
      action: 'request quote purchase notification succeeded'
    });
  }).catch(function (e) {
    // ********** PUBLIC EVENT **********
    // Public Events help teams across HubSpot automate work and customize experiences based on user actions.
    // Speak with #product-insight and your PM before any shipping any changes to this event incl. event name, properties, values, and when it occurs.
    // Read more about Public Events on the wiki: https://wiki.hubspotcentral.net/display/PM/Public+Events+-+Amplitude+events+ready+for+HubSpot+team+use+and+automation
    tracker.track('requestUpgradeInteraction', {
      action: 'request quote purchase notification failed'
    });
    Raven.captureMessage('Request quote purchase notification failed', {
      extra: {
        error: e
      }
    });
    throw e;
  });
});