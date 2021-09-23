import React from 'react';
import classNames from 'classnames';
import {
  isAndroidChrome,
  isIOS,
  windowUndefined,
} from '../../../../../helpers/serverRenderingUtils';
import styles from '../../styles.sass';
import { ASSET_CDN, ASSET_PATH, COPY } from '../../constants';
import { Box } from '../../../../shared/Box';
import { AppStoreDownloadButton } from '../AppStoreDownloadButton';
import ArrowDownIcon from '../../../../shared/Icon/components/ArrowIcon/components/ArrowDownIcon';
import Img from '../../../../components/Img';

const isMobile = isAndroidChrome() || isIOS();

const DesktopHero = ({ language }) => (
  <div className={styles.hero}>
    <div className={styles.heroCopy}>
      <h1 className={classNames(styles.title, styles.white)}>
        {COPY[language].title}
      </h1>
      <p className={classNames(styles.subheader, styles.white)}>
        {COPY[language].subtitle}
      </p>
      <p
        className={classNames(styles.description, styles.white)}
        dangerouslySetInnerHTML={{ __html: COPY[language].description }}
      />
      <Box>
        <AppStoreDownloadButton white />
      </Box>
    </div>
    <div
      className={classNames(styles.imageContainer, styles.heroImageContainer)}
    >
      <Img src={`${ASSET_CDN}${ASSET_PATH}header.png`} />
    </div>
  </div>
);

const MobileHero = ({ language }) => (
  <div className={styles.hero}>
    <h1 className={classNames(styles.title, styles.white, styles.center)}>
      {COPY[language].title}
    </h1>
    <p className={classNames(styles.subheader, styles.white, styles.center)}>
      {COPY[language].subtitle}
    </p>
    <div
      className={classNames(styles.imageContainer, styles.heroImageContainer)}
    >
      <Img src={`${ASSET_CDN}${ASSET_PATH}header.png`} />
    </div>
    <Box display="flex" justifyContent="center">
      <AppStoreDownloadButton white />
    </Box>
    <p
      className={classNames(styles.description, styles.white, styles.center)}
      dangerouslySetInnerHTML={{ __html: COPY[language].description }}
    />
    <div className={styles.arrowDownContainer}>
      <ArrowDownIcon fillColor="#FFF" />
    </div>
  </div>
);
const Hero = ({ language }) =>
  isMobile || windowUndefined() ? (
    <MobileHero language={language} />
  ) : (
    <DesktopHero language={language} />
  );

export { Hero as default, Hero };
