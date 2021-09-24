'use es6';

var SELENIUM_DISABLE_ALARMS_KEY = 'selenium.disable.alarms';
/**
 * https://git.hubteam.com/HubSpot/faast-infra/issues/637
 * Local Storage key used by FaaS Test to hide Fire Alarms in Selenium tests.
 */

export default function alarmsDisabled(storage) {
  var disabled = storage && storage.getItem && storage.getItem(SELENIUM_DISABLE_ALARMS_KEY) === 'true';

  if (disabled) {
    console.warn("FireAlarms are currently disabled. Unset '" + SELENIUM_DISABLE_ALARMS_KEY + "' in localStorage to enable.");
  }

  return disabled;
}