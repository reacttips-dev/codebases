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
const { importWithRetry } = require('@trello/use-lazy-component');

const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const { Auth } = require('app/scripts/db/auth');
const View = require('app/scripts/views/internal/view');
const { sendErrorEvent } = require('@trello/error-reporting');
const { Feature } = require('app/scripts/debug/constants');

const { renderComponent } = require('app/src/components/ComponentWrapper');

module.exports = class FreeTrialBanner extends View {
  initialize() {
    return this.loadBannerPromise != null
      ? this.loadBannerPromise
      : (this.loadBannerPromise = importWithRetry(() =>
          import(
            /* webpackChunkName: "free-trial-banner" */ 'app/src/components/FreeTrial'
          ),
        ).then((module) => {
          try {
            this.FreeTrialBanner = module.FreeTrialBanner;
            return this.render();
          } catch (err) {
            return sendErrorEvent(err, {
              tags: {
                ownershipArea: 'trello-bizteam',
                feature: Feature.FreeTrialExistingTeam,
              },
              extraData: {
                component: 'free-trial-banner',
              },
            });
          }
        }));
  }

  render() {
    if (!this.FreeTrialBanner) {
      return this;
    }

    const me = Auth.me();
    const props = {};

    if (this.model.typeName === 'Member') {
      const url = window.location.pathname;
      const org = this.model.organizationList.models.find(function (orgModel) {
        // Show banner in any route that follows this path /{teamName}/*
        const orgUrl = `/${orgModel.get('name')}/`;
        return url.includes(orgUrl);
      });

      if (org) {
        props.orgId = org.id;
      }
    }

    if (this.model.typeName === 'Organization') {
      props.orgId = this.model.id;
    }

    if (
      this.model.typeName === 'Board' &&
      !this.model.isGuest(me) &&
      this.model.isMember(me)
    ) {
      props.orgId = this.model.get('idOrganization');
    }

    if (!props.orgId) {
      return this;
    }

    const banner = React.createElement(this.FreeTrialBanner, props);
    renderComponent(banner, this.el);
    return this;
  }

  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    return super.remove(...arguments);
  }
};
