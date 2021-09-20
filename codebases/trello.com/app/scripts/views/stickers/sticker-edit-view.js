/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const StickerView = require('app/scripts/views/stickers/sticker-view');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

module.exports = (function () {
  class StickerEditView extends StickerView {
    static initClass() {
      this.prototype.events = {
        mouseenter: 'mouseenter',
        mouseleave: 'mouseleave',
        mousedown: 'editSticker',
        'mousedown .js-remove-sticker': 'removeSticker',
        'mousedown .js-rotate-sticker': 'startRotate',
        'mousedown .js-move-sticker': 'startMove',
      };

      this.editTraceId = null;
    }

    initialize() {
      this.listenTo(this.model, 'stopEditing', this.stopEditing);
      this.listenTo(this.model, 'startEditing', this.editSticker);
      this.listenTo(this.model, 'disableEditing', this.disableEditing);
      return this.listenTo(this.model, 'enableEditing', this.enableEditing);
    }

    showEditControls() {
      return true;
    }

    disableEditing() {
      return this.$el.addClass('editing-disabled');
    }

    enableEditing() {
      return this.$el.removeClass('editing-disabled');
    }

    endCurrentEdit() {
      $(document).off('.stickerrotate .stickermove .stickerautomove');
      this.$el.removeClass('moving rotating');
      return $('.quick-card-editor').removeClass('invalid dragging');
    }

    stopEditing(e) {
      Util.stop(e);

      if (this.isEditing()) {
        this.endCurrentEdit();
        this.$el.removeClass('editing');
        $('.quick-card-editor').removeClass(
          'quick-card-editor-editing-stickers',
        );
        return Array.from(this.model.collection.models).map((sticker) =>
          sticker.trigger('enableEditing'),
        );
      }
    }

    isEditing() {
      return this.$el.is('.moving, .rotating, .editing');
    }

    isEditingDisabled() {
      return this.$el.is('.editing-disabled');
    }

    isMovingOrRotating() {
      return this.$el.is('.moving, .rotating');
    }

    saveStickerAttrs({ position, rotation }) {
      const round = (percent) => Math.round(percent * 100) / 100;

      const update = { zIndex: this.model.collection.nextZIndex(this.model) };

      if (position) {
        const $card = this.$el.closest('.list-card');
        const $stickers = $card.find('.js-card-stickers');
        const stickerAreaWidth = $stickers.width();
        const stickerAreaHeight = $stickers.height();

        update.left = round(
          (parseFloat(this.$el.css('left')) / stickerAreaWidth) * 100,
        );
        update.top = round(
          (parseFloat(this.$el.css('top')) / stickerAreaHeight) * 100,
        );
      }

      if (rotation) {
        const matrix = Util.getElemTransformMatrix(
          this.$el.find('.sticker-image'),
        );
        update.rotate = round(Util.getMatrixDegrees(matrix) % 360);
      }

      this.model.update(
        {
          ...update,
          traceId: this.editTraceId,
        },
        tracingCallback(
          {
            taskName: 'edit-card/stickers',
            traceId: this.editTraceId,
            source: 'stickerEditView',
            attributes: {
              action: rotation ? 'rotated' : position ? 'moved' : 'edited',
            },
          },
          (_err, sticker) => {
            if (sticker) {
              const card = this.options?.card;
              Analytics.sendUpdatedCardFieldEvent({
                field: 'stickers',
                source: 'stickerEditView',
                attributes: {
                  taskId: this.editTraceId,
                  action: rotation ? 'rotated' : position ? 'moved' : 'edited',
                },
                containers: {
                  card: {
                    id: card?.id,
                  },
                  board: {
                    id: card?.get('idBoard'),
                  },
                  list: {
                    id: card?.get('idList'),
                  },
                },
              });
            }
          },
        ),
      );
    }

    mouseenter(e) {
      if (
        !(
          this.isEditingDisabled() ||
          this.isEditing() ||
          this.isMovingOrRotating()
        )
      ) {
        this.$el.addClass('hover');
      }
    }

    mouseleave(e) {
      this.$el.removeClass('hover');
    }

    editSticker(e) {
      let autoClear;
      if (e != null && e.which !== 1) {
        // Non-left-click
        return;
      }

      Util.stop(e);

      if (e != null && e.type === 'mousedown') {
        // Hold on to the mouse position, in case they start dragging
        const { pageX: origX, pageY: origY } = e;

        const clear = () => {
          $(document).off('.stickerautomove');
          return clearTimeout(autoClear);
        };

        $(document).on('mousemove.stickerautomove', (event) => {
          // If they drag the cursor more than 5 px, they're probably trying to
          // drag
          if (
            Math.pow(event.pageX - origX, 2) +
              Math.pow(event.pageY - origY, 2) >
            5 * 5
          ) {
            clear();
            return this.startMove(event);
          }
        });

        // Okay, it's a click, not a drag
        $(document).on('mouseup.stickerautomove', clear);

        // Just in case something goes wrong, clear the handlers after a second
        autoClear = this.setTimeout(clear, 1000);
      }

      // NOTE: We clone the array, so it doesn't get changed out from under us
      // when the models save
      const stickers = _.clone(this.model.collection.models);
      for (const otherSticker of Array.from(stickers)) {
        if (otherSticker !== this.model) {
          otherSticker.trigger('stopEditing');
          otherSticker.trigger('disableEditing');
        }
      }

      // Defer adding the class so the controls-popping-out animation works on the
      // first click (we have to have it be in the DOM in non-editing mode so we
      // can css-transition to editing mode)
      this.defer(() => {
        PopOver.hide();
        this.$el.addClass('editing');
        return $('.quick-card-editor').addClass(
          'quick-card-editor-editing-stickers',
        );
      });
    }

    startRotate(e) {
      if (!this.isEditing()) {
        return;
      }

      Util.preventDefault(e);
      this.editTraceId = Analytics.startTask({
        taskName: 'edit-card/stickers',
        source: 'stickerEditView',
        attributes: {
          action: 'rotated',
        },
      });

      const stickerOrigin = {
        x: this.$el.offset().left + this.$el.width() / 2,
        y: this.$el.offset().top + this.$el.height() / 2,
      };

      const mousePosOrigin = {
        x: e.pageX,
        y: e.pageY,
      };

      let startRotate = 0;
      const matrix = Util.getElemTransformMatrix(
        this.$el.find('.sticker-image'),
      );
      if (matrix != null) {
        startRotate = Util.getMatrixDegrees(matrix);
      }

      let didMove = false;

      $(document).on('mousemove.stickerrotate', (event) => {
        if (!didMove) {
          this.$el.removeClass('hover').addClass('rotating');

          $('.quick-card-editor').addClass('dragging');
          didMove = true;
        }

        const mousePos = {
          x: event.pageX,
          y: event.pageY,
        };

        const endX = mousePos.x - stickerOrigin.x;
        const endY = mousePos.y - stickerOrigin.y;

        const mouseInitialRotate = Util.getDegrees(
          mousePosOrigin.y - stickerOrigin.y,
          mousePosOrigin.x - stickerOrigin.x,
        );
        const endRotate = Util.getDegrees(endY, endX);
        const deltaRotate = endRotate - mouseInitialRotate;

        const newRotate = startRotate + deltaRotate;

        this.$el.find('.sticker-image').css({
          transform: `rotate(${newRotate}deg)`,
          '-webkit-transform': `rotate(${newRotate}deg)`,
        });
      });

      $(document).on('mouseup.stickerrotate', () => {
        if (didMove) {
          this.saveStickerAttrs({ rotation: true });
          return this.endCurrentEdit();
        } else {
          return $(document).off('.stickerrotate');
        }
      });

      return false;
    }

    startMove(e) {
      let offsetX, offsetY;
      if (!this.isEditing()) {
        return;
      }

      Util.stop(e);
      this.editTraceId = Analytics.startTask({
        taskName: 'edit-card/stickers',
        source: 'stickerEditView',
        attributes: {
          action: 'moved',
        },
      });
      const $card = this.$el.closest('.list-card');
      const $stickersArea = $card.find('.js-card-stickers');

      const { left: parentLeft, top: parentTop } = $stickersArea.offset();
      const stickerWidth = this.$el.width();
      const stickerHeight = this.$el.height();
      const parentWidth = $stickersArea.width();
      const parentHeight = $stickersArea.height();

      const bounds = {
        left: -40,
        right: parentWidth - 10,
        top: -40,
        bottom: parentHeight - 10,
      };

      if (e != null) {
        // They clicked on the move handle, so hold that offset
        offsetX = this.$el.offset().left + this.$el.width() / 2 - e.pageX;
        offsetY = this.$el.offset().top + this.$el.height() / 2 - e.pageY;
      } else {
        offsetX = 0;
        offsetY = 0;
      }

      let didMove = false;

      $(document).on('mousemove.stickermove', (event) => {
        if (!didMove) {
          this.$el.removeClass('hover').addClass('moving');

          $('.quick-card-editor').addClass('dragging');

          didMove = true;
        }

        let newLeft = event.pageX - parentLeft - stickerWidth / 2 + offsetX;
        let newTop = event.pageY - parentTop - stickerHeight / 2 + offsetY;

        let valid = true;
        if (newLeft > bounds.right) {
          newLeft = bounds.right;
          valid = false;
        }

        if (newLeft < bounds.left) {
          newLeft = bounds.left;
          valid = false;
        }

        if (newTop > bounds.bottom) {
          newTop = bounds.bottom;
          valid = false;
        }

        if (newTop < bounds.top) {
          newTop = bounds.top;
          valid = false;
        }

        $('.quick-card-editor').toggleClass('invalid', !valid);

        return this.$el.css({
          left: newLeft,
          top: newTop,
        });
      });

      $(document).on('mouseup.stickermove', () => {
        if (didMove) {
          this.saveStickerAttrs({ position: true });
          return this.endCurrentEdit();
        } else {
          return $(document).off('.stickermove');
        }
      });

      return false;
    }

    removeSticker(e) {
      if (this.isEditing()) {
        const remove = _.once(() => {
          this.stopEditing();
          this.model.destroyWithTracing(
            {
              traceId: this.editTraceId,
            },
            tracingCallback(
              {
                taskName: 'edit-card/stickers',
                traceId: this.editTraceId,
                source: 'stickerEditView',
                attributes: {
                  action: 'removed',
                },
              },
              (_err, sticker) => {
                if (sticker) {
                  const card = this.options?.card;
                  Analytics.sendUpdatedCardFieldEvent({
                    field: 'stickers',
                    source: 'stickerEditView',
                    attributes: {
                      taskId: this.editTraceId,
                      action: 'removed',
                    },
                    containers: {
                      card: {
                        id: card?.id,
                      },
                      board: {
                        id: card?.get('idBoard'),
                      },
                      list: {
                        id: card?.get('idList'),
                      },
                    },
                  });
                }
              },
            ),
          );
          this.$el.remove();
        });

        this.$el.one('transitionEnd webkitTransitionEnd', remove);

        this.setTimeout(remove, 100);

        this.$el.addClass('fade-out');
      }
    }
  }
  StickerEditView.initClass();
  return StickerEditView;
})();
