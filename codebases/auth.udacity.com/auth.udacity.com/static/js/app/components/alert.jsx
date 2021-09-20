import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './alert.module.scss';

export default class Alert extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    text: PropTypes.string,
    contactSupportText: PropTypes.string,
    contactSupportLink: PropTypes.string,
    type: PropTypes.oneOf(['success', 'error']),
    className: PropTypes.string
  };

  static defaultProps = {
    isVisible: true,
    text: null,
    contactSupportText: null,
    contactSupportLink: null,
    type: 'success',
    className: null
  };

  render() {
    const {
      className,
      isVisible,
      text,
      contactSupportText,
      contactSupportLink,
      type
    } = this.props;
    return (
      <div className={className}>
        <div className={`${styles[type]} ${isVisible ? '' : styles.hidden}`}>
          {text}
          <div
            className={`${
              contactSupportLink && contactSupportText ? '' : styles.hidden
            }`}
          >
            <a href={contactSupportLink}>{contactSupportText}</a>
          </div>
        </div>
      </div>
    );
  }
}
