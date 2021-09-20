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
const $ = require('jquery');
const { Auth } = require('app/scripts/db/auth');
const { GoldBanner } = require('app/src/components/GoldBanner');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const {
  ReactRootComponent,
} = require('app/scripts/views/internal/react-root-component');
const View = require('app/scripts/views/internal/view');
const recup = require('recup');

const {
  GOLD_RECOMMENDATION,
  GOLD_UPGRADE,
} = require('app/scripts/data/gold-banners');

module.exports = class GoldView extends View {
  initialize() {
    return this.listenTo(Auth.me(), {
      'change:oneTimeMessagesDismissed': this.frameDebounce(this.render),
    });
  }

  getReactRoot() {
    return <ReactRootComponent>{this.getGoldBanner()}</ReactRootComponent>;
  }

  renderReactSection() {
    ReactDOM.render(this.getReactRoot(), this.$reactRoot[0]);
    return this;
  }

  render() {
    if (this.$reactRoot == null) {
      this.$reactRoot = $('<div></div>');
    }
    this.$el.append(this.$reactRoot);
    this.renderReactSection();

    return this;
  }

  getGoldBanner() {
    const { banner, idNuxBannersToDismiss } = this.options;

    const { invitedMemberNames, numCreditMonths, type } = banner;

    const idBannersToDismiss = (idNuxBannersToDismiss || []).concat([type]);

    const onDismissBanner = () => {
      return idBannersToDismiss.forEach((idBannerToDismiss) => {
        return this.model.dismiss(idBannerToDismiss);
      });
    };

    return recup.render(() => {
      if (!Auth.isMe(this.model)) {
        return recup.div();
      }

      if (type === GOLD_UPGRADE && !this.model.isDismissed(GOLD_UPGRADE)) {
        return recup.div(() => {
          return recup.createElement(GoldBanner, {
            hasGold: true,
            onDismissBanner,
          });
        });
      }

      if (
        type === GOLD_RECOMMENDATION &&
        !this.model.isDismissed(GOLD_RECOMMENDATION)
      ) {
        return recup.div(() => {
          return recup.createElement(GoldBanner, {
            hasGold: false,
            invitedMemberNames,
            onDismissBanner,
            creditedMonths: numCreditMonths,
          });
        });
      }

      return recup.div();
    });
  }

  remove() {
    ReactDOM.unmountComponentAtNode(this.$reactRoot[0]);
    return super.remove(...arguments);
  }
};
