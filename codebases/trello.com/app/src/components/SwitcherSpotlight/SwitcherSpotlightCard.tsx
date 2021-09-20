import React, { useCallback, useEffect } from 'react';
import { Facepile } from 'app/src/components/Facepile';
import { CloseIcon } from '@trello/nachos/icons/close';
import styles from './SwitcherSpotlightCard.less';
import { forwardRefComponent } from 'app/src/forwardRefComponent';
import { forTemplate } from '@trello/i18n';
import { ProductName } from './types';
import { Key, getKey } from '@trello/keybindings';

const format = forTemplate('header_switcher_spotlight');

export interface SwitcherSpotlightCardProps {
  memberIds?: string[];
  maxFaceCount?: number;
  product?: ProductName;
  onClose?: () => void;
}

export const SwitcherSpotlightCard = forwardRefComponent<
  HTMLDivElement,
  SwitcherSpotlightCardProps
>(
  'SwitcherSpotlightCard',
  ({ memberIds = [], maxFaceCount = 3, product, onClose }, ref) => {
    if (!memberIds.length || !product) {
      return null;
    }

    const close = useCallback(() => onClose?.(), [onClose]);

    // Hide card on pressing ESC key
    useEffect(() => {
      const escHandler = (e: KeyboardEvent) => {
        if (getKey(e) === Key.Escape) {
          close();
        }
      };

      document.addEventListener('keydown', escHandler);
      return () => {
        document.removeEventListener('keydown', escHandler);
      };
    }, [close]);

    return (
      <div
        className={styles.spotlightCardWrapper}
        ref={ref}
        data-test-id="atlassian-app-switcher-nudge-spotlight-card"
        role="dialog"
      >
        <button
          onClick={close}
          className={styles.spotlightCardClose}
          aria-label="Close Icon"
          data-test-id="atlassian-app-switcher-nudge-spotlight-card-close-button"
        >
          <CloseIcon size="small" color="gray" />
        </button>
        <div className={styles.spotlightCardFacepile}>
          <Facepile memberIds={memberIds} maxFaceCount={maxFaceCount} />
        </div>
        <p className={styles.spotlightCardTitle}>
          {format('spotlight-title', { count: memberIds.length, product })}
        </p>
        <p className={styles.spotlightCardText}>
          {format(`spotlight-body-${product.toLowerCase()}`)}
        </p>
      </div>
    );
  },
);
