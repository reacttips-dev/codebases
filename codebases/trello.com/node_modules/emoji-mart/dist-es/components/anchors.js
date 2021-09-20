import _Object$getPrototypeOf from '../polyfills/objectGetPrototypeOf';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from '../polyfills/createClass';
import _possibleConstructorReturn from '../polyfills/possibleConstructorReturn';
import _inherits from '../polyfills/inherits';
import React from 'react';
import PropTypes from 'prop-types';

var Anchors = function (_React$PureComponent) {
  _inherits(Anchors, _React$PureComponent);

  function Anchors(props) {
    _classCallCheck(this, Anchors);

    var _this = _possibleConstructorReturn(this, (Anchors.__proto__ || _Object$getPrototypeOf(Anchors)).call(this, props));

    var defaultCategory = props.categories.filter(function (category) {
      return category.first;
    })[0];

    _this.state = {
      selected: defaultCategory.name
    };

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(Anchors, [{
    key: 'handleClick',
    value: function handleClick(e) {
      var index = e.currentTarget.getAttribute('data-index');
      var _props = this.props;
      var categories = _props.categories;
      var onAnchorClick = _props.onAnchorClick;


      onAnchorClick(categories[index], index);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props;
      var categories = _props2.categories;
      var color = _props2.color;
      var i18n = _props2.i18n;
      var icons = _props2.icons;
      var selected = this.state.selected;


      return React.createElement(
        'div',
        { className: 'emoji-mart-anchors' },
        categories.map(function (category, i) {
          var id = category.id;
          var name = category.name;
          var anchor = category.anchor;
          var isSelected = name == selected;

          if (anchor === false) {
            return null;
          }

          return React.createElement(
            'span',
            {
              key: id,
              title: i18n.categories[id],
              'data-index': i,
              onClick: _this2.handleClick,
              className: 'emoji-mart-anchor ' + (isSelected ? 'emoji-mart-anchor-selected' : ''),
              style: { color: isSelected ? color : null }
            },
            React.createElement(
              'div',
              { className: 'emoji-mart-anchor-icon' },
              icons.categories[id]()
            ),
            React.createElement('span', {
              className: 'emoji-mart-anchor-bar',
              style: { backgroundColor: color }
            })
          );
        })
      );
    }
  }]);

  return Anchors;
}(React.PureComponent);

export default Anchors;


Anchors.defaultProps = {
  categories: [],
  onAnchorClick: function onAnchorClick() {},
  icons: {}
};