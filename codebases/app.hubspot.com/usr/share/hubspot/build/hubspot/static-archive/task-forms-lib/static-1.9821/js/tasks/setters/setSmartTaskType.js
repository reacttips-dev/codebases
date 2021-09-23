'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { CALL, EMAIL } from 'customer-data-objects/engagement/TaskTypes';
import I18n from 'I18n';
export default function setSmartTaskType(_ref) {
  var _typeMatchText, _matchIndices;

  var __task = _ref.task,
      updates = _ref.updates,
      _ref$field = _ref.field,
      field = _ref$field === void 0 ? 'hs_task_subject' : _ref$field,
      value = _ref.value;
  var updatesWithNewTitle = updates.set(field, value);
  var typeMatchText = (_typeMatchText = {}, _defineProperty(_typeMatchText, EMAIL, I18n.text('taskFormsLib.smartTask.type.EMAIL')), _defineProperty(_typeMatchText, CALL, I18n.text('taskFormsLib.smartTask.type.CALL')), _typeMatchText);

  var search = function search(searchText) {
    var index = value.toLowerCase().indexOf(searchText.toLowerCase());
    return index === -1 ? Infinity : index;
  };

  var matchIndices = (_matchIndices = {}, _defineProperty(_matchIndices, EMAIL, search(typeMatchText[EMAIL])), _defineProperty(_matchIndices, CALL, search(typeMatchText[CALL])), _matchIndices);

  if (matchIndices[EMAIL] === Infinity && matchIndices[CALL] === Infinity) {
    return updatesWithNewTitle;
  } else if (matchIndices[EMAIL] < matchIndices[CALL]) {
    return updatesWithNewTitle.set('hs_task_type', EMAIL);
  } else {
    return updatesWithNewTitle.set('hs_task_type', CALL);
  }
}