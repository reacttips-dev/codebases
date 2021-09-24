'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import Immutable from 'immutable';
import { AutoSizer, InfiniteLoader } from 'react-virtualized';
import UIBox from 'UIComponents/layout/UIBox';
import { Collection } from 'react-virtualized';

var TileCollection = /*#__PURE__*/function (_PureComponent) {
  _inherits(TileCollection, _PureComponent);

  function TileCollection() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, TileCollection);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TileCollection)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.isRowLoaded = function (_ref) {
      var index = _ref.index;
      var tiles = _this.props.tiles;
      return !_this.hasMore() || index < tiles.count();
    };

    _this.hasMore = function () {
      var _this$props = _this.props,
          tiles = _this$props.tiles,
          total = _this$props.total;
      return tiles.count() < total;
    };

    _this.getRowCount = function () {
      var tiles = _this.props.tiles;
      return _this.hasMore() ? tiles.size + 1 : tiles.size;
    };

    _this.getCellSizeAndPosition = function (_ref2) {
      var index = _ref2.index;
      var tiles = _this.props.tiles;
      var tile = tiles.get(index);
      return {
        height: tile.get('height'),
        width: tile.get('width'),
        x: tile.get('x'),
        y: tile.get('y')
      };
    };

    _this.renderCell = function (_ref3) {
      var index = _ref3.index,
          key = _ref3.key,
          style = _ref3.style;
      var _this$props2 = _this.props,
          tiles = _this$props2.tiles,
          tileRenderer = _this$props2.tileRenderer;
      var tile = tiles.get(index);
      var objectId = tile.getIn(['file', 'id']) || tile.getIn(['image', 'id']);
      return /*#__PURE__*/_jsx("div", {
        style: style,
        className: "tile-cell",
        "data-test-object-id": objectId,
        children: tileRenderer(tile)
      }, key);
    };

    return _this;
  }

  _createClass(TileCollection, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props3 = this.props,
          tiles = _this$props3.tiles,
          onLoadMoreFiles = _this$props3.onLoadMoreFiles,
          previousSelectedFileId = _this$props3.previousSelectedFileId;
      var scrollToCellIndex = previousSelectedFileId ? tiles.findIndex(function (t) {
        return t.getIn(['file', 'id']) === previousSelectedFileId || t.getIn(['image', 'id']) === previousSelectedFileId;
      }) : 0;
      return /*#__PURE__*/_jsx(UIBox, {
        grow: 1,
        "data-test-id": "infinite-tiles",
        children: /*#__PURE__*/_jsx(InfiniteLoader, {
          loadMoreRows: onLoadMoreFiles,
          isRowLoaded: this.isRowLoaded,
          rowCount: this.getRowCount(),
          children: function children(_ref4) {
            var onRowsRendered = _ref4.onRowsRendered,
                registerChild = _ref4.registerChild;
            return /*#__PURE__*/_jsx(AutoSizer, {
              children: function children(_ref5) {
                var width = _ref5.width,
                    height = _ref5.height;
                return /*#__PURE__*/_jsx(Collection, {
                  ref: registerChild,
                  height: height,
                  width: width,
                  tiles: tiles,
                  cellCount: tiles.size,
                  onRowsRendered: onRowsRendered,
                  cellRenderer: _this2.renderCell,
                  cellSizeAndPositionGetter: _this2.getCellSizeAndPosition,
                  onSectionRendered: function onSectionRendered(_ref6) {
                    var indices = _ref6.indices;
                    onRowsRendered({
                      startIndex: indices[0],
                      stopIndex: indices[indices.length - 1]
                    });
                  },
                  verticalOverscan: 8,
                  previousSelectedFileId: previousSelectedFileId,
                  scrollToCell: scrollToCellIndex
                });
              }
            });
          }
        })
      });
    }
  }]);

  return TileCollection;
}(PureComponent);

TileCollection.propTypes = {
  tiles: PropTypes.instanceOf(Immutable.List).isRequired,
  total: PropTypes.number.isRequired,
  previousSelectedFileId: PropTypes.number,
  tileRenderer: PropTypes.func.isRequired,
  onLoadMoreFiles: PropTypes.func.isRequired
};
export default TileCollection;