/* eslint-disable
    default-case,
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let TemplateBannerView;
const { Auth } = require('app/scripts/db/auth');
const CopyBoardView = require('app/scripts/views/board/copy-board-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const React = require('react');
const template = require('app/scripts/views/templates/template_banner');
const { Util } = require('app/scripts/lib/util');
const WarningBannerView = require('app/scripts/views/header/warning-banner-view');
const {
  ShareTemplatePopover,
} = require('app/src/components/ShareTemplatePopover');
const { siteDomain } = require('@trello/config');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');
const { l } = require('app/scripts/lib/localize');

module.exports = TemplateBannerView = (function () {
  TemplateBannerView = class TemplateBannerView extends WarningBannerView {
    static initClass() {
      this.prototype.className = 'header-banner mod-warning template-banner';

      this.prototype.events = {
        'click .js-share-template': 'shareTemplate',
        'click .js-copy-template': 'copyTemplate',
      };
    }

    initialize() {
      super.initialize(...arguments);

      this.makeDebouncedMethods('render');
      return this.listenTo(this.model, {
        'change:closed': this.renderDebounced,
        'change:prefs.isTemplate': this.renderDebounced,
        'change:prefs.permissionLevel': this.renderDebounced,
        'change:idOrganization': this.renderDebounced,
      });
    }

    copyTemplate(e) {
      Util.stop(e);
      Analytics.sendClickedButtonEvent({
        buttonName: 'createBoardFromTemplateButton',
        source: 'boardScreen',
        containers: {
          board: {
            id: this.model.id,
          },
        },
      });

      return PopOver.toggle({
        elem: this.$(e.target).closest('.js-copy-template'),
        view: new CopyBoardView({
          model: this.model,
          modelCache: this.modelCache,
          boardNameInputValue: this.model.get('name'),
          gasSource: 'createBoardFromTemplateInlineDialog',
        }),
      });
    }

    shareTemplate(e) {
      let storyPageUrl;
      Util.stop(e);
      Analytics.sendClickedLinkEvent({
        linkName: 'shareTemplateLink',
        source: 'boardScreen',
        container: {
          board: {
            id: this.model.id,
          },
          organization: {
            id: this.model.get('idOrganization'),
          },
        },
      });

      this.reactRoot = this.$('.js-share-template')[0];

      const templateCategory = __guard__(
        this.model.get('templateGallery'),
        (x1) => x1.category,
      );
      if (templateCategory) {
        storyPageUrl = `${siteDomain}/templates/${templateCategory}/${Util.makeSlug(
          this.model.get('name'),
        )}-${this.model.get('shortLink')}`;
      }

      const props = {
        key: 'ShareTemplatePopover',
        name: this.model.get('name'),
        orgName: __guard__(this.model.getOrganization(), (x2) =>
          x2.get('displayName'),
        ),
        enterpriseName: __guard__(
          __guard__(this.model.getOrganization(), (x4) => x4.getEnterprise()),
          (x3) => x3.get('displayName'),
        ),
        url: this.model.get('url'),
        storyPageUrl,
        visibility: this.model.getPermLevel(),
        boardId: this.model.id,
        teamId: __guard__(this.model.getOrganization(), (x5) => x5.id),
        isTemplate: this.model.isTemplate(),
        username: Auth.me().get('username'),
      };
      return PopOver.toggle({
        reactElement: <ShareTemplatePopover {...props} />,
        elem: this.reactRoot,
        getViewTitle() {
          return l(['view title', 'share template']);
        },
      });
    }

    getTeamName() {
      switch (this.model.getPermLevel()) {
        case 'enterprise':
          return __guard__(this.model.getEnterprise(), (x) =>
            x.get('displayName'),
          );
        case 'org':
          return __guard__(this.model.getOrganization(), (x1) =>
            x1.get('displayName'),
          );
      }
    }

    render() {
      const isVisible =
        this.model.isTemplate() &&
        !(this.model != null ? this.model.get('closed') : undefined);
      const returnUrl = encodeURIComponent(window.location.pathname);

      if (isVisible) {
        Analytics.sendViewedBannerEvent({
          bannerName: 'templateBoardBanner',
          source: getScreenFromUrl(),
          containers: {
            board: {
              id: this.model.id,
            },
          },
        });
      }

      this.$el.toggleClass('hide', !isVisible);
      this.$el.html(
        template({
          isVisible,
          isPrivate: this.model.getPermLevel() === 'private',
          isPublic: this.model.getPermLevel() === 'public',
          isLoggedIn: Auth.isLoggedIn(),
          teamName: this.getTeamName(),
          returnUrl: `/signup?returnUrl=${returnUrl}`,
        }),
      );
      return this;
    }
  };
  TemplateBannerView.initClass();
  return TemplateBannerView;
})();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
