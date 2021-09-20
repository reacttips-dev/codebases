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
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let InvitedBannerView;
const $ = require('jquery');
const Alerts = require('app/scripts/views/lib/alerts');
const { ApiAjax } = require('app/scripts/network/api-ajax');
const { Auth } = require('app/scripts/db/auth');
const { Board } = require('app/scripts/models/board');
const Browser = require('@trello/browser');
const ConfirmAddEmail = require('app/scripts/views/header/confirm-add-email');
const { ModelLoader } = require('app/scripts/db/model-loader');
const { Util } = require('app/scripts/lib/util');
const WarningBannerView = require('app/scripts/views/header/warning-banner-view');
const _ = require('underscore');
const template = require('app/scripts/views/templates/personalized_header_invite');
const { l } = require('app/scripts/lib/localize');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');

module.exports = InvitedBannerView = (function () {
  InvitedBannerView = class InvitedBannerView extends WarningBannerView {
    static initClass() {
      this.prototype.events = {
        'click .js-join-model': 'joinModel',
        'click .js-ignore-invite': 'ignoreInvite',
        'click .js-join-button': 'clickJoinButton',
      };
    }

    className() {
      const colorMod = this.options.idBoard == null ? 'mod-blue' : '';
      return `header-banner mod-warning mod-invited personalized-invite ${colorMod}`;
    }

    initialize() {
      this.boardOrOrg = this.options.idBoard
        ? this.modelCache.get('Board', this.options.idBoard)
        : this.modelCache.get('Organization', this.options.idOrganization);

      this.eventContainers = this.options.idBoard
        ? { board: { id: this.options.idBoard } }
        : { organization: { id: this.options.idOrganization } };

      return ModelLoader.loadMemberEmail(this.getGhost().id)
        .then((member) => {
          let email;
          if ((email = member.get('email')) == null) {
            return;
          }
          return ApiAjax({
            url: '/1/search/members/',
            type: 'get',
            data: { query: email },
            dataType: 'json',
            success: (data) => {
              if (!_.isEmpty(data) && data[0].memberType === 'normal') {
                //looks like there's already an unconfirmed member with this email
                return (this.hasAccount = true);
              }
            },
          });
        })
        .finally(() => {
          return this.render();
        })
        .done();
    }

    getInviteToken() {
      return Util.inviteTokenFor(this.boardOrOrg.id);
    }

    getMemberAdder() {
      const idMemberAdder = this.getInviteToken().split('-')[1];
      return this.modelCache.get('Member', idMemberAdder);
    }

    getGhost() {
      const idMemberGhost = this.getInviteToken().split('-')[0];
      return this.modelCache.get('Member', idMemberGhost);
    }

    render() {
      const data = this.model.toJSON();

      data.isLoggedIn = Auth.isLoggedIn();

      if (this.boardOrOrg instanceof Board) {
        data.isBoard = true;
        data.modelName = this.boardOrOrg.get('name');
      } else {
        data.modelName = this.boardOrOrg.get('displayName');
      }

      data.modelType = this.boardOrOrg.typeName;

      const memberAdder = this.getMemberAdder();
      if (memberAdder != null) {
        data.memberAdder = memberAdder.toJSON();
        data.isInviter = Auth.isMe(memberAdder);
      }

      const ghost = this.getGhost();
      data.ghost = ghost != null ? ghost.toJSON() : undefined;
      data.isGhostEmailLoggedIn =
        (ghost != null ? ghost.get('email') : undefined) === data.email;
      data.signupUrl =
        '/signup?' +
        $.param({
          reauthenticate: true,
          returnUrl: `${location.pathname}?completedInviteSignup=1`, // Some routes have more redirect logic post-signup
          email: ghost != null ? ghost.get('email') : undefined,
          fullName: ghost != null ? ghost.get('fullName') : undefined,
        });

      data.me = __guard__(Auth.me(), (x) => x.toJSON());
      data.isInternetExplorer = Browser.isIE() || Browser.isEdgeLegacy();

      Analytics.sendViewedBannerEvent({
        bannerName: 'invitedBanner',
        source: getScreenFromUrl(),
        containers: this.eventContainers,
      });

      this.$el.html(template(data));

      return this;
    }

    performModelJoin() {
      const type = this.options.idBoard ? 'board' : 'organization';
      const idModel =
        this.options.idBoard != null
          ? this.options.idBoard
          : this.options.idOrganization;
      return ApiAjax({
        url: `/associate-json/${type}/${idModel}/${Util.inviteTokenFor(
          idModel,
        )}`,
        dataType: 'json',
        type: 'post',
        success: (data) => {
          if (data.error == null) {
            this.deleteTokenCookie();
            // Get us out of a state where are showing the member as a ghost
            return window.location.reload();
          }
        },
      });
    }

    joinModel(e) {
      Util.stop(e);
      if (Auth.isLoggedIn()) {
        const ghostEmail = this.getGhost().get('email');
        const memberEmail = Auth.me().get('email');

        if (ghostEmail === memberEmail) {
          return this.performModelJoin();
        } else {
          return ConfirmAddEmail.toggle('add email', {
            elem: $(e.target),
            model: this.model,
            html: l('confirm.add email.text', { ghostEmail }),
            data: this.model.toJSON(),
            fxConfirm: () => this.performModelJoin(),
          });
        }
      }
    }

    deleteTokenCookie() {
      return $.cookie(
        `invite-token-${
          this.options.idBoard != null
            ? this.options.idBoard
            : this.options.idOrganization
        }`,
        null,
        { path: '/' },
      );
    }

    hideHeader() {
      $(this.el).hide();
      return Util.calcBoardLayout();
    }

    ignoreInvite(e) {
      const ghost = this.getGhost();
      Util.stop(e);
      if (ghost != null) {
        const type = this.options.idBoard ? 'board' : 'organization';

        // Remove the member
        this.boardOrOrg.memberList.removeMembership(this.getGhost(), {
          invite: true,
        });

        // Assume the remove will succeed and immediately hide the header
        this.hideHeader();
        this.deleteTokenCookie();
        const key = (() => {
          switch (type) {
            case 'board':
              return 'rejected board invite';
            case 'organization':
              return 'rejected org invite';
          }
        })();
        return Alerts.show(key, 'error', 'ignoreInvite', 5000);
      }
    }

    clickJoinButton(e) {
      const modelType = this.options.idBoard ? 'Board' : 'Org';
      return Analytics.sendClickedButtonEvent({
        buttonName: `join${modelType}Button`,
        source: 'invitedBanner',
        containers: this.eventContainers,
      });
    }
  };
  InvitedBannerView.initClass();
  return InvitedBannerView;
})();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
