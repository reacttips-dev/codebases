import Raven from 'Raven';
import { formUrl } from 'self-service-api/core/utilities/links';
import { submitForm } from 'ui-addon-upgrades/_core/common/api/submitForm';
import { createPqlFormData } from 'ui-addon-upgrades/_core/common/data/pqlData/createPqlFormData';
import { getUserInfo } from 'ui-addon-upgrades/_core/common/api/getUserInfo';
import * as tracker from 'ui-addon-upgrades/_core/common/eventTracking/tracker';
import wrapWithErrorMonitoring from 'ui-addon-upgrades/_core/common/reliability/wrapWithErrorMonitoring';
import { getPqlFormAttributes } from 'ui-addon-upgrades/_core/pql/getPqlFormAttributes';
// to use only when additional PQL information is being submitted. i.e. email or phone number
export var submitAdditionalPqlForm = function submitAdditionalPqlForm(pqlData) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var formAttributes = getPqlFormAttributes();
  var formEndpoint = formUrl(formAttributes);
  return getUserInfo().then(function (_ref) {
    var portal = _ref.portal,
        user = _ref.user;
    var metaData = {
      timestamp: Date.now()
    };
    var pqlFormData = createPqlFormData({
      metaData: metaData,
      upgradeData: pqlData,
      user: user,
      portal: portal,
      options: options
    });
    return submitForm(formEndpoint, pqlFormData);
  }).catch(function (error) {
    Raven.captureMessage('Additional PQL information failed to submit', {
      extra: {
        error: error
      }
    });
  });
};
export var submitPql = wrapWithErrorMonitoring('submitPql', function (pqlData) {
  var formAttributes = getPqlFormAttributes();
  var formEndpoint = formUrl(formAttributes);
  return getUserInfo().then(function (_ref2) {
    var portal = _ref2.portal,
        user = _ref2.user;
    var metaData = {
      timestamp: Date.now()
    };
    var pqlFormData = createPqlFormData({
      metaData: metaData,
      upgradeData: pqlData,
      user: user,
      portal: portal
    });
    return submitForm(formEndpoint, pqlFormData);
  }).then(function () {
    // ********** PUBLIC EVENT **********
    // Public Events help teams across HubSpot automate work and customize experiences based on user actions.
    // Speak with #product-insight and your PM before any shipping any changes to this event incl. event name, properties, values, and when it occurs.
    // Read more about Public Events on the wiki: https://wiki.hubspotcentral.net/display/PM/Public+Events+-+Amplitude+events+ready+for+HubSpot+team+use+and+automation
    tracker.trackBeforeUnload('pqlInteraction', Object.assign({
      action: 'submission succeeded'
    }, pqlData));
  }).catch(function (error) {
    // ********** PUBLIC EVENT **********
    // Public Events help teams across HubSpot automate work and customize experiences based on user actions.
    // Speak with #product-insight and your PM before any shipping any changes to this event incl. event name, properties, values, and when it occurs.
    // Read more about Public Events on the wiki: https://wiki.hubspotcentral.net/display/PM/Public+Events+-+Amplitude+events+ready+for+HubSpot+team+use+and+automation
    tracker.trackBeforeUnload('pqlInteraction', Object.assign({
      action: 'submission failed'
    }, pqlData));
    throw error;
  });
});