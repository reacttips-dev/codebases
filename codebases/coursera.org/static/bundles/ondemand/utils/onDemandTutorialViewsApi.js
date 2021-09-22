import Q from 'q';
import constants from 'bundles/ondemand/constants/Constants';
import API from 'bundles/phoenix/lib/apiWrapper';
import user from 'js/lib/user';

const api = API(constants.onDemandTutorialViewsApi);

/**
 * The onDemandTutorialViews API allows you to PUT an arbitrary key associated with a user ID,
 * which is useful for storing the occurrence of one-time events so they don't happen again.
 * Examples: Storing that the user has seen a "Session started" modal or completed a tutorial
 */
const onDemandTutorialViewsUtils = {
  /**
   * Stores the given key for the current user.
   * @param {string} key - The key to store. To store that a user has seen
   *   a particular modal, it could be `ModalName:${course_id}`.
   */
  storeKey: (key) => {
    return Q(api.put(`${user.get().id}~${key}`));
  },

  /**
   * @param {string} key - The key to look up in the store.
   * @returns {bool} - True if the key already exists in the store, false if not.
   */
  hasKey: (key) => {
    return Q(api.get(`${user.get().id}~${key}`))
      .then((response) => {
        if (response.elements) {
          return true;
        } else {
          return false;
        }
      })
      .fail(() => false);
  },
};

export default onDemandTutorialViewsUtils;

export const { storeKey, hasKey } = onDemandTutorialViewsUtils;
