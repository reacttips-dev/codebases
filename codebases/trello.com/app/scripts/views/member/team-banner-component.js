// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'team_banners',
);
const { Analytics } = require('@trello/atlassian-analytics');
const _ = require('underscore');

const {
  ORG_TYPE_ENTERPRISE,
  ORG_TYPE_BUSINESS_CLASS,
} = require('app/scripts/data/org-types');

class TeamBannerComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'TeamBanner';

    this.prototype.componentDidMount = function () {
      if (this.props.bannerViewedEvent) {
        Analytics.sendViewedBannerEvent(this.props.bannerViewedEvent);
      }
    };

    this.prototype.render = t.renderable(function () {
      const {
        heading,
        isUpgrade,
        onDismissBanner,
        orgDisplayName,
        orgType,
        subheading,
        teamheading,
        tips,
      } = this.props;

      const isBusinessClassOrg = orgType === ORG_TYPE_BUSINESS_CLASS;
      const isEnterpriseOrg = orgType === ORG_TYPE_ENTERPRISE;

      const sectionClass = (() => {
        switch (true) {
          case isEnterpriseOrg:
            return '.team-banner-section-ent';
          case isBusinessClassOrg:
            return '.team-banner-section-bc';
          default:
            return '.team-banner-section';
        }
      })();

      const headingUrl = isEnterpriseOrg
        ? require('resources/images/enterprise-logo-white.svg')
        : isBusinessClassOrg
        ? require('resources/images/business-class-logo-white.svg')
        : null;

      let contentClass = '.team-banner-content';
      if (isUpgrade) {
        contentClass += '.team-banner-content-upgraded-org';
      }

      return t.div('.team-banner', () => {
        t.button('.icon-lg.icon-close', { onClick: onDismissBanner });
        return t.div(sectionClass, () => {
          return t.div(contentClass, () => {
            t.div('.team-banner-welcome-section', () => {
              t.h1('.team-banner-welcome-heading', () => {
                return t.format(heading, { url: headingUrl });
              });
              return t.p('.team-banner-welcome-subheading', () => {
                if (teamheading && orgDisplayName) {
                  t.format(teamheading, { team_name: orgDisplayName });
                  t.raw('<br/>');
                }
                return t.format(subheading);
              });
            });
            return t.ol('.team-banner-tip-list', () => {
              return _.map(tips, (tip, i) => {
                return t.li('.team-banner-tip-list-item', () => {
                  t.span(
                    '.team-banner-tip-list-item-index',
                    { 'aria-hidden': true },
                    () => {
                      return t.text(i + 1);
                    },
                  );
                  return t.span('.team-banner-tip-list-item-text', () => {
                    if (tip.imgSrc) {
                      t.format(tip.key);
                      return t.a(
                        {
                          href: tip.url,
                          target: '_blank',
                        },
                        () => {
                          return t.img(
                            '.team-banner-tip-list-app-download-button',
                            {
                              alt: t.l(tip.imgAlt),
                              src: tip.imgSrc,
                            },
                          );
                        },
                      );
                    } else if (tip.url) {
                      return t.format(tip.key, { url: tip.url });
                    } else {
                      return t.format(tip.key);
                    }
                  });
                });
              });
            });
          });
        });
      });
    });
  }
}
TeamBannerComponent.initClass();

module.exports = TeamBannerComponent;
