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
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { tracingCallback } = require('@trello/atlassian-analytics');
const TrelloModel = require('app/scripts/models/internal/trello-model');
const _ = require('underscore');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class ModelWithPreferences extends TrelloModel {
  static initClass() {
    this.prototype.prefNames = [];
  }

  constructor() {
    super(...arguments);
    this._initSubEventsOn('prefs');
  }

  toJSON(opts) {
    if (opts == null) {
      opts = {};
    }
    const data = super.toJSON(...arguments);

    // Converts a deep object level into a flat mapping. For example:
    // prefs:
    //   foo: bar
    //   baz:
    //    aaa: 1
    //    bbb: 2
    //
    // foo = bar
    // baz_aaa = 1
    // baz_bbb = 2
    //
    const getDeepPrefs = (prefList, obj, prefix) => {
      return (() => {
        const result = [];
        for (const preference of Array.from(prefList)) {
          const key = prefix ? `${prefix}_${preference}` : preference;
          const value =
            (obj != null ? obj[preference] : undefined) != null
              ? obj != null
                ? obj[preference]
                : undefined
              : this.getPref(preference);
          if (_.isObject(value) && !_.isArray(value)) {
            result.push(getDeepPrefs(_.keys(value), value, key));
          } else {
            data[key] = value;
            result.push((data[`${key}_${value}`] = true));
          }
        }
        return result;
      })();
    };

    if (opts.prefs) {
      getDeepPrefs(this.prefNames);
    }

    return data;
  }

  getPref(name) {
    return __guard__(this.get('prefs'), (x) => x[name]);
  }

  setPref(name, value, next) {
    return this.update(`prefs/${name}`, value, next);
  }

  setPrefWithTracing(name, value, tracingCallbackArgs) {
    const key = `prefs/${name}`;
    const { traceId, next, ...tracingArgs } = tracingCallbackArgs;
    const params = {
      traceId,
    };
    params[key] = value;
    return this.update(
      params,
      tracingCallback({ traceId, ...tracingArgs }, next),
    );
  }

  set(attrs, options) {
    attrs = _.clone(attrs);
    if (attrs.prefs != null) {
      // Take care of some problems with the notifications; they're sending the values from the DB, which don't
      // actually match what we get from the API
      const { prefs } = attrs;
      for (const key in prefs) {
        let value = prefs[key];
        if (value === 'none') {
          value = 'disabled';
        }
        if (value === 'owners') {
          value = 'admins';
        }
        prefs[key] = value;
      }
    }

    return super.set(...arguments);
  }
}
ModelWithPreferences.initClass();

module.exports.ModelWithPreferences = ModelWithPreferences;
