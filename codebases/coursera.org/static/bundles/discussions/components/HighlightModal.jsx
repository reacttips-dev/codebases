import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'bundles/phoenix/components/Modal';
import TrackedButton from 'bundles/page/components/TrackedButton';
import _t from 'i18n!nls/discussions';

class HighlightModal extends React.Component {
  static propTypes = {
    isHighlighted: PropTypes.bool,
    handleAccept: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
  };

  render() {
    const { isHighlighted, handleAccept, handleCancel } = this.props;

    const modalName = isHighlighted ? _t('Unmark as Highlighted') : _t('Mark as Highlighted');
    const trackingName = isHighlighted ? 'unmark_as_highlighted' : 'mark_as_highlighted';

    return (
      <Modal allowClose={false} modalName={modalName} trackingName={trackingName} className="rc-HighlightModal">
        <h3 className="c-modal-title headline-3-text">{modalName}</h3>

        <div className="body-1-text">
          {!isHighlighted &&
            _t(
              `This will mark the post as "Highlighted" and duplicate it at the top of
            the page. There can only be one Highlighted Post so it will replace any previous one.
          `
            )}

          {isHighlighted &&
            _t(
              `This will remove the post from the top of the page but it will still be
            visible in the list of posts below.
          `
            )}
        </div>

        <div className="horizontal-box align-items-right" style={{ marginTop: 40 }}>
          <button className="passive" onClick={handleCancel}>
            {_t('Cancel')}
          </button>

          <TrackedButton
            className="primary"
            onClick={handleAccept}
            style={{ marginLeft: 20 }}
            trackingName={trackingName}
          >
            {isHighlighted ? _t('Unmark') : _t('Mark')}
          </TrackedButton>
        </div>
      </Modal>
    );
  }
}

export default HighlightModal;
