'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import styled from 'styled-components';
import { GYPSUM } from 'HubStyleTokens/colors';
import TileCollection from './TileCollection';
import { selectStockFile, deselectStockFile } from '../../actions/Shutterstock';
import { trackInteraction } from '../../actions/Actions';
import { getSelectedStockFile } from '../../selectors/Panel';
var ShutterstockTile = styled.div.withConfig({
  displayName: "Shutterstock__ShutterstockTile",
  componentId: "sc-1t5xgqr-0"
})(["position:absolute;display:flex;align-items:center;justify-content:center;width:100%;height:100%;left:0;top:0;background-color:", ";cursor:pointer;"], GYPSUM);
var ShutterstockThumbnailImage = styled.img.withConfig({
  displayName: "Shutterstock__ShutterstockThumbnailImage",
  componentId: "sc-1t5xgqr-1"
})(["max-height:100%;max-width:100%;"]);

var Shutterstock = /*#__PURE__*/function (_Component) {
  _inherits(Shutterstock, _Component);

  function Shutterstock(props) {
    var _this;

    _classCallCheck(this, Shutterstock);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Shutterstock).call(this, props));
    _this.renderTile = _this.renderTile.bind(_assertThisInitialized(_this));
    _this.handleSelect = _this.handelSelect.bind(_assertThisInitialized(_this));
    _this.handleCloseStockDetail = _this.handleCloseStockDetail.bind(_assertThisInitialized(_this));
    _this.handleInsert = _this.handleInsert.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Shutterstock, [{
    key: "handelSelect",
    value: function handelSelect(event, image) {
      var _this$props = this.props,
          onSelect = _this$props.onSelect,
          onTrackInteraction = _this$props.onTrackInteraction;
      onTrackInteraction('Browse Shutterstock', 'clicked-image-preview');
      onSelect(image);
    }
  }, {
    key: "handleInsert",
    value: function handleInsert(file) {
      var onInsert = this.props.onInsert;
      onInsert(file);
    }
  }, {
    key: "handleCloseStockDetail",
    value: function handleCloseStockDetail() {
      var usageTrackingMeta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var onSelect = this.props.onSelect;
      onSelect(null, usageTrackingMeta);
    }
  }, {
    key: "renderTile",
    value: function renderTile(tile) {
      var _this2 = this;

      var _tile$toObject = tile.toObject(),
          image = _tile$toObject.image;

      return /*#__PURE__*/_jsx(ShutterstockTile, {
        children: /*#__PURE__*/_jsx(ShutterstockThumbnailImage, {
          src: image.get('smallPreviewUrl'),
          draggable: false,
          onClick: function onClick(event) {
            _this2.handleSelect(event, image);
          }
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          tiles = _this$props2.tiles,
          total = _this$props2.total,
          onLoadMoreImages = _this$props2.onLoadMoreImages;
      return /*#__PURE__*/_jsx(TileCollection, {
        onLoadMoreFiles: onLoadMoreImages,
        tileRenderer: this.renderTile,
        tiles: tiles,
        total: total
      });
    }
  }]);

  return Shutterstock;
}(Component);

Shutterstock.propTypes = {
  tiles: PropTypes.instanceOf(Immutable.List),
  total: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  onLoadMoreImages: PropTypes.func.isRequired,
  onTrackInteraction: PropTypes.func.isRequired
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    selectedStockFile: getSelectedStockFile(state)
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onTrackInteraction: function onTrackInteraction(name, action, meta) {
      dispatch(trackInteraction(name, action, meta));
    },
    onSelect: function onSelect(image) {
      dispatch(image ? selectStockFile(image) : deselectStockFile(null));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Shutterstock);