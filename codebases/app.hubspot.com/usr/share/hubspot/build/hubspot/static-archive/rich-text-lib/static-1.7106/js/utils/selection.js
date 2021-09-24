'use es6';

export var cleanSelectionRects = function cleanSelectionRects(rectArray) {
  var overlappingIndexes = [];
  return rectArray.filter(function (currentRect, currentIndex, rects) {
    if (overlappingIndexes.includes(currentIndex)) {
      return true;
    }

    var innerSelectionRect = rects.find(function (rect, index) {
      if (index === currentIndex) {
        return false;
      }

      var thisBox = [[currentRect.x, currentRect.y], [currentRect.x + currentRect.width, currentRect.y + currentRect.height]];
      var otherBox = [[rect.x, rect.y], [rect.x + rect.width, rect.y + rect.height]];

      if (otherBox[0][0] >= thisBox[0][0] && otherBox[0][1] >= thisBox[0][1]) {
        if (otherBox[1][0] <= thisBox[1][0] && otherBox[1][1] <= thisBox[1][1]) {
          overlappingIndexes.push(index);
          return true;
        }
      }

      return false;
    });

    if (innerSelectionRect !== undefined) {
      return false;
    }

    return true;
  });
};