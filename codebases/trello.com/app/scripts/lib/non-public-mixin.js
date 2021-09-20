/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
module.exports.NonPublicMixin = {
  // Key on the attributes that the nonPublic attributes reside in
  nonPublicKey: 'nonPublic',

  // ===========================
  // Private helper methods
  // ===========================

  // Let's make sure the nonPublicFields field is set
  _isNonPublicFieldsSet() {
    if (this.nonPublicFields == null) {
      console.warn('Using NonPublicMixin without a nonPublicFields mapping');
    }
    return this.nonPublicFields != null;
  },

  // Mixins can't access the super class so find it on the class constructor
  _superMethod(method, ...args) {
    return this.constructor.__super__[method].apply(this, args);
  },

  // ===========================
  // Overriding methods
  // ===========================

  // Override the get method on the model.
  // Return the nonPublic version of the attribute if it exists.
  get(attr, isOverrideEnabled) {
    if (isOverrideEnabled == null) {
      isOverrideEnabled = true;
    }
    if (
      isOverrideEnabled &&
      this._isNonPublicFieldsSet() &&
      Array.from(this.nonPublicFields).includes(attr)
    ) {
      let left, value;
      const nonPublicValues =
        (left = this._superMethod('get', this.nonPublicKey)) != null
          ? left
          : [];
      if ((value = nonPublicValues[attr]) != null) {
        return value;
      }
    }

    return this._superMethod('get', attr);
  },

  // ===========================
  // Class instance helper methods
  // ===========================

  // Take a data model and replace its fields with the nonPublic
  // equivalent, the nonPublic fields will either be looked for on the
  // data provided, or strictly in the nonPublicFields array passed in as
  // the third argument.
  handleNonPublicFields(data, fields, nonPublicFields) {
    if (fields == null) {
      fields = [];
    }
    if (nonPublicFields == null) {
      nonPublicFields = [];
    }
    if (fields.length === 0) {
      fields = this.nonPublicFields;
    }

    if (nonPublicFields.length === 0 && data[this.nonPublicKey] != null) {
      nonPublicFields = data[this.nonPublicKey];
    }

    fields.forEach(function (field) {
      let value;
      if ((value = nonPublicFields[field]) != null) {
        return (data[field] = value);
      }
    });

    return data;
  },
};
