import React, { useState, useEffect, useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';

import { QrCode, QrCodeType, QrCodeStyle } from './QrCode';
import { useQrCodeQuery } from './QrCodeQuery.generated';

const analyticSource = 'qrCodeSection';

interface QrCodeWrapperProps {
  url: string;
  type?: QrCodeType;
  style?: QrCodeStyle;
}

export const QrCodeWrapper: React.FunctionComponent<QrCodeWrapperProps> = ({
  url,
  type = QrCodeType.board,
  style = QrCodeStyle.popover,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [hasErrored, setErrored] = useState(false);
  const [imageData, setImageData] = useState('');

  const dataHook = useQrCodeQuery({
    variables: { url: url },
  });

  useEffect(() => {
    setLoading(dataHook.loading);

    if (dataHook.error) {
      setErrored(true);
      Analytics.sendOperationalEvent({
        action: 'errored',
        actionSubject: 'qrCode',
        source: analyticSource,
        attributes: {
          type,
          error: dataHook.error,
        },
      });
    } else if (dataHook?.data?.qrCode) {
      setImageData(dataHook.data.qrCode.imageData);
      Analytics.sendOperationalEvent({
        action: 'fetched',
        actionSubject: 'qrCode',
        source: analyticSource,
        attributes: {
          type,
        },
      });
    }
  }, [dataHook, type]);

  const onClickTryAgain = useCallback(() => {
    dataHook.refetch();
  }, [dataHook]);

  return (
    <QrCode
      url={url}
      type={type}
      style={style}
      imageData={imageData}
      hasErrored={hasErrored}
      isLoading={isLoading}
      onTryAgain={onClickTryAgain}
    />
  );
};
