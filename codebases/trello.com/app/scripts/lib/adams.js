/* eslint-disable
    eqeqeq,
    no-prototype-builtins,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const teacup = require('teacup');

let scopes = null;
let registeredPartials = null;

// _.result, but adams doesn't
// want to depend on underscore.
const force = function (valOrFunction) {
  if (typeof valOrFunction === 'function') {
    return valOrFunction();
  } else {
    return valOrFunction;
  }
};

// Returns an object of { val: answer } if
// the keyPath resolves; returns an empty
// object otherwise.
const lookupScope = function (keyPath, scope) {
  if (keyPath === '.') {
    return { val: scope };
  }

  // This can happen within the body of a loop
  if (typeof scope !== 'object' || scope === null) {
    return {};
  }

  let target = scope;
  for (const key of Array.from(keyPath.split('.'))) {
    if (!(key in target)) {
      return {};
    }
    target = target[key];
  }

  return { val: target };
};

const methods = {
  mustacheRender(body, data, partials) {
    if (partials == null) {
      partials = {};
    }
    if (scopes != null) {
      throw new Error('Cannot nest calls to mustacheRender');
    }
    return teacup.render(function () {
      registeredPartials = partials;
      scopes = [data];
      try {
        body();
      } finally {
        scopes = null;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        registeredPartials = null;
      }
    });
  },

  mustacheVar(name) {
    if (scopes == null) {
      throw new Error(
        'Attempt to render a mustache template outside of a mustacheRender',
      );
    }
    for (let i = scopes.length - 1; i >= 0; i--) {
      const scope = scopes[i];
      const result = lookupScope(name, scope);
      if (result.hasOwnProperty('val')) {
        return force(result.val);
      }
    }
    return '';
  },

  mustachePartial(template) {
    if (typeof template !== 'function') {
      throw new Error(
        `When calling mustachePartial you must pass a template as a function. We saw ${template}`,
      );
    }
    return template();
  },

  mustacheBlock(varName, body) {
    const value = this.mustacheVar(varName);

    if (!value) {
      return '';
    }

    let returnValue = undefined;
    if (Array.isArray(value)) {
      for (const obj of Array.from(value)) {
        scopes.push(obj);
        body();
        scopes.pop();
      }
    } else if (typeof value === 'object') {
      scopes.push(value);
      returnValue = body();
      scopes.pop();
    } else {
      returnValue = body();
    }
    return returnValue;
  },

  mustacheBlockInverted(varName, body) {
    const value = this.mustacheVar(varName);

    if (value) {
      return '';
    }
    return body();
  },
};
module.exports.adams = require('proto-extend')(teacup, methods);
