import React, { Suspense } from 'react';
import cx from 'classnames';
import { Analytics } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';
import { useLazyComponent } from '@trello/use-lazy-component';
import { usePopover } from '@trello/nachos/popover';
import { forNamespace } from '@trello/i18n';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { Controller } from 'app/scripts/controller';
import { toggleButler } from '../showButlerDirectory';
import {
  FeatureId,
  NewPill,
  useNewFeature,
} from 'app/src/components/NewFeature';
import styles from './ButlerBoardButtons.less';
import { sendPluginUIEvent } from 'app/scripts/lib/plugins/plugin-behavioral-analytics';
import { useHasButlerAccess } from '../useHasButlerAccess';
import { ButlerAlert, showButlerAlert } from '../showButlerAlert';

import { Auth } from 'app/scripts/db/auth';
import { BUTLER_POWER_UP_ID } from 'app/scripts/data/butler-id';

const format = forNamespace('butler');

import {
  ButlerPluginDataQuery,
  useButlerPluginDataQuery,
} from './ButlerPluginDataQuery.generated';

const getSuggestions = (
  data: ButlerPluginDataQuery | undefined,
): ButlerSuggestion => {
  const pluginData = data?.board?.pluginData.find(
    ({ access, idPlugin }) =>
      idPlugin === BUTLER_POWER_UP_ID && access === 'private',
  );
  if (pluginData) {
    try {
      const parsedValue = JSON.parse(pluginData.value);
      return parsedValue?.suggestions || {};
    } catch (e) {
      return {};
    }
  }
  return {};
};
export interface ButlerBoardButtonsProps {
  idBoard: string;
}

interface ButlerSuggestion {
  dateLastSeen?: string;
  dateLastUpdated?: string;
  counts?: object;
}

export const ButlerBoardButtons: React.FunctionComponent<ButlerBoardButtonsProps> = ({
  idBoard,
}) => {
  const { data } = useButlerPluginDataQuery({
    variables: {
      idBoard,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });
  const showPopover = useFeatureFlag('workflowers.butler-popover-menu', false);
  const showReports = useFeatureFlag(
    'workflowers.show-automatic-reports',
    false,
  );
  const { acknowledgeNewFeature } = useNewFeature(FeatureId.AutomaticReports);

  const suggestions = React.useMemo(() => getSuggestions(data), [data]);
  const isLightBackground =
    data?.board?.prefs?.backgroundBrightness === 'light';

  const hasButlerAccess = useHasButlerAccess(idBoard);

  const getIconUrl = () => {
    return isLightBackground
      ? `${require('resources/images/butler/automation-dark.svg')}`
      : `${require('resources/images/butler/automation-light.svg')}`;
  };

  const getButtonTitle = () => {
    const counts = suggestions.counts || {};
    const total: number = Object.values(counts).reduce<number>(
      (total: number, count: number): number => total + count,
      0,
    );

    const renderTips = () => {
      if (total > 1) {
        return `(${total} Tips)`;
      } else if (total > 0) {
        return `(${total} Tip)`;
      }
      return '';
    };

    return (
      <>
        {format('automation')} {renderTips()}
        {showReports ? (
          <span className={styles.newPill}>
            <NewPill
              featureId={FeatureId.AutomaticReports}
              source="automaticReportsInlineDialog"
            />
          </span>
        ) : null}
      </>
    );
  };

  const ButlerBoardButtonPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "butler-board-button-popover" */ './ButlerBoardButtonPopover'
      ),
    { namedImport: 'ButlerBoardButtonPopover' },
  );

  const {
    popoverProps: butlerBoardBtnPopoverProps,
    triggerRef: butlerBoardBtnTriggerRef,
    toggle: toggleButlerBoardBtnPopover,
    push: pushButlerBoardBtnPopoverScreen,
    pop: popButlerBoardBtnPopoverScreen,
    hide: hideButlerBoardBtnPopover,
  } = usePopover<HTMLButtonElement>();

  const onClickButlerButton = () => {
    sendPluginUIEvent({
      idPlugin: BUTLER_POWER_UP_ID,
      idBoard,
      event: {
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'powerUpBoardButton',
        source: 'boardScreen',
      },
    });

    const currentBoardView = Controller.getCurrentBoardView();
    if (Controller.showingAutomaticReports()) {
      currentBoardView?.closeAutomaticReports();
    } else if (!Auth.confirmed()) {
      showButlerAlert(ButlerAlert.Unauthorized);
    } else if (showPopover && !currentBoardView?.isButlerViewActive()) {
      toggleButlerBoardBtnPopover();
      if (showReports) {
        acknowledgeNewFeature({
          source: 'automaticReportsInlineDialog',
        });
      }
      Analytics.sendScreenEvent({
        name: 'butlerReportInlineDialog',
      });
    } else {
      toggleButler();
    }
  };

  if (!hasButlerAccess) {
    return null;
  }

  return (
    <>
      <Button
        className={styles.butlerBoardButton}
        appearance={isLightBackground ? 'transparent-dark' : 'transparent'}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={onClickButlerButton}
        ref={butlerBoardBtnTriggerRef}
        tabIndex={0}
      >
        <span
          className={cx('icon-sm', 'recolorable', styles.boardButtonIcon)}
          style={{
            backgroundImage: `url(${getIconUrl()})`,
          }}
        />
        <span>{getButtonTitle()}</span>
      </Button>
      <Suspense fallback={null}>
        <ButlerBoardButtonPopover
          idBoard={idBoard}
          popoverProps={butlerBoardBtnPopoverProps}
          push={pushButlerBoardBtnPopoverScreen}
          pop={popButlerBoardBtnPopoverScreen}
          hide={hideButlerBoardBtnPopover}
        />
      </Suspense>
    </>
  );
};
