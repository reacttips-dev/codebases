import SSView from 'core/src/views/base/ss-view';
import FormHelpers from 'core/src/helpers/form-helpers';
import template from 'text!core/src/templates/modules/inline-editable.html';

const InlineEditable = SSView.extend({

  template: template,

  events: {
    'click.inline-editable .submit-btn': 'done',
    'click.inline-editable .cancel-btn': 'cancel',
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, 'parentModel', 'parentView', 'editable'));
    this.model = new Backbone.Model(this.parentModel.attributes);

    SSView.prototype.initialize.call(this, options);
  },

  render: function() {
    SSView.prototype.render.call(this);
    this._transformElements();
    FormHelpers.renderForm(this.parentView.$el);
    this.stickit();
  },

  // Takes the non-editable elements, and transforms
  // them into inline editable elements.
  _transformElements: function() {
    _.each(this.editable, function(selector, attribute) {
      let node = 'input';
      let domAttributes = {
        type: 'text',
      };
      let editableSelector = selector;

      // If you pass in an object as the value, then we will try to convert
      // domAttributes and the node type based on the key-values.
      if (!_.isString(editableSelector)) {
        // Everything is a domAttribute expect the `selector` key.
        domAttributes = _.defaults(_.omit(editableSelector, 'selector'), domAttributes);

        // To support textareas (which aren't an `<input />`, change the node
        // type and remove the type domAttribute.
        if (editableSelector.type === 'textarea') {
          node = editableSelector.type;
          delete domAttributes.type;
        }

        // Update the selector to be the true selector.
        editableSelector = editableSelector.selector;
      }

      const $editable = this._transformElement(
        editableSelector,
        node,
        domAttributes,
        this.model.get(attribute)
      );
      this._addBinding($editable, attribute);
    }, this);
  },

  // Replaces elements found by selector with the specified node.
  _transformElement: function(selector, node, domAttributes, value) {
    const $el = this.parentView.$(selector);
    const $editable = $('<' + node + '/>').attr(domAttributes)
      .val(value);
    $el.replaceWith($editable);
    return $editable;
  },

  _addBinding: function($editable, attribute) {
    if (!this.bindings) {
      this.bindings = {};
    }

    // Add a unique classname, so stickit can bind.
    const className = _.uniqueId('inline-editable');
    $editable.addClass(className);
    this.bindings['.' + className] = attribute;
  },

  stickit: function() {
    // Swap this.$el with parentView's, so stickit will be between _this_ view
    // and the model.
    const { $el } = this;
    this.$el = this.parentView.$el;

    SSView.prototype.stickit.apply(this, arguments);

    // Put $el back
    this.$el = $el;
  },

  unstickit: function() {
    // Swap this.$el with parentView's, so unstickit will be between _this_ view
    // and the model.
    const { $el } = this;
    this.$el = this.parentView.$el;

    SSView.prototype.unstickit.apply(this, arguments);

    // Put $el back
    this.$el = $el;
  },

  done: function() {
    const attrs = _.pick(this.model.attributes, _.keys(this.editable));
    this.parentModel.set(attrs);
    this.cleanup();
    this.trigger('done');
  },

  cancel: function() {
    this.cleanup();
    this.trigger('cancel');
  },

  cleanup: function() {
    this.unstickit(this.model);
    this.parentView.$el.off('.inline-editable');
  },
});

export default InlineEditable;


