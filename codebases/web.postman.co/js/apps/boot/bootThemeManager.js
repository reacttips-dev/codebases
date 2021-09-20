import ThemeManager from '../../controllers/theme/ThemeManager';
import ThemeDomDelegator from '../../controllers/theme/ThemeDomDelegator';
import { isEmbeddedScratchpad } from '../../utils/ScratchpadUtils';

/**
 * Initialize Theme Dom delegator with current theme and eventBus
 *
 * @param {*} cb
 */
export default function bootThemeManager (cb, theme = null) {
  let currentTheme = theme ? theme : ThemeManager.getCurrentTheme();

  if (isEmbeddedScratchpad()) {
    let currentURL = new URL(location.href),
      outerViewTheme = currentURL.searchParams.get('currentTheme');
    if (outerViewTheme && outerViewTheme !== currentTheme) {
      ThemeManager.changeTheme(outerViewTheme);
      currentTheme = outerViewTheme;
    }
  }

  ThemeDomDelegator.init(currentTheme);

  pm.logger.info('ThemeManager~boot - Success');
  cb && cb(null);
}
