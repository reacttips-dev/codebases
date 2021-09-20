/**
 * Get the value of the setting provided
 */
export function getSettingValue (settingName) {
  return pm.settings.getSetting(settingName);
}
