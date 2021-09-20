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
const { logoDomain, siteDomain } = require('@trello/config');
const { Auth } = require('app/scripts/db/auth');
const t = require('./teacup-with-helpers')();
const _ = require('underscore');

const methods = {
  mustacheRenderWithHelpers(body, data, opts, partials) {
    if (opts == null) {
      opts = {};
    }
    if (partials == null) {
      partials = {};
    }
    const args = _.extend(
      {
        __ed: opts.editable,
        __own: opts.owned,
        __loggedIn: Auth.isLoggedIn(),
        __siteDomain: siteDomain,
        __logoDomain: logoDomain,
      },
      data,
    );

    return t.mustacheRender(body, args, partials);
  },

  mustacheRenderModel(body, model, data, partials) {
    if (partials == null) {
      partials = {};
    }
    const opts = {
      editable:
        typeof model.editable === 'function' ? model.editable() : undefined,
      owned: typeof model.owned === 'function' ? model.owned() : undefined,
    };
    data = _.extend(model.toJSON(), data);
    return methods.mustacheRenderWithHelpers(body, data, opts, partials);
  },

  fill(template, data, opts, partials) {
    if (data == null) {
      data = {};
    }
    if (opts == null) {
      opts = {};
    }
    if (partials == null) {
      partials = {};
    }
    if (typeof template === 'string') {
      throw new Error(
        `You must now pass in an actual template, not a string. This makes our dependency tree more correct. The template we received was '${template}'`,
      );
    }
    return methods.mustacheRenderWithHelpers(template, data, opts, partials);
  },

  fillFromModel(template, model, data, partials) {
    if (data == null) {
      data = {};
    }
    if (partials == null) {
      partials = {};
    }
    if (typeof template === 'string') {
      throw new Error(
        `You must now pass in an actual template, not a string. This makes our dependency tree more correct. The template we received was '${template}'`,
      );
    }
    return methods.mustacheRenderModel(template, model, data, partials);
  },

  fillMenu(template, data, opts) {
    return methods.fill(require('app/scripts/views/templates/menu_base'), {
      content: this.fill(template, data, opts),
    });
  },
};

module.exports = methods;
