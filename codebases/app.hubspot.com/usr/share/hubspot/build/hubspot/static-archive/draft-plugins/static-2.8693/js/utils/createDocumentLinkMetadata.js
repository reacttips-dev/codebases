'use es6';

import { Map as ImmutableMap } from 'immutable';
import { DOCUMENT_CONSTANTS } from '../lib/constants';
var DOCUMENT_ATOMIC_TYPE = DOCUMENT_CONSTANTS.DOCUMENT_ATOMIC_TYPE;
export default (function (_ref) {
  var name = _ref.name,
      id = _ref.id,
      description = _ref.description,
      thumbnail = _ref.thumbnail,
      link = _ref.link,
      align = _ref.align,
      imgWidth = _ref.imgWidth,
      imgHeight = _ref.imgHeight,
      skipForm = _ref.skipForm;
  return ImmutableMap({
    atomicType: DOCUMENT_ATOMIC_TYPE,
    name: name,
    id: id,
    description: description,
    thumbnail: thumbnail,
    link: link,
    align: align,
    imgWidth: imgWidth,
    imgHeight: imgHeight,
    skipForm: skipForm
  });
});