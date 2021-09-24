'use es6';

import { List, fromJS } from 'immutable';
import indexBy from 'transmute/indexBy';
import get from 'transmute/get';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
var dispositionsToTranslate = {
  '73a0d17f-1163-4015-bdd5-ec830791da20': 'no_answer',
  '9d9162e7-6cf3-4944-bf63-4dff82258764': 'busy',
  '17b47fee-58de-441e-a44c-c6300d46f273': 'wrong_number',
  'a4c4c377-d246-4b32-a13b-75a56a4cd0ff': 'left_live_message',
  'b2cf5968-551e-4856-9783-52b3da59a7d0': 'left_voicemail',
  'f240bbac-87c9-4f6e-bf70-924b57d47db7': 'connected'
};

var formatCallDispositionId = function formatCallDispositionId(callDisposition) {
  return String(callDisposition.uid);
};

var formatCallDispositionReference = function formatCallDispositionReference(callDisposition) {
  var id = formatCallDispositionId(callDisposition);
  var label = dispositionsToTranslate[id] ? propertyLabelTranslator(dispositionsToTranslate[id]) : callDisposition.label;
  return new ReferenceRecord({
    id: id,
    label: label,
    referencedObject: fromJS(callDisposition)
  });
};

var formatCallDispositions = function formatCallDispositions(_ref) {
  var callDispositions = _ref.callDispositions;
  return indexBy(get('id'), List(callDispositions).map(formatCallDispositionReference));
};

export default formatCallDispositions;