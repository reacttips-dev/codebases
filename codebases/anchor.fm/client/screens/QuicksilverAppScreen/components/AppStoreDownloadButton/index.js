import React from 'react';
import {
  isAndroidChrome,
  isIOS,
} from '../../../../../helpers/serverRenderingUtils';
import {
  AppStoreButton,
  PlayStoreButton,
} from '../../../../components/AppDownloadButtons';

const AppStoreDownloadButton = ({
  white,
  width,
  clickEventLocation,
  clickEventSection,
  appStoreUrl,
  playStoreUrl,
}) => {
  if (isAndroidChrome())
    return (
      <PlayStoreButton
        clickEventLocation={clickEventLocation}
        clickEventSection={clickEventSection}
        width={width}
        to={playStoreUrl}
      />
    );
  if (isIOS())
    return (
      <AppStoreButton
        clickEventLocation={clickEventLocation}
        clickEventSection={clickEventSection}
        width={width}
        white={white}
        to={appStoreUrl}
      />
    );
  return (
    <AppStoreButton
      clickEventLocation={clickEventLocation}
      clickEventSection={clickEventSection}
      width={width}
      white={white}
      to={appStoreUrl}
    />
  );
};

AppStoreDownloadButton.defaultProps = {
  width: 181,
};

export { AppStoreDownloadButton as default, AppStoreDownloadButton };
