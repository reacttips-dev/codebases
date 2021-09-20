import { createEvent } from '../../modules/model-event';

/**
 * Theme manager to update the current theme and propagate the change to other window
 */
export default {
  /**
  * Updates the current theme value
  * Propagates the themeChanged event with current theme value
  * @param {string} theme
  * @public
  */
  changeTheme (theme) {
    return new Promise((resolve, reject) => {
    this._setCurrentTheme(theme);
    this._publishCurrentTheme();
    resolve({ msg: 'themeChanged', currentTheme: theme });
  });
  },

  /**
  * Returns the current theme value
  * @public
  */
  getCurrentTheme () {
    return pm.settings.getSetting('postmanTheme') || 'light';
  },

  /**
  * Checks whether the current theme should be dark
  * @public
  */
  isDark () {
    return this.getCurrentTheme() === 'dark';
  },

  /**
  * Publishes the themeChanged event with current theme data
  * @private
  */
  _publishCurrentTheme () {
    let currentTheme = this.getCurrentTheme();

    let themeEventsChannel = pm.eventBus.channel('theme-events');
    themeEventsChannel.publish(createEvent('themeChanged', 'apptheme',
      { model: 'apptheme', apptheme: { currentTheme } },
      { name: 'updated', namespace: 'apptheme', data: { currentTheme } }));
  },

  /**
  * Updates the Postman theme with given theme
  * @private
  */
  _setCurrentTheme (themeName) {
    pm.settings.setSetting('postmanTheme', themeName);
  }
};
