import React, { Component } from 'react';
import WaitIndicator from '../WaitIndicator';
import styles from './styles.sass';

export default function RedirectingInterstitial() {
  return (
    <div className="isV2LegacyPage">
      <div className={styles.loading}>
        <WaitIndicator size={80} className={styles.loadingCentered} />
      </div>
      <h3 className={styles.redirectingLabel}>Redirecting…</h3>
    </div>
  );
}
