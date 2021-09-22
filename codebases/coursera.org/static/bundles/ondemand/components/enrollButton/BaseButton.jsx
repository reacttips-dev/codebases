import PropTypes from 'prop-types';
import React from 'react';
import TrackedButton from 'bundles/page/components/TrackedButton';

import _t from 'i18n!nls/ondemand';

class BaseButton extends React.Component {
  static propTypes = {
    isEnrolled: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
    enrolledText: PropTypes.string,
    enrollText: PropTypes.string,
  };

  static defaultProps = {
    enrollText: _t('Enroll'),
    enrolledText: _t('Enrolled'),
  };

  render() {
    const { enrollText, enrolledText } = this.props;
    return (
      <TrackedButton
        trackingName="enroll_button"
        className="primary"
        onClick={this.props.onClick}
        disabled={this.props.isEnrolled}
      >
        {this.props.isEnrolled ? enrolledText : enrollText}
      </TrackedButton>
    );
  }
}

export default BaseButton;
