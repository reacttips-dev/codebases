/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  ModelWithPreferences,
} = require('app/scripts/models/internal/model-with-preferences');
const _ = require('underscore');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class ModelWithPersonalPreferences extends ModelWithPreferences {
  static initClass() {
    this.prototype.myPrefNames = [];
    this.prototype.myPrefDefaults = {};
  }

  constructor() {
    super(...arguments);
    this._initSubEventsOn('myPrefs');
  }

  toJSON(opts) {
    if (opts == null) {
      opts = {};
    }
    const data = super.toJSON(...arguments);

    if (opts.prefs) {
      for (const preference of Array.from(this.myPrefNames)) {
        const value = this.getPref(preference);
        data[preference] = value;
        data[`${preference}_${value}`] = true;
      }
    }

    return data;
  }

  getPref(name) {
    if (Array.from(this.myPrefNames).includes(name)) {
      let left;
      return (left = __guard__(this.get('myPrefs'), (x) => x[name])) != null
        ? left
        : this.myPrefDefaults[name];
    } else {
      return super.getPref(...arguments);
    }
  }

  setPref(name, value, next) {
    if (Array.from(this.myPrefNames).includes(name)) {
      return this.setMyPref(name, value, next);
    } else {
      return super.setPref(...arguments);
    }
  }

  setMyPref(name, value, next) {
    this.api(
      {
        type: 'put',
        method: `myPrefs/${name}`,
        data: { value },
      },
      next,
    );

    const myPrefs = _.clone(this.get('myPrefs'));
    myPrefs[name] = value;
    return this.set({ myPrefs });
  }
}
ModelWithPersonalPreferences.initClass();

module.exports.ModelWithPersonalPreferences = ModelWithPersonalPreferences;
