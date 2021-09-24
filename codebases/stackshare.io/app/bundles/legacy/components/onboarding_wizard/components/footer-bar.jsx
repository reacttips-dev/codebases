import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';

@observer
class FooterBar extends Component {
  constructor(props) {
    super(props);
  }

  continueButtonClassName = () => {
    const defaultClass = 'btn btn-ss-alt btn-action';
    const isDisabledClass = 'disabled';

    if (!this.props.disableButton) {
      return defaultClass;
    }

    return `${defaultClass} ${isDisabledClass}`;
  };

  renderAltLink = () => {
    return (
      <span className="span-link link-action" onClick={this.props.onAltLinkClick}>
        {this.props.altLink}
      </span>
    );
  };

  renderContinueButton = () => {
    return (
      <button
        className={this.continueButtonClassName()}
        disabled={this.props.disableButton || this.props.ajaxInProgress}
        onClick={this.props.onContinueClick}
      >
        {this.props.ajaxInProgress && (
          <img className="button-spinner" src="//img.stackshare.io/fe/spinner.svg" />
        )}
        {!this.props.ajaxInProgress && this.props.continueText}
      </button>
    );
  };

  render() {
    return (
      <div className="onboarding-wizard__footer-bar">
        <div className={`btn-action-wrap ${this.props.centerContent && 'btn-action-wrap--center'}`}>
          {this.props.altLink && this.renderAltLink()}
          {this.renderContinueButton()}
        </div>
      </div>
    );
  }
}

FooterBar.propTypes = {
  onContinueClick: PropTypes.func.isRequired,
  continueText: PropTypes.string,
  disableButton: PropTypes.bool,
  ajaxInProgress: PropTypes.bool,
  altLink: PropTypes.string,
  onAltLinkClick: PropTypes.func
};

FooterBar.defaultProps = {
  continueText: 'Continue'
};

export default FooterBar;
