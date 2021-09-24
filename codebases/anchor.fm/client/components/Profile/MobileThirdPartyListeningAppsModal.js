import React from 'react';

import Modal from 'react-bootstrap/lib/Modal';
import CloseSVG from '../svgs/Close';
import StationExternalLinksList from '../StationExternalLinksList';
import styles from './styles.sass';

const MobileThirdPartyListeningAppsModal = ({
  isShowing,
  onHide,
  className,
  podcastUrlDictionary,
  listenOnAnchorUrl,
  isIOS,
  isAndroidChrome,
  referralCode,
  openInAppUrl,
  stationId,
}) => (
  <Modal show={isShowing} onHide={onHide} className={className}>
    <Modal.Body>
      <span className={styles.modalCloseButton} onClick={onHide}>
        <CloseSVG width={15} height={15} color="#5f6369" />
      </span>
      <h5 className={styles.availableOn}>This podcast is available on...</h5>
      <StationExternalLinksList
        anchorPodcastsUrl={listenOnAnchorUrl}
        podcastUrlDictionary={podcastUrlDictionary}
        isIOS={isIOS}
        isAndroidChrome={isAndroidChrome}
        referralCode={referralCode}
        openInAppUrl={openInAppUrl}
        stationId={stationId}
      />
    </Modal.Body>
  </Modal>
);

export default MobileThirdPartyListeningAppsModal;
