const { l } = require('app/scripts/lib/localize');
const { showFlag, dismissFlag } = require('@trello/nachos/experimental-flags');

/**
 * Alerts is our legacy way to show messages to the user.
 * With the Flags system, this is now simply a wrapper around legacy calls,
 * and should likely not be used directly. It is persisted primarily for the
 * `show` method, which references translation keys stored in the Alerts
 * localization namespace, which also should not be used moving forward.
 */
class Alerts {
  /**
   * Massage alerts into Flags. Area is equivalent to `id`, and the presence of
   * an `msTimeout` turns the Flag into an AutoDismiss Flag. displayType is
   * mapped into Flag appearance, with `confirm` value converted to `success`.
   */
  _showFlag({ title, displayType, area, msTimeout }) {
    let appearance;
    switch (displayType) {
      case 'info':
      case 'warning':
      case 'error':
        appearance = displayType;
        break;
      case 'confirm':
        appearance = 'success';
        break;
      default:
        break; // undefined appearance is valid
    }
    showFlag({
      id: area,
      title,
      appearance,
      isAutoDismiss: !!msTimeout,
      msTimeout,
    });
  }

  /**
   * Maintained solely for alerts with localizations in the Alerts namespace.
   * Use `showFlag` directly instead, with localization result set to `title`.
   * @deprecated
   */
  show(key, displayType, area, msTimeout) {
    let data;
    if (Array.isArray(key)) {
      [key, data] = Array.from(key);
    } else {
      data = {};
    }
    const title = l(['alerts', key], data);
    this._showFlag({ title, displayType, area, msTimeout });
  }

  /**
   * These are equivalent to `show` calls with msTimeout set to 2000.
   * Use `showFlag` directly with the localization result set to `title` and
   * `msTimeout` set to 2000.
   * @deprecated
   */
  flash(key, displayType, area) {
    return this.show(key, displayType, area, 2000);
  }

  /**
   * These can be converted directly to `showFlag` invocations.
   * See `packages/nachos/src/experimental/Flags/showFlag`.
   * @deprecated
   */
  showLiteralText(text, displayType, area, msTimeout = undefined) {
    this._showFlag({ title: text, displayType, area, msTimeout });
  }

  /**
   * Use `dismissFlag` directly.
   * @deprecated
   */
  hide(area) {
    dismissFlag({ id: area });
  }
}

/**
 * This package is deprecated; use Flags instead.
 * See `packages/nachos/src/experimental/Flags/showFlag`.
 * @deprecated
 */
module.exports = new Alerts();
