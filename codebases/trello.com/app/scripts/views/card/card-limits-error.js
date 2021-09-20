/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const limitErrorPopover = require('app/scripts/views/lib/limit-error-popover');

const canAddCard = function (options) {
  const { destinationBoard, destinationList } = options;

  return (
    !(destinationBoard != null
      ? destinationBoard.isOverLimit('cards', 'openPerBoard')
      : undefined) &&
    !(destinationBoard != null
      ? destinationBoard.isOverLimit('cards', 'totalPerBoard')
      : undefined) &&
    !(destinationList != null
      ? destinationList.isOverLimit('cards', 'openPerList')
      : undefined) &&
    !(destinationList != null
      ? destinationList.isOverLimit('cards', 'totalPerList')
      : undefined) &&
    !(destinationBoard != null
      ? destinationBoard.isOverLimit('attachments', 'perBoard')
      : undefined) &&
    !(destinationBoard != null
      ? destinationBoard.isOverLimit('checklists', 'perBoard')
      : undefined)
  );
};

const trackingArea = 'cardLimit';
const maybeDisplayLimitsErrorOnCardAdd = function (options) {
  const {
    $elem,
    hasChecklists,
    hasAttachments,
    destinationBoard,
    destinationList,
  } = options;

  const message = (() => {
    if (
      destinationBoard != null
        ? destinationBoard.isOverLimit('cards', 'openPerBoard')
        : undefined
    ) {
      return 'card exceeds open per board limit';
    } else if (
      destinationBoard != null
        ? destinationBoard.isOverLimit('cards', 'totalPerBoard')
        : undefined
    ) {
      return 'card exceeds total per board limit';
    } else if (
      destinationList != null
        ? destinationList.isOverLimit('cards', 'openPerList')
        : undefined
    ) {
      return 'card exceeds open per list limit';
    } else if (
      destinationList != null
        ? destinationList.isOverLimit('cards', 'totalPerList')
        : undefined
    ) {
      return 'card exceeds total per list limit';
    } else if (
      hasAttachments &&
      (destinationBoard != null
        ? destinationBoard.isOverLimit('attachments', 'perBoard')
        : undefined)
    ) {
      return 'card exceeds attachments per board limit';
    } else if (
      hasChecklists &&
      (destinationBoard != null
        ? destinationBoard.isOverLimit('checklists', 'perBoard')
        : undefined)
    ) {
      return 'card exceeds checklists per board limit';
    }
  })();

  if (message != null) {
    limitErrorPopover({
      elem: $elem,
      message,
      trackingArea,
      params: {
        boardName: destinationBoard ? destinationBoard.get('name') : undefined,
        boardId: destinationBoard ? destinationBoard.get('id') : undefined,
        listName: destinationList ? destinationList.get('name') : undefined,
      },
    });
    return true;
  }
  return false;
};

const maybeDisplayLimitsErrorOnCardOpen = function (options) {
  const { $elem, hasAttachments, destinationBoard, destinationList } = options;

  const message = (() => {
    if (
      destinationBoard != null
        ? destinationBoard.isOverLimit('cards', 'openPerBoard')
        : undefined
    ) {
      return 'card exceeds open per board limit';
    } else if (
      destinationList != null
        ? destinationList.isOverLimit('cards', 'openPerList')
        : undefined
    ) {
      return 'card exceeds open per list limit';
    } else if (
      hasAttachments &&
      (destinationBoard != null
        ? destinationBoard.isOverLimit('attachments', 'perBoard')
        : undefined)
    ) {
      return 'card exceeds attachments per board limit';
    }
  })();

  if (message != null) {
    limitErrorPopover({
      trackingArea,
      elem: $elem,
      message,
      params: {
        boardName:
          destinationBoard != null ? destinationBoard.get('name') : undefined,
        boardId:
          destinationBoard != null ? destinationBoard.get('id') : undefined,
        listName:
          destinationList != null ? destinationList.get('name') : undefined,
      },
    });
    return true;
  }
  return false;
};

module.exports = {
  canAddCard,
  maybeDisplayLimitsErrorOnCardAdd,
  maybeDisplayLimitsErrorOnCardOpen,
};
