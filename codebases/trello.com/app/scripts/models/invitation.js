// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ApiAjax } = require('app/scripts/network/api-ajax');
const TrelloModel = require('app/scripts/models/internal/trello-model');

class Invitation extends TrelloModel {
  static initClass() {
    this.prototype.typeName = 'Invitation';
  }
  initialize(attributes, options) {
    this.invitationList = options.collection;

    this.setReady();
  }

  // Temporary functions to handle invitations functions until backbone is migrated to new API
  create({ model, data, success, error }) {
    return ApiAjax({
      url: `/1/${model.typeName}/${model.id}/invitations`,
      type: 'post',
      data,
      dataType: 'json',
      error: (...args) => {
        let needle;
        const adjustedLength = Math.max(args.length, 1),
          [err] = Array.from(args.slice(0, adjustedLength - 1)),
          handler = args[adjustedLength - 1];
        if (
          err.responseText.trim() ===
          'Member email restricted by organization administrators'
        ) {
          // Email address did not match allowlist or board can't invite external members
          this.$('.error').show();
          return;
        }
        if (
          ((needle = err.responseText.trim()),
          ![
            'Member already invited',
            'Member already a member',
            'Member email restricted by organization administrators',
          ].includes(needle))
        ) {
          handler();
        }
        return typeof error === 'function' ? error(err) : undefined;
      },
      success: (data) => {
        return typeof success === 'function' ? success(data) : undefined;
      },
    });
  }

  delete({ model, idInvitation, success, error }) {
    return ApiAjax({
      url: `/1/${model.typeName}/${model.id}/invitations/${idInvitation}`,
      type: 'delete',
      dataType: 'json',
      error: (...args) => {
        const adjustedLength = Math.max(args.length, 1),
          [err] = Array.from(args.slice(0, adjustedLength - 1)),
          handler = args[adjustedLength - 1];
        if (err.responseText.trim() !== 'Invitation not found') {
          handler();
        }
        return typeof error === 'function' ? error(err) : undefined;
      },
      success: (data) => {
        return typeof success === 'function' ? success(data) : undefined;
      },
    });
  }

  respond({ model, response, data, success, error }) {
    return ApiAjax({
      url: `/1/${model.typeName}/${model.id}/invitations/${response}`,
      type: 'post',
      dataType: 'json',
      data,
      error: (...args) => {
        const adjustedLength = Math.max(args.length, 1),
          [err] = Array.from(args.slice(0, adjustedLength - 1)),
          handler = args[adjustedLength - 1];
        if (err.responseText.trim() !== 'already a member') {
          handler();
        }
        return typeof error === 'function' ? error(err) : undefined;
      },
      success: (data) => {
        return typeof success === 'function' ? success(data) : undefined;
      },
    });
  }
}
Invitation.initClass();

module.exports.Invitation = Invitation;
