import React from 'react';
import styled from '@emotion/styled';
import Img from '../../../Img';
import { trackPressThirdPartyPlatformIconClick } from '../../events';

import styles from '../../styles.sass';
import platformStyles from '../CopyRSS/styles.sass';

const ListeningPlatform = ({ link, attributes }) => (
  <div className={platformStyles.wrapper}>
    <PlatformLink
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackPressThirdPartyPlatformIconClick(attributes.displayName);
      }}
    >
      <div className={platformStyles.iconWrapper}>
        <Img
          alt={`${attributes.displayName} Logo`}
          src={`https://d12xoj7p9moygp.cloudfront.net/images/podcast/logo-square/006/${attributes.src}`}
          withRetina
          width={28}
          height={28}
          className={styles.stationExternalLinkImage}
        />
        <p className={platformStyles.text}>{attributes.displayName}</p>
      </div>
    </PlatformLink>
  </div>
);

const PlatformLink = styled.a`
  display: inline-block;
  p {
    visibility: hidden;
  }
  &:hover p {
    visibility: visible;
  }
`;

export { ListeningPlatform };
