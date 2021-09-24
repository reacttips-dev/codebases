import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

const Button = glamorous.button({
  outline: 'none',
  padding: 0,
  border: 0,
  flex: 1
});

class TabButton extends Component {
  static propTypes = {
    children: PropTypes.any,
    isOpen: PropTypes.bool,
    onClick: PropTypes.func
  };

  render() {
    return (
      <Button onClick={this.props.onClick}>
        {typeof this.props.children === 'function'
          ? this.props.children({isOpen: this.props.isOpen})
          : this.props.children}
      </Button>
    );
  }
}

const TabItem = glamorous.div(
  {
    flex: 1
  },
  ({isOpen}) => ({
    display: isOpen ? 'block' : 'none'
  })
);

const TabButtons = glamorous.nav({
  display: 'flex'
});

const TabItems = glamorous.div({
  display: 'flex'
});

export {TabButtons, TabButton, TabItems, TabItem};
