import React, { Component } from 'react';
import { config } from 'config';
import { Logo as InlineLogo } from '@udacity/veritas-components';
import styles from './header.module.scss';

export default class Header extends Component {
  render() {
    const redirectUrl = config.REDIRECT_URL;

    return (
      <div className={styles.header}>
        <a href={redirectUrl}>
          <div className={styles['logo-container']}>
            <InlineLogo />
          </div>
        </a>
      </div>
    );
  }
}
