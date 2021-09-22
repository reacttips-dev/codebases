import _t from 'i18n!nls/discussions';
import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'bundles/phoenix/components/Modal';
import ModerationReasons from 'bundles/discussions/components/ModerationReasons';
import NotifyOption from 'bundles/discussions/components/NotifyOption';

class EditWithModerationModal extends React.Component {
  static propTypes = {
    handleCancel: PropTypes.func.isRequired,
    handleSuccess: PropTypes.func.isRequired,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  state = {
    showInputError: false,
    selectedOption: '',
    dontNotify: false,
  };

  handleSelect = (event) => {
    this.setState({
      selectedOption: event.target.value,
    });
  };

  handleCancel = () => {
    this.props.handleCancel();
  };

  handleClose = () => {
    this.props.handleCancel();
  };

  handleSubmit = () => {
    if (!this.state.selectedOption) {
      this.setState({
        showInputError: true,
      });
    } else {
      this.props.handleSuccess(this.state.selectedOption, this.state.dontNotify);
    }
  };

  toggleNotify = () => {
    this.setState({ dontNotify: !this.state.dontNotify });
  };

  render() {
    const inputError = <div className="c-error-text c-modal-error-message">{_t('Please select a reason')}</div>;

    return (
      <div className="rc-EditWithModerationModal">
        <Modal handleClose={this.handleClose} modalName={_t('Edit Post')}>
          <h1 className="c-modal-title subtitle display-1-text">{_t('Edit Post')}</h1>
          <div className="c-modal-subtitle">
            <span>{_t('Why do you want to edit this? ')}</span>
          </div>

          <ModerationReasons ref="reasons" handleSelect={this.handleSelect} />
          <NotifyOption dontNotify={this.state.dontNotify} toggleNotify={this.toggleNotify} />
          <div>
            {this.state.showInputError && inputError}
            <div className="horizontal-box align-items-right">
              <button ref="cancel" className="passive" onClick={this.handleCancel}>
                Cancel
              </button>
              &nbsp;&nbsp;
              <button
                ref="submit"
                disabled={this.state.saving}
                className="secondary"
                type="submit"
                onClick={this.handleSubmit}
              >
                {_t('Submit')}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default EditWithModerationModal;
