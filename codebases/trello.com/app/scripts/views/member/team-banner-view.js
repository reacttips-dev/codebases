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
const Browser = require('@trello/browser');
const TeamBannerComponent = require('app/scripts/views/member/team-banner-component');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const {
  ReactRootComponent,
} = require('app/scripts/views/internal/react-root-component');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const recup = require('recup');

const TIP_ANDROID = {
  key: 'tip-download app',
  url: 'https://play.google.com/store/apps/details?id=com.trello',
  imgAlt: 'tip-google play',
  imgSrc: require('resources/images/buttons/btn-playstore.png'),
};
const TIP_IOS = {
  key: 'tip-download app',
  url: 'https://itunes.apple.com/app/trello-organize-anything/id461504587',
  imgAlt: 'tip-app store',
  imgSrc: require('resources/images/buttons/btn-appstore.png'),
};

module.exports = class TeamBannerView extends View {
  initialize() {
    return this.listenTo(Auth.me(), {
      'change:oneTimeMessagesDismissed': this.frameDebounce(this.render),
    });
  }

  getReactRoot() {
    return <ReactRootComponent>{this.getTeamBanner()}</ReactRootComponent>;
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

  getTeamBanner() {
    const { bannerToDisplay, idBannersToDismiss } = this.options;

    const dismissBanners = () => {
      return idBannersToDismiss.forEach((idBanner) =>
        this.model.dismiss(idBanner),
      );
    };

    const isAndroid = Browser.isAndroid();
    const isIos = Browser.isIos();

    const lastTipsIndex = bannerToDisplay.tips.length - 1;

    if (isAndroid) {
      bannerToDisplay.tips[lastTipsIndex] = TIP_ANDROID;
    } else if (isIos) {
      bannerToDisplay.tips[lastTipsIndex] = TIP_IOS;
    }

    return recup.render(() =>
      recup.div(() => {
        return recup.createElement(
          TeamBannerComponent,
          _.extend(
            {
              onDismissBanner: dismissBanners,
            },
            bannerToDisplay,
          ),
        );
      }),
    );
  }

  remove() {
    ReactDOM.unmountComponentAtNode(this.$reactRoot[0]);
    return super.remove(...arguments);
  }
};
