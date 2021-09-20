// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  getSeparatorClassName,
} = require('app/scripts/views/card/SeparatorCard/SeparatorCard');
const pluginsChangedSignal = require('app/scripts/views/internal/plugins/plugins-changed-signal');
const {
  sendPluginUIEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_aging',
);
const View = require('app/scripts/views/internal/view');

const { LegacyPowerUps } = require('app/scripts/data/legacy-power-ups');
const CARD_AGING_POWER_UP_ID = LegacyPowerUps.cardAging;

const template = t.renderable(({ evergreen }) =>
  t.ul('.pop-over-list', () =>
    t.li(() =>
      t.a('.js-toggle-ignore', { href: '#' }, function () {
        t.span('.name', function () {
          t.format('evergreen');
          if (evergreen) {
            return t.icon('check');
          }
        });
        return t.span('.sub-name', () => t.format('evergreen cards'));
      }),
    ),
  ),
);

class CardAgingPopoverView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'card aging';

    this.prototype.events = { 'click .js-toggle-ignore': 'toggleIgnore' };
  }

  initialize() {
    this.getEvergreenData();
    return this.subscribe(
      pluginsChangedSignal(this.model.getBoard(), this.model),
      () => {
        return this.render();
      },
    );
  }

  getEvergreenData() {
    return (this.evergreen = this.model.getPluginDataByKey(
      CARD_AGING_POWER_UP_ID,
      'shared',
      'evergreen',
      false,
    ));
  }

  toggleIgnore() {
    this.model.setPluginDataByKey(
      CARD_AGING_POWER_UP_ID,
      'shared',
      'evergreen',
      !this.evergreen,
    );
    sendPluginUIEvent({
      idPlugin: CARD_AGING_POWER_UP_ID,
      idBoard: this.model.getBoard().id,
      idCard: this.model.id,
      event: {
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'cardAgingEvergreenButton',
        attributes: {
          isEvergreenAfterClick: this.evergreen,
          isTemplate: this.model.get('isTemplate'),
          separatorType: getSeparatorClassName(this.model.get('name')),
        },
        source: 'cardDetailScreen',
      },
    });
    return this.render();
  }

  render() {
    this.getEvergreenData();
    this.$el.html(template({ evergreen: this.evergreen }));
    return this;
  }
}

CardAgingPopoverView.initClass();
module.exports = CardAgingPopoverView;
