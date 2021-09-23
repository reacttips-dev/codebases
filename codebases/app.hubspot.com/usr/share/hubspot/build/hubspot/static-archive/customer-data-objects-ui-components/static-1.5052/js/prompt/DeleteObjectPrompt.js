'use es6';

import isFunction from 'transmute/isFunction';
import emptyFunction from 'react-utils/emptyFunction';
import Promptable from 'UIComponents/decorators/Promptable';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import DeleteDialog from 'customer-data-ui-utilities/dialog/DeleteDialog';
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
var prompt = Promptable(DeleteDialog);
export default (function (props) {
  var confirmLabel = props.confirmLabel,
      rejectLabel = props.rejectLabel,
      message = props.message,
      match = props.match,
      matchLabel = props.matchLabel,
      title = props.title,
      gdprEnabled = props.gdprEnabled,
      gdprDeletePossible = props.gdprDeletePossible,
      isScopedForGdprDelete = props.isScopedForGdprDelete,
      objectType = props.objectType,
      dialogBody = props.dialogBody,
      dialogNote = props.dialogNote,
      hasNoFilters = props.hasNoFilters,
      gdprNote = props.gdprNote;
  var callback = isFunction(props.callback) ? props.callback : emptyFunction;
  var onReject = props.onReject || rethrowError;
  prompt({
    confirmLabel: confirmLabel,
    gdprEnabled: gdprEnabled && objectType === CONTACT,
    gdprDeletePossible: gdprDeletePossible,
    isScopedForGdprDelete: isScopedForGdprDelete,
    rejectLabel: rejectLabel,
    message: message,
    match: match,
    matchLabel: matchLabel,
    title: title,
    dialogBody: dialogBody,
    dialogNote: dialogNote,
    onReject: onReject,
    hasNoFilters: hasNoFilters,
    objectType: objectType,
    gdprNote: gdprNote
  }).then(callback, onReject).done();
});