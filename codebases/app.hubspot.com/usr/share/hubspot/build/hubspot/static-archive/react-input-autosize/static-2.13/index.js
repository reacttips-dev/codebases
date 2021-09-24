'use es6';

import react from 'react';
import propTypes from 'prop-types';
import createReactClass from 'create-react-class';
var _extends = Object.assign;
var sizerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  visibility: 'hidden',
  height: 0,
  overflow: 'scroll',
  whiteSpace: 'pre'
};
var AutosizeInput = createReactClass({
  displayName: "AutosizeInput",
  propTypes: {
    className: propTypes.string,
    // className for the outer element
    defaultValue: propTypes.any,
    // default field value
    inputClassName: propTypes.string,
    // className for the input element
    inputStyle: propTypes.object,
    // css styles for the input element
    minWidth: propTypes.oneOfType([// minimum width for input element
    propTypes.number, propTypes.string]),
    onAutosize: propTypes.func,
    // onAutosize handler: function(newWidth) {}
    onChange: propTypes.func,
    // onChange handler: function(newValue) {}
    placeholder: propTypes.string,
    // placeholder text
    placeholderIsMinWidth: propTypes.bool,
    // don't collapse size to less than the placeholder
    style: propTypes.object,
    // css styles for the outer element
    value: propTypes.any
  },
  // field value
  getDefaultProps: function getDefaultProps() {
    return {
      minWidth: 1
    };
  },
  getInitialState: function getInitialState() {
    return {
      inputWidth: this.props.minWidth
    };
  },
  componentDidMount: function componentDidMount() {
    this.mounted = true;
    this.copyInputStyles();
    this.updateInputWidth();
  },
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    if (prevState.inputWidth !== this.state.inputWidth) {
      if (typeof this.props.onAutosize === 'function') {
        this.props.onAutosize(this.state.inputWidth);
      }
    }

    this.updateInputWidth();
  },
  componentWillUnmount: function componentWillUnmount() {
    this.mounted = false;
  },
  inputRef: function inputRef(el) {
    this.input = el;
  },
  placeHolderSizerRef: function placeHolderSizerRef(el) {
    this.placeHolderSizer = el;
  },
  sizerRef: function sizerRef(el) {
    this.sizer = el;
  },
  copyInputStyles: function copyInputStyles() {
    if (this.mounted || !window.getComputedStyle) {
      return;
    }

    var inputStyle = this.input && window.getComputedStyle(this.input);

    if (!inputStyle) {
      return;
    }

    var widthNode = this.sizer;
    widthNode.style.fontSize = inputStyle.fontSize;
    widthNode.style.fontFamily = inputStyle.fontFamily;
    widthNode.style.fontWeight = inputStyle.fontWeight;
    widthNode.style.fontStyle = inputStyle.fontStyle;
    widthNode.style.letterSpacing = inputStyle.letterSpacing;
    widthNode.style.textTransform = inputStyle.textTransform;

    if (this.props.placeholder) {
      var placeholderNode = this.placeHolderSizer;
      placeholderNode.style.fontSize = inputStyle.fontSize;
      placeholderNode.style.fontFamily = inputStyle.fontFamily;
      placeholderNode.style.fontWeight = inputStyle.fontWeight;
      placeholderNode.style.fontStyle = inputStyle.fontStyle;
      placeholderNode.style.letterSpacing = inputStyle.letterSpacing;
      placeholderNode.style.textTransform = inputStyle.textTransform;
    }
  },
  updateInputWidth: function updateInputWidth() {
    if (!this.mounted || !this.sizer || typeof this.sizer.scrollWidth === 'undefined') {
      return;
    }

    var newInputWidth = undefined;

    if (this.props.placeholder && (!this.props.value || this.props.value && this.props.placeholderIsMinWidth)) {
      newInputWidth = Math.max(this.sizer.scrollWidth, this.placeHolderSizer.scrollWidth) + 2;
    } else {
      newInputWidth = this.sizer.scrollWidth + 2;
    }

    if (newInputWidth < this.props.minWidth) {
      newInputWidth = this.props.minWidth;
    }

    if (newInputWidth !== this.state.inputWidth) {
      this.setState({
        inputWidth: newInputWidth
      });
    }
  },
  getInput: function getInput() {
    return this.input;
  },
  focus: function focus() {
    this.input.focus();
  },
  blur: function blur() {
    this.input.blur();
  },
  select: function select() {
    this.input.select();
  },
  render: function render() {
    var sizerValue = [this.props.defaultValue, this.props.value, ''].reduce(function (previousValue, currentValue) {
      if (previousValue !== null && previousValue !== undefined) {
        return previousValue;
      }

      return currentValue;
    });
    var wrapperStyle = this.props.style || {};
    if (!wrapperStyle.display) wrapperStyle.display = 'inline-block';

    var inputStyle = _extends({}, this.props.inputStyle);

    inputStyle.width = this.state.inputWidth + 'px';
    inputStyle.boxSizing = 'content-box';

    var inputProps = _extends({}, this.props);

    inputProps.className = this.props.inputClassName;
    inputProps.style = inputStyle; // ensure props meant for `AutosizeInput` don't end up on the `input`

    delete inputProps.inputClassName;
    delete inputProps.inputStyle;
    delete inputProps.minWidth;
    delete inputProps.onAutosize;
    delete inputProps.placeholderIsMinWidth;
    return /*#__PURE__*/react.createElement('div', {
      className: this.props.className,
      style: wrapperStyle
    }, /*#__PURE__*/react.createElement('input', _extends({}, inputProps, {
      ref: this.inputRef
    })), /*#__PURE__*/react.createElement('div', {
      ref: this.sizerRef,
      style: sizerStyle
    }, sizerValue), this.props.placeholder ? /*#__PURE__*/react.createElement('div', {
      ref: this.placeHolderSizerRef,
      style: sizerStyle
    }, this.props.placeholder) : null);
  }
});
var AutosizeInput_1 = AutosizeInput;
export default AutosizeInput_1;