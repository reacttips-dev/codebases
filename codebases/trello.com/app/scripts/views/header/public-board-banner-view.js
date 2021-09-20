// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Controller } = require('app/scripts/controller');
const WarningBannerView = require('app/scripts/views/header/warning-banner-view');
const templates = require('app/scripts/views/internal/templates');
const _ = require('underscore');
const { l } = require('app/scripts/lib/localize');
const { campaigns } = require('app/scripts/data/marketing-campaign-boards');
const { usesEnglish } = require('@trello/locale');

module.exports = class PublicBoardBannerView extends WarningBannerView {
  className() {
    const trelloForTeams = Array.from(campaigns.TRELLO_FOR_TEAMS).includes(
      this.model.id,
    )
      ? 'trello-for-teams'
      : '';
    return `header-banner mod-warning ${trelloForTeams}`;
  }

  initialize() {
    return this.listenTo(
      this.model,
      'change:prefs',
      this.frameDebounce(this.render),
    );
  }

  getBannerText() {
    const text = {
      interactionText: l(['public interactions', this.getPermissionsText()]),
      ctaKey: 'sign-up-for-free',
    };

    if (Array.from(campaigns.TRELLO_FOR_TEAMS).includes(this.model.id)) {
      text.interactionText = l(['trello for teams campaign interaction']);
      text.ctaKey = 'get-started';
    } else if (Array.from(campaigns.CAMPING).includes(this.model.id)) {
      text.interactionText = l(['adventure campaign interaction']);
      text.ctaKey = 'sign-up-its-free';

      // TODO gerard replace with a international version!
    } else if (usesEnglish()) {
      text.interactionText = 'Visually collaborate with anyone, anywhere.';
    }

    return text;
  }

  getPermissionsText() {
    const prefs = this.model.get('prefs');
    const couldVote = prefs.voting === 'public';
    const couldComment = prefs.comments === 'public';

    if (couldVote && couldComment) {
      return 'subscribe vote comment';
    } else if (couldVote) {
      return 'subscribe vote';
    } else if (couldComment) {
      return 'subscribe comment';
    }
    return 'subscribe';
  }

  render() {
    const urlEscaped = encodeURIComponent(
      `${Controller.getBoardUrl(this.model)}`,
    );
    const data = _.extend(
      {
        signupUrl: `/signup?returnUrl=${urlEscaped}&source=public-board-banner`,
      },
      this.getBannerText(),
    );

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/header_public_board'),
        data,
      ),
    );

    return this;
  }
};
