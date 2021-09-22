import Q from 'q';
import logger from 'js/app/loggerSingleton';
import userPreferencesApi from 'bundles/user-preferences/lib/api';

/**
 * @param {Fluxible.ActionContext} actionContext
 * @return {Promise}
 */
export const loadHonorsUserPreferences = function (actionContext, { authenticated }) {
  if (actionContext.getStore('HonorsUserPreferencesStore').hasLoaded()) {
    return Q();
  }

  if (authenticated) {
    return userPreferencesApi
      .get(userPreferencesApi.keyEnum.HONORS)
      .then((honorsUserPreferences) => {
        actionContext.dispatch('LOAD_HONORS_USER_PREFERENCES', honorsUserPreferences);
      })
      .fail((error) => {
        actionContext.dispatch('LOAD_HONORS_USER_PREFERENCES', {});
      });
  } else {
    actionContext.dispatch('LOAD_HONORS_USER_PREFERENCES', {});
    return Q();
  }
};

/**
 * @param {Fluxible.ActionContext} actionContext
 * @param {object} options
 * @return {Promise}
 */
export const setHonorsUserPreferences = function (actionContext, { authenticated, updatedHonorsUserPreferences }) {
  if (authenticated) {
    return userPreferencesApi.set(userPreferencesApi.keyEnum.HONORS, updatedHonorsUserPreferences).then(() => {
      actionContext.dispatch('LOAD_HONORS_USER_PREFERENCES', updatedHonorsUserPreferences);
    });
  } else {
    actionContext.dispatch('LOAD_HONORS_USER_PREFERENCES', updatedHonorsUserPreferences);

    return Q();
  }
};

export const setLessonSkipped = function (actionContext, { lessonId, skipped }) {
  actionContext.dispatch('SET_LESSON_SKIPPED', { lessonId, skipped });
};
