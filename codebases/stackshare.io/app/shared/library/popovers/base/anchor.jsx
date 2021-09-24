import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Anchor extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onSize: PropTypes.func,
    children: PropTypes.any
  };

  _el = null;
  _position = {x: 0, y: 0};

  handleResize() {
    if (this._el) {
      this._position = {x: this._el.offsetLeft + this._el.clientWidth / 2, y: this._el.offsetTop};
    }
  }

  handleClick = () => {
    this.handleResize();
    this.props.onClick(this._position);
  };

  handleMouseEnter = () => {
    this.handleResize();
    this.props.onMouseEnter(this._position);
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, false);
    this.handleResize();
    if (this.props.onSize && this._el) {
      this.props.onSize({width: this._el.clientWidth, height: this._el.clientHeight});
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  render() {
    const {children, onClick, onMouseEnter, onMouseLeave} = this.props;
    React.Children.only(children);
    return React.cloneElement(children, {
      onClick: onClick && this.handleClick,
      onMouseEnter: onMouseEnter && this.handleMouseEnter,
      onMouseLeave,
      innerRef: el => (this._el = el)
    });
  }
}
