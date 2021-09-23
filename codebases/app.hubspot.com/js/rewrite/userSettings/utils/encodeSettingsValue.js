'use es6'; // Mostly duplicated from https://git.hubteam.com/HubSpot/CRM/blob/3cece0059d463e6d0c6af15390ccb8ce1d216ee8/crm_data/static/js/settings/UserSettingsSerialization.js#L10

export function encodeSettingsValue(value) {
  var encodedValue;

  try {
    encodedValue = JSON.stringify(value);
  } catch (e) {
    encodedValue = value;
  }

  return encodedValue;
}