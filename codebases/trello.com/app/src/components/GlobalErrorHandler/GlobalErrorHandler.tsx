import React, { Fragment, useEffect, FunctionComponent } from 'react';
import classNames from 'classnames';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('error');

import { HeaderSkeleton } from 'app/src/components/HeaderSkeleton';
import {
  ErrorDetails,
  ErrorHandlerProps,
} from 'app/src/components/ErrorBoundary';

import styles from './GlobalErrorHandler.less';

export const GlobalErrorHandler: FunctionComponent<ErrorHandlerProps> = ({
  caughtError,
}) => {
  useEffect(() => {
    const trelloRoot = document.getElementById('trello-root');
    if (trelloRoot) {
      // Change the background color back to "inherit" to avoid contrast
      // problems on boards with a background color.
      trelloRoot.style.backgroundColor = 'inherit';
      trelloRoot.style.backgroundImage = 'inherit';
    }
  });

  return (
    <Fragment>
      <HeaderSkeleton backgroundColor="#026aa7" />
      <div className={classNames(styles.errorMessage)}>
        <img alt="Taco" src={require('resources/images/taco-sleep.svg')} />
        <h1>{format('global-unhandled')}</h1>
        <p>{format('reload-call-to-action')}</p>
        <p>{format('contact-us')}</p>
        <ErrorDetails caughtError={caughtError} />
      </div>
    </Fragment>
  );
};
