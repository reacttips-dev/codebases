/* eslint-disable
    eqeqeq,
    */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Label } = require('app/scripts/models/label');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { l } = require('app/scripts/lib/localize');

class LabelEditComponent extends View {
  static initClass() {
    this.prototype.tagName = 'form';
    this.prototype.className = 'edit-label';
    this.prototype.events = {
      'click .js-palette-color': 'pickColor',
      'click .js-submit': 'submit',
      submit: 'submit',
    };
  }

  initialize({ accessoryView, color, onSubmit, submitTextKey }) {
    this.accessoryView = accessoryView;
    this.color = color;
    this.onSubmit = onSubmit;
    this.submitTextKey = submitTextKey;
    return super.initialize(...arguments);
  }

  renderOnce() {
    let color;
    const colors = (() => {
      const result = [];
      for (color of Array.from(Label.colors)) {
        result.push({ color, selected: color === this.color });
      }
      return result;
    })();
    const data = { label: { name: this.model.name }, colors };
    data.submitText = l(this.submitTextKey);
    data.noColor = this.color === null;
    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/label_edit_component'),
        data,
      ),
    );

    if (this.accessoryView != null) {
      this.$('.js-accessory-view-holder').append(
        this.accessoryView.render().el,
      );
    }

    return this;
  }

  pickColor(e) {
    Util.stop(e);
    this.$('.js-palette-select').hide();
    const $color = this.$(e.target).closest('.js-palette-color');
    this.color = $color.attr('data-color');
    return $color.find('.js-palette-select').show();
  }

  submit(e) {
    Util.stop(e);
    const name = this.$('.js-label-name').val().trim();
    if (_.isEmpty(name) && _.isEmpty(this.color)) {
      return;
    } else {
      return this.onSubmit(name, _.isEmpty(this.color) ? null : this.color);
    }
  }
}

LabelEditComponent.initClass();
module.exports = LabelEditComponent;
