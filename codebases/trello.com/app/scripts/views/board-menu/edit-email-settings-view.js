/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const _ = require('underscore');
const Alerts = require('app/scripts/views/lib/alerts');
const { Analytics } = require('@trello/atlassian-analytics');
const { Auth } = require('app/scripts/db/auth');
const Confirm = require('app/scripts/views/lib/confirm');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { ModelLoader } = require('app/scripts/db/model-loader');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/board_menu_email');
const { l } = require('app/scripts/lib/localize');

class EditEmailSettingsView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'add cards via email';

    this.prototype.events = {
      'change .js-select-position': 'updatePosition',
      'change .js-select-list': 'updateList',
      'click .js-generate-address': 'generateAddress',
      'click .js-send-address': 'sendAddressEmail',
      'click .js-autofocus': 'focusInput',
    };
  }

  initialize(...args) {
    const [{ fromPowerUpDirectory }] = args;
    super.initialize(args);
    this.listenTo(
      this.modelCache,
      'add:List remove:List change:List:closed reset:List',
      this.frameDebounce(this.render),
    );
    this.listenTo(
      this.model,
      'change:myPrefs',
      this.frameDebounce(this.render),
    );

    this.allowEmail = true;

    if (this.model.getPref('emailKey') == null) {
      return this.model.generateEmailKey();
    }
    this.fromPowerUpDirectory = fromPowerUpDirectory ?? false;
  }

  render() {
    let list;
    if (this.model.canComment(Auth.me())) {
      let left;
      const idSelectedList = this.model.getPref('idEmailList');

      const lists = this.model.listList.models.map((list) => ({
        id: list.id,
        name: list.get('name'),
      }));

      const selectedListName = (() => {
        if ((list = _.findWhere(lists, { id: idSelectedList })) != null) {
          return list.name;
        } else if (
          (list = this.modelCache.get('List', idSelectedList)) != null &&
          list.get('closed')
        ) {
          const archivedName = l('archived list', {
            listName: list.get('name'),
          });
          lists.unshift({ id: list.id, name: archivedName });
          return archivedName;
        } else {
          if (idSelectedList != null) {
            // Load list into cache then rerender, grabbing it from cache.
            ModelLoader.loadArchivedListsAndCards(this.model.id).then(() => {
              // Only re-render if we actually found the list; if the list was
              // moved to another board, we're never going to find it
              if (this.modelCache.get('List', idSelectedList) != null) {
                return this.render();
              }
            });
          }
          return l('unknown list placeholder');
        }
      })();

      if (idSelectedList == null) {
        lists.unshift({
          name: l('unknown list placeholder'),
          selected: true,
        });
      }

      this.$el.html(
        template({
          commentsEnabled: true,
          email: (left = this.model.getPref('fullEmail')) != null ? left : '',
          lists: lists.map((list) => ({
            id: list.id,
            name: list.name,
            selected: list.id === idSelectedList,
          })),
          listName: selectedListName,
          positionName: l([
            'email position',
            this.model.getPref('emailPosition'),
          ]),
          position: this.model.getPref('emailPosition'),
        }),
      );
      this.$el.find('#boardEmail').on('copy', () => {
        Analytics.sendTrackEvent({
          action: 'copied',
          actionSubject: 'email',
          source: 'emailToBoardSettingsInlineDialog',
          attributes: {
            fromPowerUpDirectory: this.fromPowerUpDirectory,
          },
          containers: {
            board: {
              id: this.model.id,
            },
          },
        });
      });
    } else {
      this.$el.html(
        template({
          commentsEnabled: false,
        }),
      );
    }

    if (featureFlagClient.get('dataeng.gasv3-event-tracking', false)) {
      Analytics.sendScreenEvent({
        name: 'emailToBoardSettingsInlineDialog',
        attributes: {
          fromPowerUpDirectory: this.fromPowerUpDirectory,
        },
        containers: {
          board: {
            id: this.model.id,
          },
        },
      });
    }

    return this;
  }

  focusInput(e) {
    $(e.target).focus().select();
  }

  updateValue(selectName, prefName) {
    const val = this.$el.find(selectName).val();

    if (val != null && val !== this.model.getPref(prefName)) {
      return this.model.setPref(prefName, val);
    }
  }

  updatePosition() {
    return this.updateValue('.js-select-position', 'emailPosition');
  }

  updateList() {
    this.updateValue('.js-select-list', 'idEmailList');
    return (this.allowEmail = true);
  }

  generateAddress(e) {
    Util.stop(e);

    Confirm.pushView('regenerate email address', {
      model: this.model,
      confirmBtnClass: 'nch-button nch-button--danger',
      popOnClick: true,
      fxConfirm: (e) => {
        this.model.set({
          'myPrefs/emailKey': null,
        });

        this.allowEmail = true;

        Analytics.sendClickedButtonEvent({
          buttonName: 'regenerateE2BAddressButton',
          source: 'emailToBoardSettingsInlineDialog',
          attributes: {
            fromPowerUpDirectory: this.fromPowerUpDirectory,
          },
          containers: {
            board: {
              id: this.model.id,
            },
          },
        });

        return this.model.generateEmailKey();
      },
    });
  }

  sendAddressEmail(e) {
    Util.stop(e);

    if (!this.allowEmail) {
      return;
    }

    Analytics.sendClickedButtonEvent({
      buttonName: 'sendE2BAddressButton',
      source: 'emailToBoardSettingsInlineDialog',
      attributes: {
        fromPowerUpDirectory: this.fromPowerUpDirectory,
      },
      containers: {
        board: {
          id: this.model.id,
        },
      },
    });

    this.allowEmail = false;
    this.model.api(
      {
        method: 'emailKey/message',
        type: 'post',
      },
      (err) => {
        if (!err) {
          return Alerts.flash('email sent', 'confirm', 'email');
        } else {
          return Alerts.show('could not send email', 'error', 'email', 5000);
        }
      },
    );
  }
}

EditEmailSettingsView.initClass();
module.exports = EditEmailSettingsView;
