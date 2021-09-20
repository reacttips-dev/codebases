// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let BrowserWillBeUnsupportedView;
const Browser = require('@trello/browser');
const WarningBannerView = require('app/scripts/views/header/warning-banner-view');
const { TrelloStorage } = require('@trello/storage');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'browser_will_be_unsupported',
);
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');

const LAST_DISMISSED_STORAGE_KEY = 'unsupportedBrowserBannerLastDismissed';

const template = t.renderable(function () {
  t.p('.u-bottom.js-message', function () {
    switch (Browser.browserStr) {
      case 'explorer':
        t.format('trello-is-ending-support-for-ie');
        t.text(' ');
        return t.format('please-use-edge-or-the-desktop-client', {
          edge:
            'https://support.microsoft.com/en-us/help/12435/windows-10-upgrade-faq',
          desktop: 'https://trello.com/platforms',
        });

      case 'safari':
        t.format('this-version-of-safari-is-not-supported');
        t.text(' ');
        return t.format('please-upgrade-to-a-supported-version', {
          url: 'https://support.apple.com/downloads/safari',
        });

      case 'chrome':
        t.format('this-version-of-chrome-is-not-supported');
        t.text(' ');
        return t.format('please-upgrade-to-a-supported-version', {
          url: 'https://www.google.com/chrome',
        });

      case 'edge':
        t.format('this-version-of-edge-is-not-supported');
        t.text(' ');
        return t.format('please-upgrade-to-a-supported-version', {
          url: 'https://www.microsoft.com/en-us/windows/microsoft-edge',
        });

      case 'firefox':
        t.format('this-version-of-firefox-is-not-supported');
        t.text(' ');
        return t.format('please-upgrade-to-a-supported-version', {
          url: 'https://www.firefox.com/',
        });

      default:
        // They're using a browser we don't recognize e.g. Vivaldi
        t.format('this-browser-is-not-supported');
        t.text(' ');
        return t.format(
          'you-may-need-to-upgrade-or-switch-to-a-supported-browser',
        );
    }
  });

  return t.a('.icon-lg.icon-close.js-close-banner', { href: '#' });
});

module.exports = BrowserWillBeUnsupportedView = (function () {
  BrowserWillBeUnsupportedView = class BrowserWillBeUnsupportedView extends (
    WarningBannerView
  ) {
    static initClass() {
      this.prototype.className =
        'header-banner mod-warning unsupported-browser-banner';

      this.prototype.events = {
        'click .js-message > a'(e) {
          return Analytics.sendClickedLinkEvent({
            linkName: 'upgradeBrowserLink',
            source: 'browserWillBeUnsupportedBanner',
            attributes: {
              browserVersion: Browser.browserVersionStr,
            },
          });
        },

        'click .js-close-banner'(e) {
          Analytics.sendDismissedComponentEvent({
            componentType: 'banner',
            componentName: 'browserWillBeUnsupportedBanner',
            source: getScreenFromUrl(),
            attributes: {
              browserVersion: Browser.browserVersionStr,
            },
          });
          const now = new Date().toISOString();
          TrelloStorage.set(LAST_DISMISSED_STORAGE_KEY, now);
          return this.render();
        },
      };
    }

    render() {
      let isHidden;
      const lastDismissed = TrelloStorage.get(LAST_DISMISSED_STORAGE_KEY);

      if (lastDismissed) {
        // Hide the banner if it was dismissed less than a week ago
        const now = new Date();
        const dateLastDismissed = new Date(lastDismissed);
        isHidden = now - dateLastDismissed < 7 * 24 * 60 * 60 * 1000;
      } else {
        isHidden = false;
      }

      if (!isHidden) {
        Analytics.sendViewedBannerEvent({
          bannerName: 'browserWillBeUnsupportedBanner',
          source: getScreenFromUrl(),
          attributes: {
            browserVersion: Browser.browserVersionStr,
          },
        });
      }

      this.$el.toggleClass('hide', isHidden);
      this.$el.html(template());
      return this;
    }
  };
  BrowserWillBeUnsupportedView.initClass();
  return BrowserWillBeUnsupportedView;
})();
