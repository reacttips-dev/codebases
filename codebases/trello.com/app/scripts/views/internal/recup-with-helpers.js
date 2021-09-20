/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const templateHelpers = require('./template-helpers');
const recup = require('recup');
const protoExtend = require('proto-extend');
const _ = require('underscore');

module.exports = templateHelpers(
  protoExtend(recup, {
    b(onClick, ...args) {
      const { attrs, contents } = this.normalizeArgs(args);

      if (attrs.href != null) {
        throw Error("Can't specify an href on a `b` tag");
      }
      attrs.href = '#';

      if (attrs.onClick != null) {
        throw Error('onClick must be a positional argument to `b`');
      }

      const { disabled } = attrs;
      attrs.onClick = function (e) {
        e.preventDefault();
        if (!disabled) {
          return onClick(e.currentTarget);
        }
      };

      return this.a(attrs, contents);
    },

    radio(component, name, value, callback) {
      const onChange = function (e) {
        if (e.target.checked) {
          const change = {};
          change[name] = value;
          component.setState(change);
          if (_.isFunction(callback)) {
            callback();
          }
        }
      };
      const checked = _.isEqual(component.state[name], value);

      return this.input({ type: 'radio', name, value, checked, onChange });
    },

    statelessRenderable(displayName, fn) {
      return _.extend(this.renderable(fn, { displayName }));
    },
  }),
);
