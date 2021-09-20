import React, { useCallback, useContext, useMemo } from 'react';
import { Button } from '@trello/nachos/button';
import {
  ViewFiltersContext,
  constructNewUrl,
} from 'app/src/components/ViewFilters';
import { ExternalLinkIcon } from '@trello/nachos/icons/external-link';
import {
  ActionSubjectIdType,
  SourceType,
  Analytics,
} from '@trello/atlassian-analytics';
import { defaultRouter } from 'app/src/router';
import { TableTestIds } from '@trello/test-ids';
import { forTemplate } from '@trello/i18n';

import styles from './CustomizeViewButton.less';
import { EventContainer } from '@atlassiansox/analytics-web-client';

const format = forTemplate('multi_board_table_view');
interface CustomizeViewButtonProps {
  orgId: string;
  pathname: string; // Root of the URL the button should navigate to onClick
}

export const CustomizeViewButton: React.FunctionComponent<CustomizeViewButtonProps> = function CustomizeViewButton({
  orgId,
  pathname,
}) {
  const buttonName: ActionSubjectIdType = 'customizeViewButton';
  const source: SourceType = 'WorkspaceDefaultMyWorkViewScreen';
  const analyticsContainer: EventContainer = useMemo(
    () => ({
      organization: {
        id: orgId,
      },
    }),
    [orgId],
  );

  const { viewFilters } = useContext(ViewFiltersContext);
  const routeContext = defaultRouter.getRoute();
  const newUrl = constructNewUrl(routeContext)?.(viewFilters.filters);

  const trackCustomizeViewButtonClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName,
      source,
      containers: analyticsContainer,
    });
  }, [analyticsContainer]);

  function handleCustomizeViewButtonClick() {
    defaultRouter.setRoute(pathname + newUrl?.search ?? '');
    trackCustomizeViewButtonClick();
  }

  return (
    <Button
      type="button"
      className={styles.customizeViewButton}
      iconBefore={<ExternalLinkIcon />}
      onClick={handleCustomizeViewButtonClick}
      testId={TableTestIds.CustomizeViewButton}
      children={format('customize-view')}
    />
  );
};
