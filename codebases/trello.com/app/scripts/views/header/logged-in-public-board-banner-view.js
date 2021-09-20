/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let LoggedInPublicBoardBannerView;
const { Auth } = require('app/scripts/db/auth');
const { campaigns } = require('app/scripts/data/marketing-campaign-boards');
const CopyBoardView = require('app/scripts/views/board/copy-board-view');
const { getKey, Key } = require('@trello/keybindings');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const template = require('app/scripts/views/templates/logged_in_public_board_banner');
const { Util } = require('app/scripts/lib/util');
const WarningBannerView = require('app/scripts/views/header/warning-banner-view');
const { Analytics } = require('@trello/atlassian-analytics');

module.exports = LoggedInPublicBoardBannerView = (function () {
  LoggedInPublicBoardBannerView = class LoggedInPublicBoardBannerView extends (
    WarningBannerView
  ) {
    static initClass() {
      this.prototype.events = {
        keydown: 'keydownEvent',
        'click .js-close-banner': 'dismiss',
        'click .js-learn-more': 'trackHelp',
        'click .js-copy-board': 'copyBoard',
      };
    }
    className() {
      const trelloForTeams = Array.from(campaigns.TRELLO_FOR_TEAMS).includes(
        this.model.id,
      )
        ? 'trello-for-teams'
        : '';
      return `header-banner mod-warning logged-in-public-board-banner ${trelloForTeams}`;
    }

    initialize() {
      super.initialize(...arguments);

      this.isHidden = false;

      this.makeDebouncedMethods('render');
      this.listenTo(this.model, {
        'change:closed': this.renderDebounced,
        'change:prefs.permissionLevel': this.renderDebounced,
        'change:prefs.isTemplate': this.renderDebounced,
      });
    }

    dismissalKey() {
      return `logged-in-public-board-${this.model.get('id')}`;
    }

    dismiss() {
      this.isHidden = true;
      __guard__(Auth.me(), (x) => x.dismissAd(this.dismissalKey()));
      this.render();

      return Analytics.sendDismissedComponentEvent({
        componentType: 'banner',
        componentName: 'loggedInPublicBoardBanner',
        source: 'boardScreen',
        containers: {
          board: {
            id: this.model.id,
          },
        },
      });
    }

    isDismissed() {
      return __guard__(Auth.me(), (x) => x.isAdDismissed(this.dismissalKey()));
    }

    trackHelp() {
      return Analytics.sendClickedLinkEvent({
        linkName: 'learnMoreLink',
        source: 'loggedInPublicBoardBanner',
        containers: {
          board: {
            id: this.model.id,
          },
        },
      });
    }

    keydownEvent(e) {
      const key = getKey(e);

      if (key === Key.Enter) {
        if (this.$(e.target).hasClass('js-learn-more')) {
          this.trackHelp();
        }

        this.$('.js-learn-more');
        return;
      }
    }

    copyBoard(e) {
      Util.stop(e);
      const boardNameInputValue = this.model.isTemplate()
        ? this.model.get('name')
        : undefined;

      Analytics.sendClickedButtonEvent({
        buttonName: 'copyBoardButton',
        source: 'loggedInPublicBoardBanner',
        containers: {
          board: {
            id: this.model.id,
          },
        },
      });

      return PopOver.toggle({
        elem: this.$(e.target).closest('.js-copy-board'),
        view: new CopyBoardView({
          model: this.model,
          modelCache: this.modelCache,
          boardNameInputValue,
        }),
      });
    }

    render() {
      // Hide the public board banner on templates, as templates have their own banner
      const isTemplate = this.model.isTemplate();
      const isVisible =
        !this.isHidden &&
        !this.isDismissed() &&
        (this.model != null ? this.model.isPublic() : undefined) &&
        !(this.model != null ? this.model.get('closed') : undefined) &&
        !isTemplate;
      if (isVisible) {
        Analytics.sendViewedBannerEvent({
          bannerName: 'loggedInPublicBoardBanner',
          containers: {
            board: {
              id: this.model.id,
            },
          },
          source: 'boardScreen',
        });
      }

      this.$el.toggleClass('hide', !isVisible);
      this.$el.html(
        template({
          isAdmin: this.model != null ? this.model.owned() : undefined,
          trelloForTeams: Array.from(campaigns.TRELLO_FOR_TEAMS).includes(
            this.model.id,
          ),
          isTemplate,
          isVisible,
        }),
      );

      return this;
    }
  };
  LoggedInPublicBoardBannerView.initClass();
  return LoggedInPublicBoardBannerView;
})();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
