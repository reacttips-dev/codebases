import { EventContainer } from '@atlassiansox/analytics-web-client';
import { Analytics } from '@trello/atlassian-analytics';
import React, { useEffect } from 'react';

import { EditCardButton, useEditCardButton } from './EditCardButton';
import styles from './SeparatorCard.less';

interface SeparatorCardPropTypes {
  openEditor: () => void;
  isEditable: boolean;
  analyticsContainers: EventContainer;
}

export const SeparatorCard = ({
  openEditor,
  isEditable,
  analyticsContainers,
}: SeparatorCardPropTypes) => {
  const {
    showEditCardButton,
    hideEditCardButton,
    shouldShowEditCardButton,
  } = useEditCardButton();

  useEffect(() => {
    Analytics.sendViewedComponentEvent({
      componentType: 'card',
      componentName: 'separatorCard',
      source: 'cardView',
      containers: analyticsContainers,
    });
  }, [analyticsContainers]);

  return (
    <div
      onFocus={showEditCardButton}
      onBlur={hideEditCardButton}
      onMouseOver={showEditCardButton}
      onMouseOut={hideEditCardButton}
    >
      <span className={styles.separatorCardFront}></span>
      <EditCardButton
        onClick={openEditor}
        shouldShow={isEditable && shouldShowEditCardButton}
      />
    </div>
  );
};
