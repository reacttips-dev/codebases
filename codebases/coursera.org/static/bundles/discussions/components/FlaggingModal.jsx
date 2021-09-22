import _t from 'i18n!nls/discussions';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { flagPost, unflagPost } from 'bundles/discussions/actions/DropdownActions';
import Modal from 'bundles/phoenix/components/Modal';
import 'css!./__styles__/FlaggingModal';

class FlaggingModal extends React.Component {
  static propTypes = {
    handleClose: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  state = {
    error: false,
    saving: false,
    success: false,
  };

  handleSubmitError = () => {
    this.setState({ saving: false, error: true });
  };

  getBodyText() {
    if (this.state.success) {
      return _t('Thank you. We will review it and take appropriate action.');
    } else if (this.state.error) {
      return _t('Sorry, an error occured. Please try again later.');
    } else if (this.isActive()) {
      return _t('Are you sure you want to resolve the reported post?');
    } else {
      return _t('Are you sure you want to report this post?');
    }
  }

  flagAction = () => {
    const { post } = this.props;
    this.setState({ saving: true, success: false, error: false });
    if (this.isActive()) {
      this.context.executeAction(unflagPost, {
        post,
        handleSuccess: this.props.handleClose,
        handleFailure: this.handleSubmitError,
      });
    } else {
      this.context.executeAction(flagPost, {
        post,
        handleSuccess: () => {
          this.setState({ success: true, saving: false });
        },
        handleFailure: this.handleSubmitError,
      });
    }
  };

  isActive = () => {
    return this.props.post.flagDetails && this.props.post.flagDetails.isActive;
  };

  renderButtonContainer() {
    return (
      <div className="horizontal-box align-items-right button-container">
        <button className="passive never-mind" type="button" onClick={this.props.handleClose}>
          {_t('Never mind')}
        </button>
        <button
          className="secondary"
          type="button"
          onClick={this.flagAction}
          disabled={this.state.error || this.state.saving}
        >
          {this.isActive() ? _t('Resolve') : _t('Report')}
        </button>
      </div>
    );
  }

  render() {
    const modalTextClasses = classNames('modal-text', {
      'body-1-text': !this.state.success,
      'body-2-text': this.state.success,
      success: this.state.success,
    });

    const modalTitle = this.isActive() ? _t('Resolve report') : _t('Report as inappropriate');

    return (
      <Modal handleClose={this.props.handleClose} modalName={modalTitle} className="rc-FlaggingModal">
        {this.state.success || <h3 className="c-modal-title headline-3-text">{modalTitle}</h3>}
        <p className={modalTextClasses}>{this.getBodyText()}</p>
        {this.state.success || this.renderButtonContainer()}
      </Modal>
    );
  }
}

export default FlaggingModal;
