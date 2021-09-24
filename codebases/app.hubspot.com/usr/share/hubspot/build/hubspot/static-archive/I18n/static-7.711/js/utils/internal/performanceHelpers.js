'use es6'; // Custom HubSpot logic to log key usage

var keysUsed = {};
var fallbackKeys = [];
var keyUsedTimeout;
var shouldLogUsage = Math.random() <= 0.05;
export function logKeyUsage(key, usedFallbackTranslation, requestedLocaleValue) {
  var hasSetKeysUsed = false;

  function setKeysUsed(newKey) {
    if (!hasSetKeysUsed) {
      keysUsed[newKey] = keysUsed[newKey] ? keysUsed[newKey] + 1 : 1;
    }

    hasSetKeysUsed = true;
  }

  try {
    if (localStorage.getItem('TRACK_I18N_MISSING_TRANSLATIONS')) {
      setKeysUsed(key);
      var currentProject = window.hubspot.bender.currentProject;
      var currentVersion = window.hubspot.bender.currentProjectVersion;
      localStorage.setItem('I18N_KEYS_USED:' + currentProject + ':' + currentVersion, JSON.stringify(keysUsed));
      var lsAppsTracked = localStorage.getItem('I18N_APPS_TRACKED');
      var trackedApps = {};
      var shouldUpdateTrackedApps = true;

      if (lsAppsTracked) {
        trackedApps = JSON.parse(lsAppsTracked);

        if (trackedApps[currentProject] && trackedApps[currentProject].indexOf(currentVersion) < 0) {
          trackedApps[currentProject].push(currentVersion);
        } else {
          shouldUpdateTrackedApps = false;
        }
      } else {
        trackedApps[currentProject] = [currentProject];
      }

      if (shouldUpdateTrackedApps) {
        localStorage.setItem('I18N_APPS_TRACKED', JSON.stringify(trackedApps));
      }
    }

    if (usedFallbackTranslation) {
      if (localStorage.getItem('TRACK_I18N_FALLBACK_TRANSLATIONS')) {
        var i18nFallbackTranslations = localStorage.getItem('TRACK_I18N_FALLBACK_TRANSLATIONS');

        if (!i18nFallbackTranslations) {
          i18nFallbackTranslations = key;
        } else {
          i18nFallbackTranslations = i18nFallbackTranslations.concat(',', key);
        }

        localStorage.setItem('I18N_FALLBACK_TRANSLATIONS', i18nFallbackTranslations);
      }
    }
  } catch (e) {
    return;
  }

  if (!shouldLogUsage) {
    return;
  }

  clearTimeout(keyUsedTimeout);
  setKeysUsed(key);

  if (usedFallbackTranslation && fallbackKeys.indexOf(key) === -1) {
    fallbackKeys.push(key);
  }

  keyUsedTimeout = setTimeout(function () {
    if (window.newrelic) {
      window.newrelic.addPageAction('i18nKeysUsed', {
        keysUsed: JSON.stringify(keysUsed),
        i18nKeyCount: Object.keys(keysUsed).length,
        fallbackKeys: JSON.stringify(fallbackKeys),
        englishFallbackCount: fallbackKeys.length,
        requestedLocaleValue: requestedLocaleValue
      });
    } // Don't leak memory if the tab stays open forever.


    shouldLogUsage = false;
    keysUsed = {};
  }, 1000 * 60);
} // End custom HubSpot Logic