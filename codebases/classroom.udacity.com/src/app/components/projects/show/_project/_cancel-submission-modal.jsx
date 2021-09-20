import BusyButton from 'components/common/busy-button';
import { Modal } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';
import styles from './_cancel-submission-modal.scss';

@cssModule(styles)
class CancelSubmissionModal extends React.Component {
  static displayName = 'projects/show/_project/_cancel-submission-modal';

  static propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    cancelSubmission: PropTypes.func.isRequired,
    projectTitle: PropTypes.string.isRequired,
  };

  static defaultProps = {
    show: false,
  };

  handleSubmissionCancelClick = () => {
    const { cancelSubmission, onHide, createNotificationAlert } = this.props;
    cancelSubmission().then(() => {
      onHide();
      createNotificationAlert(__('Your project was successfully canceled.'));
    });
  };

  handleCancellationModalHide = () => {
    this.props.onHide();
  };

  render() {
    const { show, projectTitle } = this.props;

    return (
      <Modal
        open={show}
        onClose={this.handleCancellationModalHide}
        label={__('Cancel Submission')}
        closeLabel={__('Close Modal')}
      >
        <div styleName="modal-container">
          <div styleName="header-text-ctr">{__('Confirm Cancellation')}</div>
          <div styleName="header-sub-text">
            {__(
              'Are you sure you want to cancel the following project submission? You may resubmit your project at any time.'
            )}
          </div>
          <div styleName="modal-body">
            <div styleName="header">{projectTitle}</div>
            <BusyButton
              styleName="btn-cancel"
              label={__('Yes, cancel my submission')}
              onClick={this.handleSubmissionCancelClick}
            />
            <a
              href="#"
              styleName="close-cancellation"
              onClick={this.handleCancellationModalHide}
            >
              {__('No, keep my submission')}
            </a>
          </div>
        </div>
      </Modal>
    );
  }
}

const CancelSubmissionModalRedux = connect(
  null,
  actionsBinder('createNotificationAlert')
)(CancelSubmissionModal);

export { CancelSubmissionModalRedux as default, CancelSubmissionModal };
