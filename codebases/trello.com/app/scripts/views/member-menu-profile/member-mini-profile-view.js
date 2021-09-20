/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const LargeAvatarView = require('app/scripts/views/member-menu-profile/large-avatar-view');
const { ModelLoader } = require('app/scripts/db/model-loader');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const template = require('app/scripts/views/templates/mini_profile');
const { Analytics } = require('@trello/atlassian-analytics');

class MemberMiniProfileView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'member';
    this.prototype.displayType = 'mod-mini-profile';
  }

  initialize() {
    super.initialize(...arguments);
    this.listenTo(
      this.model,
      'change change:avatarUrl change:avatarSource',
      this.frameDebounce(this.render),
    );
  }

  delegateEvents(events) {
    const miniprofileEvents = {
      'click .js-profile': 'showProfile',
      'click .js-view-large': 'viewLarge',
    };

    return super.delegateEvents(
      _.extend(miniprofileEvents, events || this.events),
    );
  }

  render() {
    const data = this.model.toJSON();
    data.isMe = Auth.isMe(this.model);
    data.showEmail = data.email != null && !data.isMe;
    data.isDeactivated = this.options?.board?.isDeactivated(this.model);

    if (
      data.email == null &&
      this.model.get('memberType') === 'ghost' &&
      !this.loaded
    ) {
      this.loadEmail();
    }

    this.$el.html(template(data));

    this.renderMenu();

    return this;
  }

  renderMenu() {}

  loadEmail() {
    return ModelLoader.loadMemberEmail(this.model.id)
      .then(() => {
        return (this.loaded = true);
      })
      .done();
  }

  showProfile() {
    Analytics.sendClickedLinkEvent({
      linkName: 'fullNameProfileLink',
      source: 'miniProfileInlineDialog',
    });
  }

  viewLarge(e) {
    Util.stop(e);

    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'avatar',
      actionSubjectId: 'miniProfileAvatar',
      source: 'miniProfileInlineDialog',
    });

    PopOver.pushView({
      elem: this.$(e.target),
      view: new LargeAvatarView({
        model: this.model,
        modelCache: this.modelCache,
      }),
    });
  }
}

MemberMiniProfileView.initClass();
module.exports = MemberMiniProfileView;
