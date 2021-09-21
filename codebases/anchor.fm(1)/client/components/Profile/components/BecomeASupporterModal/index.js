import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import { Elements } from 'react-stripe-elements';
import styles from './BecomeASupporterModal.sass';
import { PaymentProvider } from '../../../PaymentProvider';
import PaymentScene from './components/PaymentScene';
import ShareScene from './components/ShareScene';
import CloseSvg from '../../../svgs/Close';
import { useListenerSupportOptions } from './hooks/useListenerSupportOptions';

const BecomeASupporterModal = ({
  scene,
  podcastName,
  podcastImageUrl,
  podcastAuthor,
  chosenProductId,
  onSubmitSupport,
  onSelectPerMonthSupportOptionsChoice,
  onHideModal,
  isShowing,
  hasMobileStyling,
  isPaymentProcessing,
  isPreCheckoutMessageFromCreator,
  orderConfirmation,
  preCheckoutMessage,
  shareUrl,
  trackListenerSupportEvent,
  isAndroidChrome,
  isIOS,
}) => {
  const { supportOptions } = useListenerSupportOptions({
    isShowing,
    chosenProductId,
    onSelectPerMonthSupportOptionsChoice,
  });

  return (
    <Modal
      onHide={onHideModal}
      show={isShowing}
      className={`${styles.root} ${
        hasMobileStyling ? styles.rootMobile : styles.rootDesktop
      }`}
      enforceFocus={false}
    >
      <Modal.Body>
        <div className={styles.modalHeader}>
          <button
            aria-label="Close listener support modal"
            className={styles.closeButton}
            onClick={onHideModal}
          >
            <CloseSvg size={18} color="#5f6369" />
          </button>
        </div>
        <div className={`${styles.modalFlex} ${styles.content}`}>
          {(() => {
            const selectedPerMonthSupportOption =
              supportOptions.find(option => option.isChosen) || null;
            switch (scene) {
              case 'pay':
                return (
                  <Elements>
                    <PaymentScene
                      hasMobileStyling={hasMobileStyling}
                      podcastName={podcastName}
                      podcastAuthor={podcastAuthor}
                      podcastImageUrl={podcastImageUrl}
                      perMonthSupportOptions={supportOptions}
                      onSelectPerMonthSupportOptionsChoice={
                        onSelectPerMonthSupportOptionsChoice
                      }
                      selectedPerMonthSupportOption={
                        selectedPerMonthSupportOption
                      }
                      onSubmitSupport={onSubmitSupport}
                      isPaymentProcessing={isPaymentProcessing}
                      isMessageFromCreator={isPreCheckoutMessageFromCreator}
                      trackListenerSupportEvent={trackListenerSupportEvent}
                      isIOS={isIOS}
                      isAndroidChrome={isAndroidChrome}
                      message={preCheckoutMessage}
                    />
                  </Elements>
                );
              case 'share':
                return (
                  <ShareScene
                    hasMobileStyling={hasMobileStyling}
                    podcastName={podcastName}
                    podcastAuthor={podcastAuthor}
                    podcastImageUrl={podcastImageUrl}
                    confirmationCode={orderConfirmation.invoiceNumber}
                    shareUrl={shareUrl}
                  />
                );
              default:
                return null;
            }
          })()}
        </div>
      </Modal.Body>
    </Modal>
  );
};

BecomeASupporterModal.propTypes = {
  podcastName: PropTypes.string.isRequired,
  onSubmitSupport: PropTypes.func.isRequired,
  orderConfirmation: PropTypes.shape({
    orderNumber: PropTypes.string,
  }).isRequired,
  scene: PropTypes.oneOf(['pay', 'share']).isRequired,
  shareUrl: PropTypes.string.isRequired,
};

function BecomeASupporterModalWithProvider(props) {
  return (
    <PaymentProvider>
      <BecomeASupporterModal {...props} />
    </PaymentProvider>
  );
}

export default BecomeASupporterModalWithProvider;
