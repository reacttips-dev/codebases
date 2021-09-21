import { OrderedSet, is } from 'immutable';
export var EMPTY_SET = new OrderedSet();
export default function getEntityRanges(text, charMetaList) {
  var charEntity = null;
  var prevCharEntity = null;
  var ranges = [];
  var rangeStart = 0;

  for (var i = 0, len = text.length; i < len; i++) {
    prevCharEntity = charEntity;
    var meta = charMetaList.get(i);
    charEntity = meta ? meta.getEntity() : null;

    if (i > 0 && charEntity !== prevCharEntity) {
      ranges.push([prevCharEntity, getStyleRanges(text.slice(rangeStart, i), charMetaList.slice(rangeStart, i))]);
      rangeStart = i;
    }
  }

  ranges.push([charEntity, getStyleRanges(text.slice(rangeStart), charMetaList.slice(rangeStart))]);
  return ranges;
}

function getStyleRanges(text, charMetaList) {
  var charStyle = EMPTY_SET;
  var prevCharStyle = EMPTY_SET;
  var ranges = [];
  var rangeStart = 0;

  for (var i = 0, len = text.length; i < len; i++) {
    prevCharStyle = charStyle;
    var meta = charMetaList.get(i);
    charStyle = meta ? meta.getStyle() : EMPTY_SET;

    if (i > 0 && !is(charStyle, prevCharStyle)) {
      ranges.push([text.slice(rangeStart, i), prevCharStyle]);
      rangeStart = i;
    }
  }

  ranges.push([text.slice(rangeStart), charStyle]);
  return ranges;
}