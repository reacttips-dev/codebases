import React, { FunctionComponent, useEffect } from 'react';
import { Button } from '@trello/nachos/button';
import { forTemplate } from '@trello/i18n';
import styles from './CardDetailLoadingError.less';

const formatError = forTemplate('error');
const formatConnectFailed = forTemplate('connect_failed');

interface OwnProps {
  onClose?: () => void;
}

const reloadPage = () => window.location.reload();

export const CardDetailLoadingError: FunctionComponent<OwnProps> = (
  props: OwnProps,
) => {
  useEffect(() => {
    const windowHolder = document.querySelector<HTMLElement>('.window');
    if (windowHolder !== null) {
      windowHolder.style.display = 'block';
      document.body.classList.add('window-up');
    }

    return () => {
      if (windowHolder !== null) {
        windowHolder.style.display = 'none';
        document.body.classList.remove('window-up');
      }
    };
  });

  return (
    <div className={`${styles.errorMessage}`}>
      <button
        className={'icon-md icon-close dialog-close-button js-close-window'}
        onClick={props.onClose}
      />
      <div className={'u-clearfix'}>
        <img alt="Taco" src={require('resources/images/taco-sleep.svg')} />
        <h4>{formatError('card-detail-loading-error')}</h4>
        <p>{formatError('reload-call-to-action')}</p>
        <Button appearance={'primary'} onClick={reloadPage}>
          {formatConnectFailed('reload-page')}
        </Button>
      </div>
    </div>
  );
};
