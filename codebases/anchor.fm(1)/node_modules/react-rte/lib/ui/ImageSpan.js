import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import autobind from 'class-autobind';
import cx from 'classnames';
import React, { Component } from 'react';
import { Entity } from 'draft-js';

import styles from './ImageSpan.css';

// TODO: Use a more specific type here.

var ImageSpan = function (_Component) {
  _inherits(ImageSpan, _Component);

  function ImageSpan(props) {
    _classCallCheck(this, ImageSpan);

    var _this = _possibleConstructorReturn(this, (ImageSpan.__proto__ || _Object$getPrototypeOf(ImageSpan)).call(this, props));

    autobind(_this);
    var entity = props.contentState.getEntity(props.entityKey);

    var _entity$getData = entity.getData(),
        width = _entity$getData.width,
        height = _entity$getData.height;

    _this.state = {
      width: width,
      height: height
    };
    return _this;
  }

  _createClass(ImageSpan, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _state = this.state,
          width = _state.width,
          height = _state.height;

      var entity = this.props.contentState.getEntity(this.props.entityKey);
      var image = new Image();

      var _entity$getData2 = entity.getData(),
          src = _entity$getData2.src;

      image.src = src;
      image.onload = function () {
        if (width == null || height == null) {
          // TODO: isMounted?
          _this2.setState({ width: image.width, height: image.height });
          Entity.mergeData(_this2.props.entityKey, {
            width: image.width,
            height: image.height,
            originalWidth: image.width,
            originalHeight: image.height
          });
        }
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _state2 = this.state,
          width = _state2.width,
          height = _state2.height;
      var className = this.props.className;

      var entity = this.props.contentState.getEntity(this.props.entityKey);

      var _entity$getData3 = entity.getData(),
          src = _entity$getData3.src;

      className = cx(className, styles.root);
      var imageStyle = {
        verticalAlign: 'bottom',
        backgroundImage: 'url("' + src + '")',
        backgroundSize: width + 'px ' + height + 'px',
        lineHeight: height + 'px',
        fontSize: height + 'px',
        width: width,
        height: height,
        letterSpacing: width
      };

      return React.createElement(
        'span',
        {
          className: className,
          style: imageStyle,
          onClick: this._onClick
        },
        this.props.children
      );
    }
  }, {
    key: '_onClick',
    value: function _onClick() {
      console.log('image clicked');
    }
  }, {
    key: '_handleResize',
    value: function _handleResize(event, data) {
      var _data$size = data.size,
          width = _data$size.width,
          height = _data$size.height;

      this.setState({ width: width, height: height });
      Entity.mergeData(this.props.entityKey, { width: width, height: height });
    }
  }]);

  return ImageSpan;
}(Component);

export default ImageSpan;