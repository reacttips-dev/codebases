/* eslint-disable
    @typescript-eslint/no-this-alias,
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { PopOver } = require('app/scripts/views/lib/pop-over');
const template = require('app/scripts/views/templates/popover_set_list_limit');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const { Analytics } = require('@trello/atlassian-analytics');

const WIP_LOWER_LIMIT = 0;
const WIP_UPPER_LIMIT = 5000;

const isValidListLimit = (value) =>
  value === null ||
  (!isNaN(value) && value >= WIP_LOWER_LIMIT && value <= WIP_UPPER_LIMIT);

class ListMoveView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'set list limit';

    this.prototype.tagName = 'form';

    this.prototype.events = {
      'click .js-submit': 'submit',
      submit: 'submit',
      'click .js-remove-limit': 'removeLimit',
      'keyup .js-list-limit-input': 'limitChanged',
    };
  }

  initialize() {
    Analytics.sendScreenEvent({
      name: 'listLimitInlineDialog',
      containers: {
        list: {
          id: this.model.id,
        },
        board: {
          id: this.model.getBoard()?.id,
        },
        organization: {
          id: this.model.getBoard()?.getOrganization()?.id,
        },
      },
    });
  }

  getValue() {
    const valueString = this.$('.js-list-limit-input').val();

    if (!valueString.length) {
      return null;
    }

    return parseInt(valueString, 10);
  }

  limitChanged(e) {
    const value = this.getValue();
    const isValid = isValidListLimit(value);

    this.$('.js-list-limit-input').toggleClass('is-invalid', !isValid);
    return this.$('.js-submit').attr('disabled', !isValid);
  }

  submit(e) {
    Util.stop(e);

    const value = this.getValue();

    if (isValidListLimit(value)) {
      Analytics.sendTrackEvent({
        action: 'updated',
        actionSubject: 'listLimit',
        source: 'listLimitInlineDialog',
        attributes: {
          value,
        },
        containers: {
          list: {
            id: this.model.id,
          },
          board: {
            id: this.model.getBoard()?.id,
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id,
          },
        },
      });

      this.model.setSoftLimit(value);
      return PopOver.hide();
    }
  }

  removeLimit(e) {
    Util.stop(e);

    Analytics.sendTrackEvent({
      action: 'removed',
      actionSubject: 'listLimit',
      source: 'listLimitInlineDialog',
      containers: {
        list: {
          id: this.model.id,
        },
        board: {
          id: this.model.getBoard()?.id,
        },
        organization: {
          id: this.model.getBoard()?.getOrganization()?.id,
        },
      },
    });

    this.model.setSoftLimit(null);
    return PopOver.hide();
  }

  render() {
    const view = this;
    const { model } = view;

    const data = { limit: model.get('softLimit') };

    this.$el.html(template(data));

    return this;
  }
}

ListMoveView.initClass();
module.exports = ListMoveView;
