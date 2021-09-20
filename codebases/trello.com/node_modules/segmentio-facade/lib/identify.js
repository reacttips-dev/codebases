'use strict';

var Facade = require('./facade');
var get = require('obj-case');
var inherit = require('./utils').inherit;
var isEmail = require('is-email');
var newDate = require('new-date');
var trim = require('trim');
var type = require('./utils').type;

/**
 * Initialize a new `Identify` facade with a `dictionary` of arguments.
 *
 * @param {Object} dictionary - The object to wrap.
 * @param {string} [dictionary.userId] - The ID of the user.
 * @param {string} [dictionary.anonymousId] - The anonymous ID of the user.
 * @param {string} [dictionary.traits] - The user's traits.
 * @param {Object} opts - Options about what kind of Facade to create.
 *
 * @augments Facade
 */
function Identify(dictionary, opts) {
  Facade.call(this, dictionary, opts);
}

inherit(Identify, Facade);

/**
 * Return the type of facade this is. This will always return `"identify"`.
 *
 * @return {string}
 */
Identify.prototype.action = function() {
  return 'identify';
};

/**
 * An alias for {@link Identify#action}.
 *
 * @function
 * @return {string}
 */
Identify.prototype.type = Identify.prototype.action;

/**
 * Get the user's traits. This is identical to how {@link Facade#traits} works,
 * except it looks at `traits.*` instead of `options.traits.*`.
 *
 * Traits are gotten from `traits`, augmented with a property `id` with
 * the event's `userId`.
 *
 * The parameter `aliases` is meant to transform keys in `traits` into new
 * keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx` in
 * the traits, and move it to `yyy`. If `xxx` is a method of this facade, it'll
 * be called as a function instead of treated as a key into the traits.
 *
 * @example
 * var obj = { traits: { foo: "bar" }, anonymousId: "xxx" }
 * var identify = new Identify(obj)
 *
 * identify.traits() // { "foo": "bar" }
 * identify.traits({ "foo": "asdf" }) // { "asdf": "bar" }
 * identify.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
 *
 * @param {Object} aliases - A mapping from keys to the new keys they should be
 * transformed to.
 * @return {Object}
 */
Identify.prototype.traits = function(aliases) {
  var ret = this.field('traits') || {};
  var id = this.userId();
  aliases = aliases || {};

  if (id) ret.id = id;

  for (var alias in aliases) {
    var value = this[alias] == null ? this.proxy('traits.' + alias) : this[alias]();
    if (value == null) continue;
    ret[aliases[alias]] = value;
    if (alias !== aliases[alias]) delete ret[alias];
  }

  return ret;
};

/**
 * Get the user's email from `traits.email`, falling back to `userId` only if
 * it looks like a valid email.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Identify.prototype.email = function() {
  var email = this.proxy('traits.email');
  if (email) return email;

  var userId = this.userId();
  if (isEmail(userId)) return userId;
};

/**
 * Get the time of creation of the user from `traits.created` or
 * `traits.createdAt`.
 *
 * @return {Date}
 */
Identify.prototype.created = function() {
  var created = this.proxy('traits.created') || this.proxy('traits.createdAt');
  if (created) return newDate(created);
};

/**
 * Get the time of creation of the user's company from `traits.company.created`
 * or `traits.company.createdAt`.
 *
 * @return {Date}
 */
Identify.prototype.companyCreated = function() {
  var created = this.proxy('traits.company.created') || this.proxy('traits.company.createdAt');

  if (created) {
    return newDate(created);
  }
};

