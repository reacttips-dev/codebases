/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NewLocaleBannerView;
const assert = require('app/scripts/lib/assert');
const WarningBannerView = require('app/scripts/views/header/warning-banner-view');
const t = require('app/scripts/views/internal/teacup-with-helpers')();
const locales = require('@trello/locale').supportedLocales;
const _ = require('underscore');
const locale = require('locale');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');

module.exports = NewLocaleBannerView = (function () {
  NewLocaleBannerView = class NewLocaleBannerView extends WarningBannerView {
    static initClass() {
      this.prototype.events = {
        'click .js-switch-language'() {
          Analytics.sendTrackEvent({
            action: 'set',
            actionSubject: 'locale',
            source: 'newLocaleBanner',
            attributes: {
              newLocale: this.locale,
            },
          });
          return this.setLocale();
        },
        'click .js-dismiss'() {
          Analytics.sendDismissedComponentEvent({
            componentType: 'banner',
            componentName: 'newLocaleBanner',
            source: getScreenFromUrl(),
            attributes: {
              newLocale: this.locale,
            },
          });
          return this.dismiss(function () {});
        },
      };
    }
    initialize({ locale }) {
      this.locale = locale;
    }

    setLocale() {
      return this.model.setPref('locale', this.locale, () => {
        return this.dismiss(() => {
          return document.location.reload();
        });
      });
    }

    dismiss(next) {
      return this.model.dismissLanguageBannerFor(this.locale, () => {
        this.remove();
        return next();
      });
    }

    render() {
      // We have to translate the locale from a browser locale to a transifex
      // locale.
      const translationsLocale = this.locale.replace(/-/, '_');
      let matchingLocale = null;

      if (locale[`banners.${this.locale}.mainText`] != null) {
        matchingLocale = this.locale;
      } else if (locale[`banners.${translationsLocale}.mainText`] != null) {
        matchingLocale = translationsLocale;
      } else if (
        locale[
          `banners.${translationsLocale.substr(
            0,
            translationsLocale.indexOf('_'),
          )}.mainText`
        ] != null
      ) {
        matchingLocale = translationsLocale.substr(
          0,
          translationsLocale.indexOf('_'),
        );
      }

      assert(
        matchingLocale != null,
        'Attempt to show a NewLocaleBanner with an unrecognized locale',
      );
      const language = _.find(locales, (locale) => locale.code === this.locale);
      assert(
        language != null,
        'Attempt to show a NewLocaleBanner with an unrecognized language',
      );

      Analytics.sendViewedBannerEvent({
        bannerName: 'newLocaleBanner',
        source: getScreenFromUrl(),
        attributes: {
          newLocale: this.locale,
        },
      });

      this.$el.html(
        t.render(function () {
          t.text(
            locale[`banners.${matchingLocale}.mainText`].replace(
              '{language}',
              language.name,
            ),
          );
          t.text(' ');
          t.a(
            { href: '#', class: 'quiet primary js-switch-language' },
            locale[`banners.${matchingLocale}.switchText`],
          );
          t.text(' - ');
          return t.a(
            { href: '#', class: 'quiet js-dismiss' },
            locale[`banners.${matchingLocale}.dismissText`],
          );
        }),
      );
      return this;
    }
  };
  NewLocaleBannerView.initClass();
  return NewLocaleBannerView;
})();
