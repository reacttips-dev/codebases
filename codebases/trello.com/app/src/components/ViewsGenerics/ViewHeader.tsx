import React, { useCallback, useMemo } from 'react';
import cx from 'classnames';

import {
  Analytics,
  ActionSubjectIdType,
  SourceType,
} from '@trello/atlassian-analytics';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { BackIcon } from '@trello/nachos/icons/back';
import { Button } from '@trello/nachos/button';
import { CloseIcon } from '@trello/nachos/icons/close';
import { ForwardIcon } from '@trello/nachos/icons/forward';
import { ViewHeaderTestIds } from '@trello/test-ids';

import { forTemplate } from '@trello/i18n';

import { DateButton } from './DateButton';
import {
  GroupByOption,
  NavigationDirection,
  ViewType,
  ZoomLevel,
  BetaPhase,
} from './types';
import { ViewHeaderDropdown } from './ViewHeaderDropdown';
import { ViewsFeedbackHeader } from './ViewsFeedbackHeader';

import styles from './ViewHeader.less';

const format = forTemplate('views');

interface ViewHeaderProps {
  viewName: ViewType;
  dateText: string;
  closeView?: () => void;
  onNavigate: (direction: NavigationDirection | null, newDate?: Date) => void;
  // if we are "refetching" because a change not detected by our current
  // cache syncing was made.
  isLoading?: boolean;
  // Zoom options
  isZoomLevelEnabled?: boolean;
  currentZoom?: ZoomLevel;
  zoomOptions?: ZoomLevel[];
  changeZoom?: (zoom: ZoomLevel) => void;
  // Group By Options
  isGroupByEnabled?: boolean;
  currentGroupBy?: GroupByOption;
  groupByOptions?: GroupByOption[];
  changeGrouping?: (zoom: GroupByOption) => void;
  hideUnscheduledPopover?: () => void;
  analyticsContainers: {
    board?: { id: string | null };
    organization?: { id: string | null };
    enterprise?: { id: string | null };
  };
  feedbackLink?: string;
  orgId?: string | null;
  betaPhase?: BetaPhase;
  settingsComponent?: React.ReactElement;
  events?: { start: Date; end: Date }[];
  defaultDate?: Date;
  shouldNotNavigate?: (day: Date) => boolean;
  disableCalPopoverOnLarge?: boolean;
}

