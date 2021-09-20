import React, { useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { Button, ButtonLink } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';
import { forNamespace } from '@trello/i18n';

import styles from './QrCode.less';

const errorImg = require('resources/images/qr-code/error.svg');

const analyticSource = 'qrCodeSection';

const format = forNamespace(['qr_code'], {
  shouldEscapeStrings: false,
});

export enum QrCodeType {
  board = 'board',
  card = 'card',
  boardInvite = 'board-invite',
  teamInvite = 'workspace-invite',
}

export enum QrCodeStyle {
  popover = 'popover',
  inline = 'inline',
}

interface QrCodeProps {
  url: string;
  type?: QrCodeType;
  style?: QrCodeStyle;
  imageData?: string;
  hasErrored?: boolean;
  isLoading?: boolean;
  onTryAgain?: () => void;
}

export const QrCode: React.FunctionComponent<QrCodeProps> = ({
  url,
  type = QrCodeType.board,
  style = QrCodeStyle.popover,
  imageData = '',
  hasErrored = false,
  isLoading = false,
  onTryAgain = () => {},
}) => {
  const onClickDownload = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'downloadButton',
      source: analyticSource,
      attributes: {
        type,
      },
    });
  }, [type]);

  const onClickTryAgain = useCallback(() => {
    onTryAgain();

    Analytics.sendClickedButtonEvent({
      buttonName: 'tryAgainButton',
      source: analyticSource,
      attributes: {
        type,
      },
    });
  }, [onTryAgain, type]);

  const renderQrCode = () => {
    if (isLoading) {
      return (
        <Spinner centered={true} wrapperClassName={styles.qrCodeSpinner} />
      );
    }
    if (hasErrored || !imageData) {
      return <img src={errorImg} alt={format('error')} key="errorImage" />;
    }
    return (
      <>
        <img
          src={imageData}
          alt={`${format('qr-code')} for: ${url}`}
          key="qrCodeImage"
        />
        <i className={styles.top} />
        <i className={styles.bottom} />
      </>
    );
  };

  const renderText = () => {
    if (!isLoading && (hasErrored || !imageData)) {
      return format('something-went-wrong');
    }
    return format(`${type}-text`);
  };

  const renderDownloadButton = () => {
    if (isLoading) {
      return (
        <Button isDisabled={true} className={styles.button}>
          {format('download')}
        </Button>
      );
    }
    if (hasErrored || !imageData) {
      return (
        <Button onClick={onClickTryAgain} className={styles.button}>
          {format('try-again')}
        </Button>
      );
    }
    return (
      <ButtonLink
        link={imageData}
        download={`trello-${type}-qr-code.png`}
        isPrimary={true}
        onClick={onClickDownload}
        className={styles.button}
      >
        {format('download')}
      </ButtonLink>
    );
  };

  if (style === QrCodeStyle.inline) {
    return (
      <div className={styles.qrCodeInline}>
        <div className={styles.qrCodeImage}>{renderQrCode()}</div>
        <div>
          <p>{renderText()}</p>
          <p>{renderDownloadButton()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.qrCodeContent}>
      {renderText()}
      <div className={styles.qrCodeImage}>{renderQrCode()}</div>
      {renderDownloadButton()}
    </div>
  );
};
