import React, { useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { forNamespace } from '@trello/i18n';
import { Popover, usePopover } from '@trello/nachos/popover';

import { QrCodeWrapper } from './QrCodeWrapper';
import { QrCodeType, QrCodeStyle } from './QrCode';
import styles from './QrCodePopover.less';

const analyticSource = 'qrCodePopover';

const format = forNamespace(['qr_code'], {
  shouldEscapeStrings: false,
});

interface QrCodePopoverProps {
  url: string;
  type?: QrCodeType;
}

export const QrCodePopover: React.FunctionComponent<QrCodePopoverProps> = ({
  url,
  type,
}) => {
  const { popoverProps, toggle, triggerRef } = usePopover<HTMLAnchorElement>({
    onHide: () => {
      Analytics.sendClosedComponentEvent({
        componentType: 'section',
        componentName: 'qrCodeSection',
        source: analyticSource,
        attributes: {
          type,
        },
      });
    },
    onShow: () => {
      Analytics.sendViewedComponentEvent({
        componentType: 'section',
        componentName: 'qrCodeSection',
        source: analyticSource,
        attributes: {
          type,
        },
      });
    },
  });

  const onClickShowQrCode = useCallback(() => {
    toggle();
    Analytics.sendClickedLinkEvent({
      linkName: 'toggleQrCodeLink',
      source: analyticSource,
      attributes: {
        type,
      },
    });
  }, [toggle, type]);

  return (
    <>
      <a
        role="link"
        onClick={onClickShowQrCode}
        ref={triggerRef}
        className={styles.showQrCodeLink}
      >
        {format('show-qr-code')}
      </a>
      <Popover {...popoverProps} title={format('qr-code')}>
        <QrCodeWrapper url={url} type={type} style={QrCodeStyle.popover} />
      </Popover>
    </>
  );
};
