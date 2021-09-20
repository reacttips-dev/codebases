import { Util } from 'app/scripts/lib/util';
import { PopOver } from 'app/scripts/views/lib/pop-over';
import MembersVotedView from 'app/scripts/views/member/members-voted-view';
import { LegacyPowerUps } from 'app/scripts/data/legacy-power-ups';
import { sendPluginUIEvent } from 'app/scripts/lib/plugins/plugin-behavioral-analytics';
import cardDetailToggleButtonTemplate from 'app/scripts/views/templates/card_detail_toggle_button';
import { Auth } from 'app/scripts/db/auth';
import { localizeCount } from 'app/scripts/lib/localize-count';
import { Analytics } from '@trello/atlassian-analytics';

export const showVotes = function (e: MouseEvent) {
  Util.stop(e);
  PopOver.toggle({
    elem: this.$('.js-show-votes'),
    view: MembersVotedView,
    options: { model: this.model, modelCache: this.modelCache },
  });

  Analytics.sendClickedButtonEvent({
    buttonName: 'openVotesButton',
    source: 'cardDetailScreen',
    attributes: {
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
    containers: this.model.getAnalyticsContainers(),
  });
  sendPluginUIEvent({
    idPlugin: LegacyPowerUps.voting,
    idBoard: this.model.getBoard().id,
    idCard: this.model.id,
    event: {
      action: 'clicked',
      actionSubject: 'badge',
      actionSubjectId: 'cardDetailBadge',
      source: 'cardDetailScreen',
    },
  });
};

export const renderVotes = function () {
  // sidebar
  const $voteSidebar = this.$('.js-vote-sidebar-button');
  const isTemplate = !!this.model.get('isTemplate');

  $voteSidebar.next('.toggle-button').remove();
  if (!isTemplate) {
    $voteSidebar.after(
      cardDetailToggleButtonTemplate({
        isOn: this.model.voted(),
        disabled: !this.model.getBoard().canVote(Auth.me()),
        icon: 'vote',
        text: 'vote',
        selectorOn: 'js-unvote',
        selectorOff: 'js-vote',
      }),
    );
  }

  const hideVotes = !!this.model.getBoard().get('prefs').hideVotes;
  const numVotes = this.model.get('badges')?.votes
    ? this.model.get('badges')?.votes
    : 0;

  if (numVotes) {
    const viewingMemberVoted = this.model.get('badges')?.viewingMemberVoted;
    if (hideVotes || isTemplate) {
      this.$('.js-card-detail-votes').addClass('hide');
    } else {
      this.$('.js-card-detail-votes-badge')
        .text(localizeCount('votes', numVotes))
        .toggleClass(
          'is-voted',
          // eslint-disable-next-line eqeqeq
          viewingMemberVoted != null ? viewingMemberVoted : false,
        );
      this.$('.js-card-detail-votes').toggleClass('hide', numVotes === 0);
    }
  } else {
    this.$('.js-card-detail-votes').addClass('hide');
    // No more votes to show, so hide the popup
    if (PopOver.view instanceof MembersVotedView) {
      PopOver.hide();
    }
  }

  return this;
};

export const vote = function (e: MouseEvent) {
  Util.preventDefault(e);
  this.model.vote(true);
  Analytics.sendUpdatedCardFieldEvent({
    field: 'vote',
    source: 'cardDetailScreen',
    containers: this.model.getAnalyticsContainers(),
    attributes: {
      value: true,
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
  });
  sendPluginUIEvent({
    idPlugin: LegacyPowerUps.voting,
    idBoard: this.model.getBoard().id,
    idCard: this.model.id,
    event: {
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'cardButton',
      source: 'cardDetailScreen',
    },
  });
  return false;
};

export const unvote = function (e: MouseEvent) {
  Util.preventDefault(e);
  Analytics.sendUpdatedCardFieldEvent({
    field: 'vote',
    source: 'cardDetailScreen',
    containers: this.model.getAnalyticsContainers(),
    attributes: {
      value: false,
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
  });
  sendPluginUIEvent({
    idPlugin: LegacyPowerUps.voting,
    idBoard: this.model.getBoard().id,
    idCard: this.model.id,
    event: {
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'cardButton',
      source: 'cardDetailScreen',
    },
  });
  this.model.vote(false);
  return false;
};