export const ViewHeader: React.FunctionComponent<ViewHeaderProps> = ({
  viewName,
  dateText,
  closeView,
  onNavigate,
  isLoading = false,
  isZoomLevelEnabled = false,
  currentZoom = null,
  zoomOptions = [],
  changeZoom = () => {},
  isGroupByEnabled = false,
  currentGroupBy = null,
  groupByOptions = [],
  changeGrouping = () => {},
  hideUnscheduledPopover,
  analyticsContainers,
  feedbackLink,
  orgId,
  betaPhase,
  settingsComponent,
  events = [],
  defaultDate = new Date(),
  shouldNotNavigate,
  disableCalPopoverOnLarge,
}) => {
  let viewScreen: SourceType = 'calendarViewScreen';
  let zoomInlineDialog: SourceType = 'calendarZoomLevelInlineDialog';
  let closeButton: ActionSubjectIdType = 'calendarCloseViewButton';
  let zoomDropdownItem: ActionSubjectIdType = 'calendarZoomLevelDropdownItem';
  let navLeftButton: ActionSubjectIdType = 'calendarScrollLeftButton';
  let navRightButton: ActionSubjectIdType = 'calendarScrollRightButton';
  let navTodayButton: ActionSubjectIdType = 'calendarScrollToTodayButton';
  if (viewName === ViewType.TIMELINE) {
    viewScreen = 'timelineViewScreen';
    closeButton = 'timelineCloseViewButton';
    zoomDropdownItem = 'timelineZoomLevelDropdownItem';
    zoomInlineDialog = 'timelineZoomLevelInlineDialog';
    navLeftButton = 'timelineScrollLeftButton';
    navRightButton = 'timelineScrollRightButton';
    navTodayButton = 'timelineScrollToTodayButton';
  }

  const trackHeaderButtonClick = useCallback(
    (buttonName: ActionSubjectIdType) => {
      Analytics.sendClickedButtonEvent({
        buttonName,
        source: viewScreen,
        containers: analyticsContainers,
        attributes: {
          grouping: currentGroupBy,
          currentZoom,
        },
      });
    },
    [analyticsContainers, currentGroupBy, currentZoom, viewScreen],
  );

  const closeButtonComponent = useMemo(() => {
    if (closeView) {
      const handleCloseButtonClick = () => {
        closeView && closeView();
        trackHeaderButtonClick(closeButton);
      };

      return (
        <div
          className={styles.closeButton}
          data-test-id={ViewHeaderTestIds.CloseButton}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={handleCloseButtonClick}
          tabIndex={0}
          role="button"
        >
          <CloseIcon size="large" color="dark" />
        </div>
      );
    }
  }, [closeButton, closeView, trackHeaderButtonClick]);

  const renderZoom = () => {
    if (isZoomLevelEnabled && currentZoom) {
      return (
        <>
          <span className={styles.divider}></span>
          <ViewHeaderDropdown
            options={zoomOptions}
            currentOption={currentZoom}
            onChangeOption={changeZoom}
            hideUnscheduledPopover={hideUnscheduledPopover}
            // eslint-disable-next-line react/jsx-no-bind
            sendTrackingEvent={(zoomLevel: ZoomLevel) => {
              Analytics.sendUIEvent({
                action: 'clicked',
                actionSubject: 'dropdownItem',
                actionSubjectId: zoomDropdownItem,
                source: zoomInlineDialog,
                containers: analyticsContainers,
                attributes: {
                  zoomLevel,
                },
              });
            }}
          />
        </>
      );
    }
  };

  const renderGrouping = () => {
    if (isGroupByEnabled && currentGroupBy) {
      return (
        <ViewHeaderDropdown
          options={groupByOptions}
          currentOption={currentGroupBy}
          onChangeOption={changeGrouping}
          hideUnscheduledPopover={hideUnscheduledPopover}
          // eslint-disable-next-line react/jsx-no-bind
          sendTrackingEvent={(groupBy: GroupByOption) => {
            Analytics.sendUIEvent({
              action: 'clicked',
              actionSubject: 'dropdownItem',
              actionSubjectId: 'timelineGroupByDropdownItem',
              source: 'timelineGroupByInlineDialog',
              containers: analyticsContainers,
              attributes: {
                groupBy,
              },
            });
          }}
        />
      );
    }
  };

  const isJumpToCalendarEnabled = useFeatureFlag(
    'ecosystem.views-jump-to-calendar',
    false,
  );

  return (
    <div className={styles.headerContainer}>
      <div className={cx(styles.headerSection, styles.leftSection)}>
        {isJumpToCalendarEnabled ? (
          <DateButton
            viewName={viewName}
            dateText={dateText}
            // eslint-disable-next-line react/jsx-no-bind
            onNavigateToDate={(newDate: Date) => {
              // TODO Analytics
              onNavigate(null, newDate);
            }}
            events={events}
            defaultDate={defaultDate}
            shouldNotNavigate={shouldNotNavigate}
            disableCalPopoverOnLarge={disableCalPopoverOnLarge}
            analyticsContainers={analyticsContainers}
          />
        ) : (
          <div className={styles.dateText}>{dateText}</div>
        )}
        <div className={styles.navigationButtons}>
          <Button
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              onNavigate(NavigationDirection.PREV);
              trackHeaderButtonClick(navLeftButton);
            }}
            className={styles.navigationButton}
            data-test-id={ViewHeaderTestIds.PreviousButton}
            iconBefore={<BackIcon size="small" />}
          />
          <Button
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              onNavigate(NavigationDirection.TODAY);
              trackHeaderButtonClick(navTodayButton);
            }}
            className={styles.navigationButton}
            data-test-id={ViewHeaderTestIds.TodayButton}
          >
            {format('today')}
          </Button>
          <Button
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              onNavigate(NavigationDirection.NEXT);
              trackHeaderButtonClick(navRightButton);
            }}
            className={styles.navigationButton}
            data-test-id={ViewHeaderTestIds.NextButton}
            iconBefore={<ForwardIcon size="small" />}
          />
          {renderZoom()}
          {renderGrouping()}
        </div>
        {isLoading && <span className={styles.loading}>Loading...</span>}
      </div>
      <div className={cx(styles.headerSection, styles.rightSection)}>
        {feedbackLink && (
          <ViewsFeedbackHeader
            feedbackLink={feedbackLink}
            // TODO maybe use BoardViewContext?
            orgId={orgId}
            betaPhase={betaPhase}
          />
        )}
        {settingsComponent}
        {closeButtonComponent}
      </div>
    </div>
  );
};
