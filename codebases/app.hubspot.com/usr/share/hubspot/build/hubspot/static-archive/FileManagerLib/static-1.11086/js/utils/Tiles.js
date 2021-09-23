'use es6';

export var getTotalFilteredTiles = function getTotalFilteredTiles(_ref) {
  var savedFilesCount = _ref.savedFilesCount,
      files = _ref.files,
      tiles = _ref.tiles;
  return tiles.count() + (savedFilesCount - files.count());
};