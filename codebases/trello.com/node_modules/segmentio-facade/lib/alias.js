'use strict';

var inherit = require('./utils').inherit;
var Facade = require('./facade');

/**
 * Initialize a new `Alias` facade with a `dictionary` of arguments.
 *
 * @param {Object} dictionary - The object to wrap.
 * @param {string} [dictionary.from] - The previous ID of the user.
 * @param {string} [dictionary.to] - The new ID of the user.
 * @param {Object} opts - Options about what kind of Facade to create.
 *
 * @augments Facade
 */
function Alias(dictionary, opts) {
  Facade.call(this, dictionary, opts);
}

inherit(Alias, Facade);

/**
 * Return the type of facade this is. This will always return `"alias"`.
 *
 * @return {string}
 */
Alias.prototype.action = function() {
  return 'alias';
};

/**
 * An alias for {@link Alias#action}.
 *
 * @function
 * @return {string}
 */
Alias.prototype.type = Alias.prototype.action;

/**
 * Get the user's previous ID from `previousId` or `from`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Alias.prototype.previousId = function() {
  return this.field('previousId') || this.field('from');
};

/**
 * An alias for {@link Alias#previousId}.
 *
 * @function
 * @return {string}
 */
Alias.prototype.from = Alias.prototype.previousId;

/**
 * Get the user's new ID from `userId` or `to`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Alias.prototype.userId = function() {
  return this.field('userId') || this.field('to');
};

/**
 * An alias for {@link Alias#userId}.
 *
 * @function
 * @return {string}
 */
Alias.prototype.to = Alias.prototype.userId;

module.exports = Alias;
