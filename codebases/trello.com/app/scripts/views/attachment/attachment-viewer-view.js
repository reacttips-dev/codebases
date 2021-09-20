/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const AttachmentHelpers = require('./helpers');
const { Dates } = require('app/scripts/lib/dates');
const {
  getKey,
  Key,
  registerShortcutHandler,
  Scope,
  unregisterShortcutHandler,
} = require('@trello/keybindings');
const PluginModelSerializer = require('app/scripts/views/internal/plugins/plugin-model-serializer');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const Promise = require('bluebird');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const {
  Analytics,
  tracingCallback,
  getScreenFromUrl,
} = require('@trello/atlassian-analytics');
const { l } = require('app/scripts/lib/localize');
const {
  ELEVATION_ATTR,
  getHighestVisibleElevation,
} = require('@trello/layer-manager');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class AttachmentViewerView extends View {
  static initClass() {
    this.prototype.className = 'attachment-viewer';

    this.prototype.events = {
      'click .js-show-next-frame': 'showNextFrame',
      'click .js-show-prev-frame': 'showPrevFrame',
      'mouseenter .js-show-next-frame': 'hintNextFrame',
      'mouseenter .js-show-prev-frame': 'hintPrevFrame',

      'mouseleave .js-show-next-frame': 'clearHint',
      'mouseleave .js-show-prev-frame': 'clearHint',

      'click .js-stop': 'stop',
      'click .js-close-viewer': 'close',

      'click .js-open-delete-confirm': 'openDeleteConfirm',
      'click .js-close-delete-confirm': 'closeDeleteConfirm',
      'click .js-delete': 'delete',
      'click .js-make-cover': 'makeCover',
      'click .js-remove-cover': 'removeCover',
    };
  }

  constructor(options) {
    super(options);
    this.onShortcut = this.onShortcut.bind(this);
    registerShortcutHandler(this.onShortcut, { scope: Scope.Overlay });
  }

  initialize() {
    PopOver.hide();
    this.allowsCardCovers = __guard__(this.model.getBoard(), (x) =>
      x.getPref('cardCovers'),
    );
    this.currentAttachment = this.options.attachmentModel;
    const idAtt = this.options.idAttachment;
    if (idAtt != null) {
      this.currentAttachment = this.model.attachmentList.find(
        (model) => model.id === idAtt,
      );
    }

    this.idPluginAttachments = [];
    this.getIdPluginAttachments();

    this.idTrelloAttachments = [];
    this.getIdTrelloAttachments();

    Analytics.sendScreenEvent({
      name: 'attachmentViewerModal',
      containers: this.currentAttachment?.getCard()?.getAnalyticsContainers(),
      attributes: {
        type: this.currentAttachment.getType(),
        cardIsTemplate: this.model.get('isTemplate'),
        cardIsClosed: this.model.get('closed'),
      },
    });

    return this.listenTo(
      this.model.attachmentList,
      'add remove reset',
      this.getIdPluginAttachments,
    );
  }

  remove() {
    unregisterShortcutHandler(this.onShortcut);
    return super.remove(...arguments);
  }

  onShortcut(event) {
    switch (getKey(event)) {
      case Key.Escape:
        this.close();
        event.preventDefault();
        return Analytics.sendPressedShortcutEvent({
          shortcutName: 'escapeShortcut',
          source: 'attachmentViewerModal',
          keyValue: Key.Escape,
        });

      case Key.ArrowRight:
        this.showNextFrame();
        event.preventDefault();
        return Analytics.sendPressedShortcutEvent({
          shortcutName: 'moveRightShortcut',
          source: 'attachmentViewerModal',
          keyValue: Key.ArrowRight,
        });

      case Key.ArrowLeft:
        this.showPrevFrame();
        event.preventDefault();
        return Analytics.sendPressedShortcutEvent({
          shortcutName: 'moveLeftShortcut',
          source: 'attachmentViewerModal',
          keyValue: Key.ArrowLeft,
        });

      default:
        break;
    }
  }

  // getters
  getAttachmentModels() {
    return this.model.attachmentList.filter((attachment) => {
      return (
        !Array.from(this.idPluginAttachments).includes(attachment.id) &&
        !Array.from(this.idTrelloAttachments).includes(attachment.id)
      );
    });
  }

  getAttachmentModelsLength() {
    return this.getAttachmentModels().length;
  }

  getCurrentAttachmentIndex() {
    return _.indexOf(this.getAttachmentModels(), this.currentAttachment);
  }

  // NOTE: Prev increments and Next decrements because attachments are
  //       reverse sorted on the card back (descending `pos` order). Thus,
  //       pressing the right arrow key (next) should iterate *down*
  //       the list, and the left arrow key (prev) should go iterate *up*
  getPrevAttachmentIndex() {
    const idx = this.getCurrentAttachmentIndex() + 1;
    if (idx >= this.getAttachmentModelsLength()) {
      return null;
    } else {
      return idx;
    }
  }

  getPrevModel() {
    const idx = this.getPrevAttachmentIndex();
    if (idx != null) {
      return this.getAttachmentModels()[idx];
    } else {
      return null;
    }
  }

  getNextAttachmentIndex() {
    const idx = this.getCurrentAttachmentIndex() - 1;
    if (idx < 0) {
      return null;
    } else {
      return idx;
    }
  }

  getNextModel() {
    const idx = this.getNextAttachmentIndex();
    if (idx != null) {
      return this.getAttachmentModels()[idx];
    } else {
      return null;
    }
  }

  render() {
    const data = this.model.toJSON();
    data.numAttachments = this.getAttachmentModelsLength();

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/attachment_viewer'),
        data,
      ),
    );

    // Ensure the attachment viewer is given the highest elevation to interop
    // with outside click handlers using the @trello/layer-manager
    if (!this.$el.attr(ELEVATION_ATTR)) {
      const elevation = getHighestVisibleElevation() + 1;
      this.$el.attr(ELEVATION_ATTR, elevation);
    }

    if (
      Array.from(this.idPluginAttachments).includes(this.currentAttachment.id)
    ) {
      const models = this.getAttachmentModels();
      this.currentAttachment = models[models.length - 1];
    }

    this.addNewFrame(this.currentAttachment, 'center');

    const nextModel = this.getNextModel();
    if (nextModel != null) {
      this.addNewFrame(nextModel, 'right');
    }

    const prevModel = this.getPrevModel();
    if (prevModel != null) {
      this.addNewFrame(prevModel, 'left');
    }

    this.setDetailsAndControls();

    return this;
  }

  setDetailsAndControls() {
    AttachmentHelpers.getAttachmentData(this.currentAttachment)
      .then((data) => {
        data.canMakeCover =
          this.allowsCardCovers &&
          (data.previews != null ? data.previews.length : undefined) > 0;
        data.isCover =
          this.allowsCardCovers &&
          this.model.get('idAttachmentCover') === this.currentAttachment.id;

        const babbleKey = this.currentAttachment.get('isUpload')
          ? 'delete attachment'
          : 'remove attachment';

        _.extend(data, {
          removeButtonText: l([babbleKey, 'button']),
          removeMessageText: l([babbleKey, 'message']),
          removeConfirmText: l([babbleKey, 'confirm']),
          removeCancelText: l([babbleKey, 'cancel']),
        });

        this.$('.js-display-frame-details').html(
          templates.fill(
            require('app/scripts/views/templates/attachment_viewer_frame_details'),
            data,
            { editable: this.model.editable() },
          ),
        );

        this.$('.js-show-prev-frame').toggleClass(
          'hide',
          this.getPrevAttachmentIndex() == null,
        );
        this.$('.js-show-next-frame').toggleClass(
          'hide',
          this.getNextAttachmentIndex() == null,
        );

        return Dates.update(this.el);
      })
      .done();
  }

  addNewFrame(model, direction) {
    AttachmentHelpers.getAttachmentData(model)
      .then((data) => {
        let needle, needle1, needle2, needle3, needle4;
        if (direction != null) {
          data.directionClass = `attachment-viewer-frame-${direction}`;
        }
        const isImagePreviewable =
          ((needle = data.ext),
          Array.from(AttachmentHelpers.imageExts()).includes(needle)) ||
          (data.previews != null ? data.previews.length : undefined) > 0;
        const isAudioable =
          ((needle1 = data.ext),
          Array.from(AttachmentHelpers.audioExts()).includes(needle1));
        const isVideoable =
          ((needle2 = data.ext),
          Array.from(AttachmentHelpers.videoExts()).includes(needle2));
        const isIFrameable =
          ((needle3 = data.ext),
          Array.from(AttachmentHelpers.iFrameableExts()).includes(needle3));
        const isGoogleViewerable =
          ((needle4 = data.ext),
          Array.from(AttachmentHelpers.googleViewerableExts()).includes(
            needle4,
          ));

        if (data.isExternal && !isImagePreviewable) {
          data.isPlaceholder = true;
        } else if (isImagePreviewable) {
          let middle, previewURL;
          data.isImage = true;
          // HACK: We're preferring to use a preview over the default attachment
          // URL because the preview selection will try to avoid versions of the
          // image that have an EXIF rotation set
          //
          // Except ...
          //
          // For attachments created between 2019-09-22 to 2019-10-08
          // the width/height of the entry for the original image in the previews
          // array reflected the width/height after accounting for any EXIF rotation
          // and the scaled property stayed set to true
          //
          // During this period, we would have been unable to tell if the original
          // image could be put as the src of an image tag without worrying that there
          // might be an EXIF rotation that wasn't being accounted for; this resulted
          // in us rendering some images that were rotated 90 degrees
          //
          // On 2019-10-08 we attempted to fix this issue by setting scaled on the
          // original image to false (meaning it would never be used), and this caused
          // users to write in frustrated that it wasn't easy to see/download the
          // original image
          //
          // For images uploaded after 2019-10-16 the scaled property for the original
          // image is only set to true if the image is correctly oriented
          //
          // For images created during that time period 2019-09-22 to 2019-10-16, we're
          // going to display the original image no matter what the width/height/scaled
          // are telling us.  The image might be upside down, or rotated 90 degrees, but
          // we're expecting that's less of a problem than showing a smaller thumbnail.
          // (Users can work around this by downloading the image and uploading it again)
          const unableToExcludeEXIFRotation =
            '2019-09-22' <= (middle = model.get('date')) &&
            middle < '2019-10-17';

          if (unableToExcludeEXIFRotation) {
            // Send a tracking event so some day we can justify removing the
            // unableToExcludeEXIFRotation check
            Analytics.sendOperationalEvent({
              action: 'errored',
              actionSubject: 'attachment',
              source: 'attachmentViewerModal',
              attributes: {
                reason: "Couldn't exclude EXIF rotation",
              },
            });
          }

          if (
            data.previews != null &&
            !unableToExcludeEXIFRotation &&
            (previewURL = __guard__(
              Util.biggestPreview(data.previews),
              (x) => x.url,
            )) != null
          ) {
            data.url = previewURL;
          }
        } else if (isAudioable) {
          data.isAudio = true;
        } else if (isVideoable) {
          data.isVideo = true;
        } else if (isIFrameable) {
          data.isIFrameable = true;
        } else if (isGoogleViewerable) {
          data.isIFrameable = true;
          const urlParam = encodeURIComponent(data.url);
          data.url = `https://docs.google.com/viewer?embedded=true&url=${urlParam}`;
        } else {
          data.isPlaceholder = true;
          data.openText = 'Download';
        }

        this.$('.js-frames').append(
          templates.fill(
            require('app/scripts/views/templates/attachment_viewer_frame'),
            data,
            { editable: this.model.editable() },
          ),
        );

        // because
        return this.defer(() =>
          $('.attachment-viewer-frame').addClass(
            'attachment-viewer-frame-loaded',
          ),
        );
      })
      .done();

    return this;
  }

  focusFrame(model, direction) {
    let frameToRemove, modelForNewFrame, oldFocusFrameClass;
    this.currentAttachment = model;
    const focusFrame = _.find(
      this.$('.attachment-viewer-frame'),
      (frame) => $(frame).attr('data-idAttachment') === model.id,
    );

    switch (direction) {
      case 'right':
        frameToRemove = this.$('.attachment-viewer-frame-left');
        oldFocusFrameClass = 'attachment-viewer-frame-left';
        modelForNewFrame = this.getNextModel();
        break;
      case 'left':
        frameToRemove = this.$('.attachment-viewer-frame-right');
        oldFocusFrameClass = 'attachment-viewer-frame-right';
        modelForNewFrame = this.getPrevModel();
        break;
      default:
        break;
    }

    // the old center frame needs to be shifted.
    this.$('.attachment-viewer-frame-center')
      .removeClass('attachment-viewer-frame-center')
      .addClass(oldFocusFrameClass);

    // center the new current frame
    $(focusFrame)
      .removeClass('attachment-viewer-frame-left attachment-viewer-frame-right')
      .addClass('attachment-viewer-frame-center');

    // only three frames. remove one.
    frameToRemove.remove();

    // add a new frame. if there is no model for the frame (i.e. we are at the
    // end or beginning), then add a blank frame as a buffer.
    if (modelForNewFrame != null) {
      this.addNewFrame(modelForNewFrame, direction);
    } else {
      this.clearHint();
    }

    this.setDetailsAndControls();
  }

  showNextFrame(e) {
    Util.stop(e);
    const model = this.getNextModel();
    if (model != null) {
      this.focusFrame(model, 'right');
    }
    Analytics.sendScreenEvent({
      name: 'attachmentViewerModal',
      containers: model?.getCard()?.getAnalyticsContainers(),
      attributes: {
        type: this.currentAttachment.getType(),
      },
    });
  }

  showPrevFrame(e) {
    Util.stop(e);
    const model = this.getPrevModel();
    if (model != null) {
      this.focusFrame(model, 'left');
    }
    Analytics.sendScreenEvent({
      name: 'attachmentViewerModal',
      containers: model?.getCard()?.getAnalyticsContainers(),
      attributes: {
        type: this.currentAttachment.getType(),
      },
    });
  }

  hintNextFrame() {
    this.$el.addClass('attachment-viewer-frames-next-hint');
  }

  hintPrevFrame() {
    this.$el.addClass('attachment-viewer-frames-prev-hint');
  }

  clearHint() {
    this.$el.removeClass(
      'attachment-viewer-frames-next-hint attachment-viewer-frames-prev-hint',
    );
  }

  stop(e) {
    return Util.stopPropagation(e);
  }

  openDeleteConfirm(e) {
    Util.stop(e);
    this.$('.js-meta').addClass('hide');
    this.$('.js-confirm-delete').removeClass('hide');
    Analytics.sendViewedComponentEvent({
      componentName: 'confirmDeleteAttachmentSection',
      componentType: 'section',
      source: getScreenFromUrl(),
    });
  }

  closeDeleteConfirm(e) {
    Util.stop(e);
    this.$('.js-meta').removeClass('hide');
    this.$('.js-confirm-delete').addClass('hide');
    Analytics.sendClosedComponentEvent({
      componentName: 'confirmDeleteAttachmentSection',
      componentType: 'section',
      source: getScreenFromUrl(),
    });
  }

  delete(e) {
    Util.stop(e);
    this.currentAttachment.destroy();
    this.close();
    Analytics.sendTrackEvent({
      action: 'deleted',
      actionSubject: 'attachment',
      source: 'attachmentViewerModal',
    });
  }

  renderToggleCover() {
    const canMakeCover =
      this.allowsCardCovers &&
      this.currentAttachment.get('previews').length > 0;
    this.$('.js-cover-options').toggleClass('hide', !canMakeCover);

    const isCover =
      this.allowsCardCovers &&
      this.model.get('idAttachmentCover') === this.currentAttachment.id;
    this.$('.js-make-cover-box').toggleClass('hide', isCover);
    this.$('.js-remove-cover-box').toggleClass('hide', !isCover);
  }

  makeCover() {
    const traceId = Analytics.startTask({
      taskName: 'edit-card/idAttachmentCover',
      source: 'attachmentViewerModal',
    });
    this.model.makeCover(
      this.currentAttachment,
      traceId,
      tracingCallback(
        {
          taskName: 'edit-card/idAttachmentCover',
          traceId,
          source: 'attachmentViewerModal',
        },
        (err, card) => {
          if (card) {
            Analytics.sendUpdatedCardFieldEvent({
              field: 'idAttachment',
              source: 'idAttachmentCover',
              value: this.currentAttachment.id,
              containers: {
                card: { id: card.id },
                list: { id: card.idList },
                board: { id: card.idBoard },
              },
              attributes: { taskId: traceId },
            });
          }
        },
      ),
    );
    this.renderToggleCover();
  }

  removeCover() {
    const traceId = Analytics.startTask({
      taskName: 'edit-card/idAttachmentCover',
      source: 'attachmentViewerModal',
    });
    this.model.removeCover(
      null,
      traceId,
      tracingCallback(
        {
          taskName: 'edit-card/idAttachmentCover',
          traceId,
          source: 'attachmentViewerModal',
        },
        (err, card) => {
          if (card) {
            Analytics.sendUpdatedCardFieldEvent({
              field: 'idAttachmentCover',
              source: 'attachmentViewerModal',
              value: null,
              containers: {
                card: { id: card.id },
                list: { id: card.idList },
                board: { id: card.idBoard },
              },
              attributes: { taskId: traceId },
            });
          }
        },
      ),
    );
    this.renderToggleCover();
  }

  close() {
    this.remove();
    Analytics.sendClosedComponentEvent({
      componentName: 'attachmentViewerModal',
      componentType: 'modal',
      source: getScreenFromUrl(),
    });
  }

  getIdPluginAttachments() {
    this.getIdTrelloAttachments();

    return PluginRunner.all({
      timeout: 5000,
      command: 'attachment-sections',
      card: this.model,
      board: this.model.getBoard(),
      options: {
        entries: PluginModelSerializer.attachments(this.model.attachmentList),
      },
    }).then((pluginAttachments) => {
      this.idPluginAttachments = _.chain(pluginAttachments)
        .map((section) =>
          __guard__(section != null ? section.claimed : undefined, (x) =>
            x.map((attachment) => attachment.id),
          ),
        )
        .flatten()
        .value();

      return this.render();
    });
  }

  getIdTrelloAttachments() {
    return Promise.map(
      this.model.attachmentList.models,
      AttachmentHelpers.getAttachmentData,
    ).then((allAttachmentData) => {
      return (this.idTrelloAttachments = _.chain(allAttachmentData)
        .filter(
          (attachmentData) =>
            attachmentData.isKnownService &&
            ['trello card', 'trello board'].includes(attachmentData.type),
        )
        .map(({ id }) => id)
        .value());
    });
  }
}

AttachmentViewerView.initClass();
module.exports = AttachmentViewerView;
