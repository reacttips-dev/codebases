import React, { useState, useCallback, useEffect } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { forNamespace } from '@trello/i18n';

import { QrCodeWrapper } from './QrCodeWrapper';
import { QrCodeType, QrCodeStyle } from './QrCode';
import styles from './QrCodeToggle.less';

const analyticSource = 'qrCodeToggle';

const format = forNamespace(['qr_code'], {
  shouldEscapeStrings: false,
});

interface QrCodeToggleProps {
  url: string;
  type?: QrCodeType;
}

export const QrCodeToggle: React.FunctionComponent<QrCodeToggleProps> = ({
  url,
  type,
}) => {
  const [isVisible, setVisiblity] = useState(false);

  useEffect(() => {
    if (isVisible) {
      Analytics.sendViewedComponentEvent({
        componentType: 'section',
        componentName: 'qrCodeSection',
        source: analyticSource,
        attributes: {
          type,
        },
      });
    } else {
      Analytics.sendClosedComponentEvent({
        componentType: 'section',
        componentName: 'qrCodeSection',
        source: analyticSource,
        attributes: {
          type,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const onClickToggleQrCode = useCallback(() => {
    setVisiblity(!isVisible);

    Analytics.sendClickedLinkEvent({
      linkName: 'toggleQrCodeLink',
      source: analyticSource,
      attributes: {
        type,
      },
    });
  }, [isVisible, type]);

  return (
    <>
      <a
        role="link"
        onClick={onClickToggleQrCode}
        className={styles.showQrCodeLink}
      >
        {isVisible ? format('hide-qr-code') : format('show-qr-code')}
      </a>
      {isVisible ? (
        <QrCodeWrapper url={url} type={type} style={QrCodeStyle.inline} />
      ) : null}
    </>
  );
};
