import _t from 'i18n!nls/s12n';
import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'bundles/phoenix/components/Modal';
import 'css!./__styles__/UnenrollConfirmationModal';

class UnenrollConfirmationModal extends React.Component {
  static propTypes = {
    modalName: PropTypes.string,
    closeModal: PropTypes.func.isRequired,
    handleUnenroll: PropTypes.func,
    unenrollLink: PropTypes.string,
    unenrollButtonText: PropTypes.string,
    children: PropTypes.node,
  };

  onUnenroll = (e: $TSFixMe) => {
    e.preventDefault();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleUnenroll' does not exist on type '... Remove this comment to see the full error message
    this.props.handleUnenroll();
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'modalName' does not exist on type 'Reado... Remove this comment to see the full error message
    const { modalName, closeModal, handleUnenroll, unenrollLink, unenrollButtonText } = this.props;
    const customUnenrollButtonText = unenrollButtonText || _t('Yes, un-enroll');
    return (
      <Modal modalName={modalName} handleClose={closeModal} className="rc-UnenrollConfirmationModal vertical-box">
        <div className="modal-content vertical-box">
          <div className="flex-1">{this.props.children}</div>
          <section className="button-container">
            <button className="passive" onClick={closeModal}>
              {_t('Cancel')}
            </button>
            {unenrollLink && (
              <a className="link-button primary" href={unenrollLink}>
                {customUnenrollButtonText}
              </a>
            )}
            {handleUnenroll && (
              <button onClick={this.onUnenroll} className="primary">
                {customUnenrollButtonText}
              </button>
            )}
          </section>
        </div>
      </Modal>
    );
  }
}

export default UnenrollConfirmationModal;
