import React from 'react';
import classNames from 'classnames';

import Link from '../Link';

import styles from './styles.sass';

const LegalTabNavigation = ({ pathname }) => (
  <ul className={styles.list}>
    <li
      className={classNames(styles.listItem, {
        [styles.listItemSelected]: pathname === '/tos',
      })}
    >
      <Link
        to="/tos"
        className={classNames(styles.link, {
          [styles.selected]: pathname === '/tos',
        })}
        aria-current={pathname === '/tos' ? 'page' : null}
      >
        Terms of Service
      </Link>
    </li>
    <li
      className={classNames(styles.listItem, {
        [styles.listItemSelected]: pathname === '/privacy',
      })}
    >
      <Link
        to="/privacy"
        className={classNames(styles.link, {
          [styles.selected]: pathname === '/privacy',
        })}
        aria-current={pathname === '/privacy' ? 'page' : null}
      >
        Privacy Policy
      </Link>
    </li>
    <li
      className={classNames(styles.listItem, {
        [styles.listItemSelected]: pathname === '/dmca',
      })}
    >
      <Link
        to="/dmca"
        className={classNames(styles.link, {
          [styles.selected]: pathname === '/dmca',
        })}
        aria-current={pathname === '/dmca' ? 'page' : null}
      >
        DMCA
      </Link>
    </li>
  </ul>
);

export { LegalTabNavigation };
