import React from 'react';
import { Box } from '../../shared/Box';
import Img from '../../components/Img';
import styles from './styles.sass';
import { isAndroidChrome, isIOS } from '../../../helpers/serverRenderingUtils';
import { AppStoreDownloadButton } from './components/AppStoreDownloadButton';
import { Hero } from './components/Hero';
import { ASSET_CDN, ASSET_PATH, COPY } from './constants';

const isMobile = isAndroidChrome() || isIOS();

const ValueProp = ({ headline, paragraphs, image, isEven }) => (
  <div className={styles.valueProp}>
    {!isEven && (
      <div className={styles.imageContainer}>
        <Img src={`${ASSET_CDN}${ASSET_PATH}${image}.png`} />
      </div>
    )}
    <div className={styles.copy}>
      <h2 className={styles.title}>{headline}</h2>
      {paragraphs.map((paragraph, i) => (
        <p
          className={styles.subheader}
          dangerouslySetInnerHTML={{ __html: paragraph }}
          key={`${i}-vp-copy`}
        />
      ))}
    </div>
    {isEven && (
      <div className={styles.imageContainer}>
        <Img src={`${ASSET_CDN}${ASSET_PATH}${image}.png`} />
      </div>
    )}
  </div>
);

class QuicksilverAppPage extends React.Component {
  componentDidMount() {
    if (window.ga) {
      window.ga('send', 'pageview');
    }
  }

  render() {
    const { location } = this.props;
    const language = location.pathname.includes('/br') ? 'br' : 'en';
    return (
      <div className={styles.quicksilverLandingPage}>
        <Hero language={language} />
        <div className={styles.valueProps}>
          {COPY[language].valueProps.map((vp, i) => (
            <ValueProp {...vp} key={`${vp.image}`} isEven={i % 2 === 0} />
          ))}
          {isMobile && (
            <Box display="flex" justifyContent="center">
              <AppStoreDownloadButton />
            </Box>
          )}
        </div>
      </div>
    );
  }
}

export default QuicksilverAppPage;
