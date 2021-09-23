'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import I18n from 'I18n';
import styled from 'styled-components';
import UIAccordionItem from 'UIComponents/accordion/UIAccordionItem';
var FavoritesContainer = styled.div.withConfig({
  displayName: "FavoritesAccordion__FavoritesContainer",
  componentId: "sc-1kycria-0"
})(["display:inline-flex;"]);
var FavoriteSquatch = styled.div.withConfig({
  displayName: "FavoritesAccordion__FavoriteSquatch",
  componentId: "sc-1kycria-1"
})(["display:inline-block;position:relative;overflow:hidden;background-color:", ";height:15px;width:15px;border-radius:2px;box-shadow:0 0 2px #808080 inset;cursor:pointer;&:not(:last-child){margin-right:8px;}"], function (_ref) {
  var backgroundColor = _ref.backgroundColor;
  return backgroundColor;
});

var FavoritesAccordion = /*#__PURE__*/function (_Component) {
  _inherits(FavoritesAccordion, _Component);

  function FavoritesAccordion() {
    _classCallCheck(this, FavoritesAccordion);

    return _possibleConstructorReturn(this, _getPrototypeOf(FavoritesAccordion).apply(this, arguments));
  }

  _createClass(FavoritesAccordion, [{
    key: "onClickFavorite",
    value: function onClickFavorite(hex) {
      var onSelectColor = this.props.onSelectColor;
      onSelectColor({
        hex: hex
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var favorites = this.props.favorites;
      if (favorites.length <= 0) return null;
      var favoritesComponents = favorites.map(function (color, index) {
        var handleClick = function handleClick() {
          _this.onClickFavorite(color);
        };

        return /*#__PURE__*/_jsx(FavoriteSquatch, {
          "data-test-id": "favorites-accordion-squatch",
          backgroundColor: color,
          onClick: handleClick
        }, "favorite-" + index);
      });
      return /*#__PURE__*/_jsx(UIAccordionItem, {
        "data-test-id": "favorites-accordion",
        defaultOpen: true,
        className: "m-top-2",
        flush: true,
        title: I18n.text('colorPicker.favorites'),
        children: /*#__PURE__*/_jsx(FavoritesContainer, {
          children: favoritesComponents
        })
      });
    }
  }]);

  return FavoritesAccordion;
}(Component);

FavoritesAccordion.propTypes = {
  favorites: PropTypes.arrayOf(PropTypes.string),
  onSelectColor: PropTypes.func.isRequired
};
export default FavoritesAccordion;