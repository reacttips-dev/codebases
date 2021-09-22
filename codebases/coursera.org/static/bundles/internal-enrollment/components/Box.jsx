import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

// TODO: Replace with the CUI/CDS component
class Box extends React.Component {
  static propTypes = {
    horizontal: PropTypes.bool,
    vertical: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
    alignItemsVerticalCenter: PropTypes.bool,
  };

  render() {
    const classes = classNames(this.props.className, {
      'horizontal-box': this.props.horizontal,
      'vertical-box': this.props.vertical,
      'align-items-vertical-center': this.props.alignItemsVerticalCenter,
    });

    return <div className={classes}>{this.props.children}</div>;
  }
}

export default Box;
