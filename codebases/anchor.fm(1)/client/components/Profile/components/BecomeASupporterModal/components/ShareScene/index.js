import React from 'react';
import PropTypes from 'prop-types';
import ShareLinks from '../../../../../ShareLinks';
import styles from './ShareScene.sass';
import ContentHeader from '../ContentHeader';

const ShareScene = ({
  podcastName,
  podcastImageUrl,
  podcastAuthor,
  hasMobileStyling,
  confirmationCode,
  shareUrl,
}) => (
  <div className={styles.root}>
    <div className={styles.thanksSection}>
      <ContentHeader
        headerTitle="You're a supporter!"
        hasMobileStyling={hasMobileStyling}
        podcastImageUrl={podcastImageUrl}
        podcastName={podcastName}
        podcastAuthor={podcastAuthor}
        contentDescription={
          <div className={styles.thankYouText}>
            Thanks for supporting this podcast! If you ever want to adjust your
            subscription, you can do that at any time from the email
            confirmation we sent to you.
          </div>
        }
        confirmationCode={confirmationCode}
      />
    </div>
    <div className={styles.spaceSection} />
    <div className={styles.shareSection}>
      <div className={styles.shareLinksSeparator}>
        Tell your friends you're a supporter of this podcast!
      </div>

      <div className={styles.shareLinksContainer}>
        <ShareLinks
          url={shareUrl}
          text={`I just became a supporter of ${podcastName}! You can support this podcast too:`}
        />
      </div>
    </div>
  </div>
);

ShareScene.propTypes = {
  orderConfirmation: PropTypes.shape({
    orderNumber: PropTypes.string,
  }).isRequired,
};

export default ShareScene;
