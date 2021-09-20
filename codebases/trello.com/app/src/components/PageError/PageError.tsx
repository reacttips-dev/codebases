import React, { FunctionComponent } from 'react';
import { forTemplate } from '@trello/i18n';

const format = forTemplate('error');

import styles from './PageError.less';

export const PageError: FunctionComponent = () => (
  <div className={styles.errorMessage}>
    <img alt="Taco" src={require('resources/images/taco-sleep.svg')} />
    <h1>{format('global-unhandled')}</h1>
    <p>{format('reload-call-to-action')}</p>
    <p>{format('contact-us')}</p>
  </div>
);
