import _t from 'i18n!nls/discussions';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import ModerationReasons from 'bundles/discussions/components/ModerationReasons';
import { deletePost } from 'bundles/discussions/actions/DropdownActions';
import { clearThreadsCache } from 'bundles/discussions/actions/ThreadsActions';
import Modal from 'bundles/phoenix/components/Modal';
import NotifyOption from 'bundles/discussions/components/NotifyOption';
import 'css!./__styles__/Delete';

class Delete extends React.Component {
  static propTypes = {
    showReasons: PropTypes.bool.isRequired,
    showNotifyUser: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    onDeleteSuccess: PropTypes.func,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    showNotifyUser: true,
  };

  state = {
    selectedOption: '',
    showInputError: false,
    showServerError: false,
    dontNotify: false,
  };

  componentDidMount() {
    // focus on the radio buttons, if they are present
    if (this.refs.firstOption) {
      ReactDOM.findDOMNode(this.refs.firstOption).focus();
    } else {
      ReactDOM.findDOMNode(this.refs.cancel).focus();
    }
  }

  handleSelect = (event) => {
    this.setState({
      selectedOption: event.target.value,
    });
  };

  handleCancel = () => {
    this.props.handleClose();
  };

  handleSubmit = () => {
    if (!this.props.showReasons || this.state.selectedOption) {
      this.context.executeAction(clearThreadsCache);
      this.context.executeAction(deletePost, {
        post: this.props.post,
        reason: this.state.selectedOption,
        handleSuccess: this.onDeleteSuccess,
        handleFailure: this.onDeleteError,
        dontNotify: this.state.dontNotify,
      });
    } else {
      this.setState({
        showInputError: true,
      });
    }
  };

  handleCloseModal = () => {
    this.props.handleClose();
  };

  onDeleteError = (error) => {
    this.setState({
      showServerError: true,
    });
  };

  onDeleteSuccess = () => {
    this.props.handleClose();
    // TODO(asrinivasan): Pass down view context and renavigate here
    if (this.props.post.type === 'question') {
      this.props.onDeleteSuccess(this.state.selectedOption);
    }
  };

  toggleNotify = () => {
    this.setState((prevState) => {
      return {
        dontNotify: !prevState.dontNotify,
      };
    });
  };

  render() {
    const reasons = (
      <div>
        <ModerationReasons ref="reasons" handleSelect={this.handleSelect} />
        {this.props.showNotifyUser && (
          <NotifyOption dontNotify={this.state.dontNotify} toggleNotify={this.toggleNotify} />
        )}
      </div>
    );

    const inputError = <div className="c-error-text c-modal-error-message">{_t('Please select a reason')}</div>;

    const serverError = (
      <div className="c-error-text c-modal-error-message">
        {_t('Error deleting post; please try again or reload the page')}
      </div>
    );

    const warning = <div className="c-delete-warning">{_t('Are you sure you want to delete this post?')}</div>;

    const subtitle = (
      <div className="c-modal-subtitle">
        <span>{_t('Why do you want to delete this? ')}</span>
      </div>
    );

    const modal = (
      <Modal handleClose={this.handleCloseModal} modalName={_t('Delete Post')}>
        <h1 className="c-modal-title subtitle display-1-text">{_t('Delete Post')}</h1>
        {this.props.showReasons && subtitle}
        {this.props.showReasons ? reasons : warning}
        <div>
          {this.state.showInputError && inputError}
          {this.state.showServerError && serverError}

          <div className="horizontal-box align-items-right">
            <button ref="cancel" className="secondary" type="button" onClick={this.handleCancel}>
              Cancel
            </button>
            &nbsp;&nbsp;
            <button
              ref="submit"
              disabled={this.state.saving}
              className="primary"
              type="submit"
              onClick={this.handleSubmit}
            >
              {_t('Delete')}
            </button>
          </div>
        </div>
      </Modal>
    );

    return <div className="rc-Delete">{modal}</div>;
  }
}

export default Delete;
