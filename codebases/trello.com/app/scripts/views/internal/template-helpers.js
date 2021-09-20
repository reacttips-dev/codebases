/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { normalizeKeyPath } = require('app/scripts/lib/babble');
const { l } = require('app/scripts/lib/localize');
const protoExtend = require('proto-extend');
const xtend = require('xtend');

const stringifyValues = (obj) =>
  _.object(
    (() => {
      const result = [];
      for (const key of Object.keys(obj || {})) {
        const value = obj[key];
        result.push([key, value.toString()]);
      }
      return result;
    })(),
  );
const methods = {
  format() {
    this.raw(this.l.apply(this, arguments));
  },

  // For use in cases where the <span> added by @raw won't work, e.g. inside
  // an option.  Note that any HTML in the translation is going to be escaped.
  formatText() {
    return this.text(this.l.apply(this, arguments));
  },

  classify(hash) {
    return (() => {
      const result = [];
      for (const key in hash) {
        const value = hash[key];
        if (value) {
          result.push(key);
        }
      }
      return result;
    })().join(' ');
  },

  urlify(url) {
    url = url
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
    return `url('${url}')`;
  },

  stylify(hash) {
    return (() => {
      const result = [];
      for (const key in hash) {
        const value = hash[key];
        if (value) {
          result.push(`${key}: ${value};`);
        }
      }
      return result;
    })().join('');
  },

  addRecolorParam(url, param) {
    // only add the parameter if it's not a data url, because adding the
    // parameter to a data url will break the url. A data url can't respond to the
    // param anyway, of course
    if (/^data:/.test(url)) {
      return url;
    } else {
      return url + param;
    }
  },

  optionSelected(selected, props, body) {
    if (selected) {
      props = _.extend({ selected: 'selected' }, props);
    }
    return this.option(props, body);
  },

  check(val, key) {
    this.format(key);
    this.text(' ');
    if (val) {
      this.icon('check');
      this.text(' ');
    }
  },

  icon(name, textKey, properties) {
    if (properties == null) {
      properties = {};
    }
    if (typeof textKey === 'object') {
      properties = textKey;
      textKey = undefined;
    }
    const additionalClasses = properties.class != null ? properties.class : '';
    const props = xtend(properties, {
      class: `icon-sm icon-${name} ${additionalClasses}`.trim(),
    });
    this.span(props);
    if (textKey != null) {
      this.raw('&nbsp;');
      this.format(textKey);
    }
  },
};

module.exports = function (t) {
  const base = protoExtend(t, methods);

  return (name) =>
    protoExtend(base, {
      l(key, args, options) {
        key = normalizeKeyPath(key);
        return l(
          ['templates', name, ...Array.from(key)],
          stringifyValues(args),
          options,
        );
      },
    });
};
