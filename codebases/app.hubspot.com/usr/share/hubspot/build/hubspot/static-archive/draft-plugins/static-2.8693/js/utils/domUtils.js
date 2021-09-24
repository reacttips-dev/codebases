'use es6';

export var getUnpaddedElementWidth = function getUnpaddedElementWidth(element) {
  var _element$getBoundingC = element.getBoundingClientRect(),
      totalWidth = _element$getBoundingC.width;

  var totalHorizontalPadding = parseInt(getComputedStyle(element).getPropertyValue('padding-right'), 10) + parseInt(getComputedStyle(element).getPropertyValue('padding-left'), 10);
  return totalWidth - totalHorizontalPadding;
};