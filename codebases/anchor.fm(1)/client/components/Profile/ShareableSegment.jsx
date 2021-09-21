import React from 'react';

import ShareCenter from '../ShareCenter';
import FadeAnimation from '../FadeAnimation';
import styles from './styles.sass';

const ShareableSegment = ({
  isSharing,
  segmentJSX,
  onCopyShareUrl,
  onHide,
  onShareAction,
  shareUrl,
  shareEmbedHtml,
  stationName,
  episodeName,
  prompt,
}) => (
  <div className={styles.segment}>
    <div className={isSharing ? styles.blurred : ''}>{segmentJSX}</div>

    <FadeAnimation in={!!isSharing} timeout={300}>
      <ShareCenter
        onCopyShareUrl={onCopyShareUrl}
        onHide={onHide}
        onShareAction={onShareAction}
        shareUrl={shareUrl}
        shareEmbedHtml={shareEmbedHtml}
        stationName={stationName}
        episodeName={episodeName}
        prompt={prompt}
      />
    </FadeAnimation>
  </div>
);

export default ShareableSegment;