/**
 * Get the user's company name from `traits.company.name`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Identify.prototype.companyName = function() {
  return this.proxy('traits.company.name');
};

/**
 * Get the user's name `traits.name`, falling back to combining {@link
 * Identify#firstName} and {@link Identify#lastName} if possible.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Identify.prototype.name = function() {
  var name = this.proxy('traits.name');
  if (typeof name === 'string') {
    return trim(name);
  }

  var firstName = this.firstName();
  var lastName = this.lastName();
  if (firstName && lastName) {
    return trim(firstName + ' ' + lastName);
  }
};

/**
 * Get the user's first name from `traits.firstName`, optionally splitting it
 * out of a the full name if that's all that was provided.
 *
 * Splitting the full name works on the assumption that the full name is of the
 * form "FirstName LastName"; it will not work for non-Western names.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Identify.prototype.firstName = function() {
  var firstName = this.proxy('traits.firstName');
  if (typeof firstName === 'string') {
    return trim(firstName);
  }

  var name = this.proxy('traits.name');
  if (typeof name === 'string') {
    return trim(name).split(' ')[0];
  }
};

/**
 * Get the user's last name from `traits.lastName`, optionally splitting it out
 * of a the full name if that's all that was provided.
 *
 * Splitting the full name works on the assumption that the full name is of the
 * form "FirstName LastName"; it will not work for non-Western names.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Identify.prototype.lastName = function() {
  var lastName = this.proxy('traits.lastName');
  if (typeof lastName === 'string') {
    return trim(lastName);
  }

  var name = this.proxy('traits.name');
  if (typeof name !== 'string') {
    return;
  }

  var space = trim(name).indexOf(' ');
  if (space === -1) {
    return;
  }

  return trim(name.substr(space + 1));
};

/**
 * Get the user's "unique id" from `userId`, `traits.username`, or
 * `traits.email`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Identify.prototype.uid = function() {
  return this.userId() || this.username() || this.email();
};

/**
 * Get the user's description from `traits.description` or `traits.background`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Identify.prototype.description = function() {
  return this.proxy('traits.description') || this.proxy('traits.background');
};

/**
 * Get the user's age from `traits.age`, falling back to computing it from
 * `traits.birthday` and the current time.
 *
 * @return {number}
 */
Identify.prototype.age = function() {
  var date = this.birthday();
  var age = get(this.traits(), 'age');
  if (age != null) return age;
  if (type(date) !== 'date') return;
  var now = new Date();
  return now.getFullYear() - date.getFullYear();
};

/**
 * Get the URL of the user's avatar from `traits.avatar`, `traits.photoUrl`, or
 * `traits.avatarUrl`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Identify.prototype.avatar = function() {
  var traits = this.traits();
  return get(traits, 'avatar') || get(traits, 'photoUrl') || get(traits, 'avatarUrl');
};

/**
 * Get the user's job position from `traits.position` or `traits.jobTitle`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
Identify.prototype.position = function() {
  var traits = this.traits();
  return get(traits, 'position') || get(traits, 'jobTitle');
};

/**
 * Get the user's username from `traits.username`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
Identify.prototype.username = Facade.proxy('traits.username');

/**
 * Get the user's website from `traits.website`, or if there are multiple in
 * `traits.websites`, return the first one.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
Identify.prototype.website = Facade.one('traits.website');

/**
 * Get the user's websites from `traits.websites`, or if there is only one in
 * `traits.website`, then wrap it in an array.
 *
 * This *should* be an array of strings, but may not be if the client isn't
 * adhering to the spec.
 *
 * @function
 * @return {array}
 */
Identify.prototype.websites = Facade.multi('traits.website');

/**
 * Get the user's phone number from `traits.phone`, or if there are multiple in
 * `traits.phones`, return the first one.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
Identify.prototype.phone = Facade.one('traits.phone');

/**
 * Get the user's phone numbers from `traits.phones`, or if there is only one
 * in `traits.phone`, then wrap it in an array.
 *
 * This *should* be an array of strings, but may not be if the client isn't
 * adhering to the spec.
 *
 * @function
 * @return {array}
 */
Identify.prototype.phones = Facade.multi('traits.phone');

/**
 * Get the user's address from `traits.address`.
 *
 * This *should* be an object, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {object}
 */
Identify.prototype.address = Facade.proxy('traits.address');

/**
 * Get the user's gender from `traits.gender`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
Identify.prototype.gender = Facade.proxy('traits.gender');

/**
 * Get the user's birthday from `traits.birthday`.
 *
 * This *should* be a Date if `opts.traverse` was enabled (it is by default)
 * when constructing this Identify. Otherwise, it should be a string. But it
 * may be neither if the client isn't adhering to the spec.
 * spec.
 *
 * @function
 * @return {object}
 */
Identify.prototype.birthday = Facade.proxy('traits.birthday');

module.exports = Identify;
