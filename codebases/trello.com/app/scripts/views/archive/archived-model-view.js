/* eslint-disable
    eqeqeq,
    no-cond-assign,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { PopOver } = require('app/scripts/views/lib/pop-over');
const ReopenBoardPopoverView = require('app/scripts/views/board/reopen-board-popover-view');
const { ModelLoader } = require('app/scripts/db/model-loader');
const Promise = require('bluebird');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const { l } = require('app/scripts/lib/localize');
const { Auth } = require('app/scripts/db/auth');
const template = require('app/scripts/views/templates/archive_item');
const { Analytics } = require('@trello/atlassian-analytics');

class ArchivedModelView extends View {
  static initClass() {
    this.prototype.tagName = 'li';

    this.prototype.className = 'u-clearfix';

    this.prototype.events = {
      'click .js-reopen': 'reopen',
    };
  }

  initialize() {
    this.me = Auth.me();
    this.listenTo(this.model, 'deleting', this.render);
    if (this.model.getBoard != null) {
      return this.listenTo(this.model.getBoard(), 'change:limits', this.render);
    }
  }

  _checkTargetCapacity() {
    // This function doesn't handle cards,
    // but this view isn't used for cards currently
    let result = true;
    if (this.model.getBoard != null) {
      // Check for capacity on the target board (Lists and Cards)
      result = this.model.getBoard().hasCapacity(this.model);
    }

    return result;
  }

  canReopen() {
    const targetHasCapacity = this._checkTargetCapacity();

    if (this.model.owned != null) {
      return targetHasCapacity && this.model.owned();
    } else {
      return targetHasCapacity && this.model.editable();
    }
  }

  render() {
    let org;
    this.$el.html(
      template({
        name: this.model.get('name'),
        orgName: (org = this.model.getOrganization())
          ? org.get('displayName')
          : this.model.hasOrganization()
          ? l(['templates', 'board_header', 'private-workspace'])
          : l('personal'),
        url:
          typeof this.model.getUrl === 'function'
            ? this.model.getUrl()
            : undefined,
        reOpenText: this.options.reOpenText,
        canReopen: this.canReopen(),
        reopenDisabled: this.options.reopenDisabled,
      }),
    );

    return this;
  }

  reopen(e) {
    Util.stop(e);
    const org = this.model.getOrganization();
    if (org != null ? org.isAtOrOverFreeBoardLimit() : undefined) {
      return;
    }

    // Ensure we have all the data needed for the board popover
    const promises = [this.model.getNewBillableGuests()];
    if (org && (!org.adminList || org.adminList.length === 0)) {
      promises.push(ModelLoader.loadOrganizationMembersMinimal(org.id));
    }

    // Check if re-opening this board would result in any newly billable guests,
    // and if so, show the confirmation popover
    return Promise.all(promises).then((...args1) => {
      const [args] = Array.from(args1[0]);
      const { newBillableGuests, availableLicenseCount } = args;

      if (newBillableGuests.length > 0) {
        return PopOver.show({
          elem: this.$('.js-reopen'),
          view: new ReopenBoardPopoverView({
            board: this.model,
            org,
            newBillableGuests,
            availableLicenseCount,
            onReopen: () => {
              return Analytics.sendTrackEvent({
                action: 'reopened',
                actionSubject: 'board',
                source: 'closedBoardsScreen',
                containers: {
                  board: {
                    id: this.model.id,
                  },
                },
              });
            },
          }),
        });
      } else {
        this.model.reopen();

        return Analytics.sendTrackEvent({
          action: 'reopened',
          actionSubject: 'board',
          source: 'closedBoardsScreen',
          containers: {
            board: {
              id: this.model.id,
            },
          },
        });
      }
    });
  }
}

ArchivedModelView.initClass();
module.exports = ArchivedModelView;
