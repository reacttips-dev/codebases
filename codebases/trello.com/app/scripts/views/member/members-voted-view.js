// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const { ModelLoader } = require('app/scripts/db/model-loader');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const {
  sendPluginScreenEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const { LegacyPowerUps } = require('app/scripts/data/legacy-power-ups');

class MembersVotedView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'voters';

    this.prototype.events = {
      'click .js-more-members-voted': 'showAll',
      'click .js-vote': 'vote',
      'click .js-unvote': 'unvote',
    };
  }

  initialize() {
    ModelLoader.loadCardVoters(this.model.id).done();
    sendPluginScreenEvent({
      idPlugin: LegacyPowerUps.voting,
      idBoard: this.model.getBoard().id,
      idCard: this.model.id,
      screenName: 'pupVotesInlineDialog',
    });
    return this.listenTo(
      this.model.memberVotedList,
      'add remove reset',
      this.frameDebounce(this.render),
    );
  }

  showAll() {
    return this.render(true);
  }

  render(all) {
    let member;
    const { memberVotedList } = this.model;

    const data = {
      members: (() => {
        const result = [];
        for (member of Array.from(memberVotedList.models)) {
          result.push(member.toJSON());
        }
        return result;
      })(),
    };

    // When render is called from the listenTo it gets passed the memberVotedList so we want to specify that it has to not equal true
    if (all !== true) {
      data.members = data.members.slice(0, 48);
      // we only load this if there are voters so voters = 0 means we're still
      // loading them
      data.loading = memberVotedList.length === 0;
      data.fewMembers = memberVotedList.length < 14;
      data.moreMembers = memberVotedList.length > 48;
      data.lengthDiff = memberVotedList.length - 48;
      data.canVote = this.model.getBoard().canVote(Auth.me());
      data.voted = _.include(this.model.get('idMembersVoted'), Auth.myId());
    }

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/members_voted'),
        data,
        {},
        { member: templates.member },
      ),
    );

    return this;
  }

  vote(e) {
    Util.preventDefault(e);
    this.model.vote(true);
    return false;
  }

  unvote(e) {
    Util.preventDefault(e);
    this.model.vote(false);
    if (this.model.get('idMembersVoted').length === 0) {
      PopOver.hide();
    }
    return false;
  }
}

MembersVotedView.initClass();
module.exports = MembersVotedView;
