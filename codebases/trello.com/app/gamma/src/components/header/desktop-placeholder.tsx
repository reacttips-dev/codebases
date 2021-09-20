/* eslint-disable import/no-default-export */
import React from 'react';
import styles from './header.less';

class DesktopPlaceholder extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <div className={styles.desktopPlaceholder} data-placeholder="desktop" />
    );
  }
}

export default DesktopPlaceholder;
