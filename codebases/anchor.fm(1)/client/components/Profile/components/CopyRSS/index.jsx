import React, { useState } from 'react';
import { getFeedUrl } from '../../../../../helpers/serverRenderingUtils';
import RSS from '../../../svgs/RSS';
import { Pressable } from '../../../../shared/Pressable/index.tsx';
import { Hoverable } from '../../../../shared/Hoverable/index.tsx';
import { copyTextToClipboard } from '../../../../utils';

import styles from '../../styles.sass';
import platformStyles from './styles.sass';

const CopyRSS = ({ stationId }) => {
  const [isCopied, setisCopied] = useState(false);
  return (
    <Pressable
      onPress={() => {
        setisCopied(true);
        copyTextToClipboard(getFeedUrl(stationId));
        setTimeout(() => setisCopied(false), 1000);
      }}
    >
      {() => (
        <Hoverable>
          {({ isHovering }) => (
            <div className={platformStyles.iconWrapper}>
              <RSS
                width={28}
                height={28}
                className={styles.stationExternalLinkImage}
              />
              {isHovering && (
                <p className={platformStyles.text}>
                  {isCopied ? 'Copied!' : 'Copy RSS'}
                </p>
              )}
            </div>
          )}
        </Hoverable>
      )}
    </Pressable>
  );
};

export { CopyRSS };
