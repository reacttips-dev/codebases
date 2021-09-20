var React = require('react');
var clamp = require('./clamp.js');
var pick = require('object.pick');
var PropTypes = require('prop-types');
var ReactDOM = require('react-dom');

/**
 * multuline text-overflow: ellipsis
 */
function Dotdotdot() {
  if(!(this instanceof Dotdotdot)) {
    throw new TypeError("Cannot call a class as a function");
  }
  this.update = this.update.bind(this);
  this.getContainerRef = function (container) {
    this.container = container;
  }.bind(this);
}

Dotdotdot.prototype = Object.create(React.Component.prototype);
Dotdotdot.prototype.componentDidMount = function() {
  window.addEventListener('resize', this.update, false);
  // NOTE: It's possible, not all fonts are loaded on window.load
  window.addEventListener('load', this.update, false);
  this.dotdotdot(ReactDOM.findDOMNode(this.container));
};
Dotdotdot.prototype.componentWillUnmount = function() {
  window.removeEventListener('resize', this.update, false);
  window.removeEventListener('load', this.update, false);
};
Dotdotdot.prototype.componentDidUpdate = function() {
  this.dotdotdot(ReactDOM.findDOMNode(this.container));
};

Dotdotdot.prototype.dotdotdot = function(container) {
  if (this.props.clamp) {
    if (container.length) {
      throw new Error('Please provide exacly one child to dotdotdot');
    }
    clamp(container, pick(this.props, [
      'animate',
      'clamp',
      'splitOnChars',
      'truncationChar',
      'truncationHTML',
      'useNativeClamp'
    ]));
  };
};
Dotdotdot.prototype.update = function() {
    this.forceUpdate();
};

Dotdotdot.prototype.render = function() {
  return React.createElement(
    this.props.tagName,
    {
      ref: this.getContainerRef,
      className: this.props.className
    },
    this.props.children
  );
};

// Statics:
Dotdotdot.propTypes = {
  children: PropTypes.node,
  clamp: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
  ]).isRequired,
  truncationChar: PropTypes.string,
  useNativeClamp: PropTypes.bool,
  className: PropTypes.string,
  tagName: PropTypes.string
};

Dotdotdot.defaultProps = {
  truncationChar: '\u2026',
  useNativeClamp: true,
  tagName: 'div'
};

module.exports = Dotdotdot;
