import { generateCSSVariables, populateThemedDesignTokens } from './ThemeHelpers';
import designSystemLightThemeColors from '../../themes/design-system-light.js';
import designSystemDarkThemeColors from '../../themes/design-system-dark.js';
import lightTheme from '../../themes/light.json';
import darkTheme from '../../themes/dark.json';

const THEME_LIGHT = 'light',
  THEME_DARK = 'dark';

const THEME_COLORS_MAP = {
  light: lightTheme,
  dark: darkTheme
};

const DESIGN_SYSTEM_THEME_COLORS_MAP = {
  light: designSystemLightThemeColors,
  dark: designSystemDarkThemeColors
};

/**
 * Theme manager delegator to manipulate DOM
 */
export default {

   /**
  * Initialize the ThemeDomDeligator
  * Removes the old theme and updates new theme to the dom
  * Attaches handler to event themeChanged
  * @param {string} theme - The name of the theme
  * @param {Object} eventBus
  * @public
  */
  init (theme) {
    this._applyTheme(theme);
    this._subscribeThemeChange();
  },

  /**
  * Removes the old theme and initiate the theme updation process
  * @param {String} theme- The name of theme to be applied
  * @private
  */
  _applyTheme (theme) {
    let currentTheme = theme;
    currentTheme = (currentTheme === THEME_LIGHT || currentTheme === THEME_DARK) ? currentTheme : THEME_LIGHT;
    this._useTheme(currentTheme);
    this._triggerMediator(currentTheme);
    this._addThemeClass(currentTheme);
  },

  /**
  * Attaches a handler to themeChanged event
  * @param {Object} eventBus
  * @private
  */
   _subscribeThemeChange () {
    let appEventsChannel = pm.eventBus.channel('theme-events');
    appEventsChannel.subscribe((event) => {
      if (event.name === 'themeChanged') {
        this._applyTheme(event.data.apptheme.currentTheme);
        pm.settings._updateCache('postmanTheme', event.data.apptheme.currentTheme);
      }
    });
  },

  /**
  * Adds the current theme name to app root level class
  * @param {String} theme- The name of theme to be added
  * @private
  */
  _addThemeClass (theme) {
    let rootEl = document.getElementById('app-root');
    rootEl.dataset.theme = theme;
  },

  /**
  * Uses the given theme
  * @param {string} theme- The name of theme
  * @private
  */
  _useTheme (theme) {
    let themeColors = THEME_COLORS_MAP[theme];
    let designSystemThemeColors = DESIGN_SYSTEM_THEME_COLORS_MAP[theme];
    let style = document.getElementById('theme');
    style.innerHTML = `
      :root {
        ${generateCSSVariables(themeColors)}
        ${populateThemedDesignTokens(designSystemThemeColors)}
      }
    `;
  },

  /* TODO:  Need to move this to store and observe on reactions */
  _triggerMediator (theme) {
    if (pm.mediator) {
      pm.mediator.trigger('themeChange', theme);
    }
  }
};
