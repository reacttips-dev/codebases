/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { track } = require('@trello/analytics');
const { Util } = require('app/scripts/lib/util');
const ArchivedModelView = require('app/scripts/views/archive/archived-model-view');
const {
  maybeDisplayLimitsErrorOnCardOpen,
} = require('app/scripts/views/card/card-limits-error');
const template = require('app/scripts/views/templates/archive_item');
const { Analytics } = require('@trello/atlassian-analytics');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { ModelLoader } = require('app/scripts/db/model-loader');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports = class ArchivedListView extends ArchivedModelView {
  initialize() {
    return (this.sendGASEvent = featureFlagClient.get(
      'dataeng.gasv3-event-tracking',
      false,
    ));
  }

  reopen(e) {
    Util.preventDefault(e);

    // TRELP-2843
    // We now load the cards for the list that has just be re-opened. This used
    // to happen when the list of archived lists was rendered but it meant that
    // lots of unnecessary cards were re-fetched from the api, which caused
    // some boards to fail at rendering the archived lists view. Loading less
    // and only what we need, when we need it, should help us alleviate that.
    // Furthermore when a list is re-opened, websockets also kick in to fill
    // any gaps in the data that hasn't been loaded and completely load all the
    // cards and the list for the user as they need it.
    ModelLoader.loadListCards(this.model.id).then(() => {
      let hasAttachments = false;
      this.model.cardList.forEach(function (card) {
        let left;
        const numAttachments =
          (left = __guard__(card.get('badges'), (x) => x.attachments)) != null
            ? left
            : 0;
        return (hasAttachments = hasAttachments || numAttachments > 0);
      });

      const options = {
        $elem: $(e.target),
        hasAttachments,
        destinationBoard: this.model.getBoard(),
      };
      if (maybeDisplayLimitsErrorOnCardOpen(options)) {
        return;
      }

      return this.model.update({ closed: false }, (err) => {
        if (err != null) {
          this.model.update({ closed: true });
          track('List', 'Reopen', 'Via Archive', 'Failed');
          if (this.sendGASEvent) {
            Analytics.sendTrackEvent({
              action: 'reopened',
              actionSubject: 'list',
              source: 'archiveScreen',
              containers: {
                list: {
                  id: this.model.id,
                },
                board: {
                  id: this.model.getBoard().id,
                },
              },
              attributes: {
                succeeded: false,
              },
            });
          }
          throw err;
        } else {
          track('List', 'Reopen', 'Via Archive');
          if (this.sendGASEvent) {
            return Analytics.sendTrackEvent({
              action: 'reopened',
              actionSubject: 'list',
              source: 'archiveScreen',
              containers: {
                list: {
                  id: this.model.id,
                },
                board: {
                  id: this.model.getBoard().id,
                },
              },
              attributes: {
                succeeded: true,
              },
            });
          }
        }
      });
    });
    return false;
  }

  render() {
    this.$el.html(
      template({
        name: this.model.get('name'),
        url:
          typeof this.model.getUrl === 'function'
            ? this.model.getUrl()
            : undefined,
        reOpenText: this.options.reOpenText,
        canReopen: this.canReopen(),
      }),
    );

    return this;
  }
};
