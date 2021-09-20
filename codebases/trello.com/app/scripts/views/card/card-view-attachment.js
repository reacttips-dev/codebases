// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Analytics } = require('@trello/atlassian-analytics');
const { Util } = require('app/scripts/lib/util');
const warnIfFileTooLarge = require('app/scripts/views/internal/warn-if-file-too-large');
const pastedFileName = require('app/scripts/views/internal/pasted-file-name');
const { ninvoke } = require('app/scripts/lib/util/ninvoke');
const Alerts = require('app/scripts/views/lib/alerts');
const Promise = require('bluebird');

module.exports.dragenter = function (e) {
  if (!this.model.editable()) {
    return;
  }

  const _height = this.$el.outerHeight();

  const limited = !this.model.canAttach();
  const restricted = !this.model.canDropAttachment(e.type);
  const className = restricted
    ? '.list-card-dropzone-restricted'
    : limited
    ? '.list-card-dropzone-limited'
    : '.list-card-dropzone';
  this.$(className).css({
    height: `${_height}px`,
    'line-height': `${_height}px`,
  });

  return this.$el
    .addClass('is-drophover')
    .toggleClass('is-restricted', restricted)
    .toggleClass('is-limited', limited);
};

module.exports.dragleave = function (e) {
  return this.$el.removeClass('is-drophover');
};

module.exports.dropFiles = function (e) {
  if (
    !this.model.canAttach() ||
    this.model.attachmentTypeRestricted('computer')
  ) {
    // Stop the event so we don't create a new card with the files
    Util.stop(e);
    return;
  }

  const files = e.detail;

  if (warnIfFileTooLarge(this.model.getBoard(), files)) {
    return;
  }

  Promise.resolve(files)
    .each((file) => {
      const name = file.name || pastedFileName();

      const source = 'cardViewAttachment';

      const analyticsPayload = {
        source,
        taskName: 'create-attachment/file',
      };

      const traceId = Analytics.startTask(analyticsPayload);
      analyticsPayload.traceId = traceId;

      return ninvoke(this.model, 'upload', file, name, { traceId }).then(
        (result) => {
          if (traceId) {
            Analytics.sendTrackEvent({
              source,
              action: 'uploaded',
              actionSubject: 'attachment',
              actionSubjectId: 'fileAttachment',
              attributes: {
                taskId: traceId,
              },
            });

            Analytics.taskSucceeded(analyticsPayload);
          }

          return result;
        },
        (err) => {
          if (traceId) {
            analyticsPayload.error = err;
            Analytics.taskFailed(analyticsPayload);
          }

          return Promise.reject(err);
        },
      );
    })
    .catch(() => Alerts.show('unable to upload file', 'error', 'upload', 5000))
    .done();

  return e.stopPropagation();
};

module.exports.dropUrl = function (e) {
  if (!this.model.canAttach() || this.model.attachmentTypeRestricted('link')) {
    // Stop the event so we don't create a new card with the files
    Util.stop(e);
    return;
  }

  const url = e.detail;

  const board = this.model.getBoard();
  if (board.attachmentUrlRestricted(url)) {
    return;
  }

  this.model.uploadUrl(url);

  return e.stopPropagation();
};
