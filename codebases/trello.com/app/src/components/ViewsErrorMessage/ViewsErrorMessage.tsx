import React, { useEffect } from 'react';
import styles from './ViewsErrorMessage.less';
import { forTemplate } from '@trello/i18n';
import { Analytics } from '@trello/atlassian-analytics';
import { EventContainer } from '@atlassiansox/analytics-web-client';
import { SourceType } from '@trello/atlassian-analytics/src/constants/Source';
const format = forTemplate('error');

interface ViewsErrorMessageProps {
  headerMessage?: string;
  secondaryMessage?: string;
  screenEventName: SourceType;
  analyticsContainers?: EventContainer;
  analyticsAttributes?: object;
}

export const ViewsErrorMessage: React.FC<ViewsErrorMessageProps> = ({
  headerMessage = format('we-couldnt-load-this-view'),
  secondaryMessage = format('try-refreshing-the-page'),
  screenEventName,
  analyticsContainers = {},
  analyticsAttributes = {},
}: ViewsErrorMessageProps) => {
  useEffect(() => {
    Analytics.sendScreenEvent({
      name: screenEventName,
      containers: analyticsContainers,
      attributes: analyticsAttributes,
    });
  }, [screenEventName, analyticsContainers, analyticsAttributes]);

  return (
    <>
      <h1 className={styles.headerMessage}>{headerMessage}</h1>
      <p className={styles.secondaryMessage}>{secondaryMessage}</p>
    </>
  );
};
