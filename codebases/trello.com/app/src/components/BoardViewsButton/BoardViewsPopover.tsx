import React, { useCallback, useEffect } from 'react';
import cx from 'classnames';

import { Analytics } from '@trello/atlassian-analytics';
import { forTemplate, forNamespace } from '@trello/i18n';
import { UpgradePromptPill } from 'app/src/components/UpgradePrompts';
import { Tooltip } from '@trello/nachos/tooltip';
import { BusinessClassIcon } from '@trello/nachos/icons/business-class';
import { useSeesVersionedVariation } from '@trello/feature-flag-client';

import { Lozenge } from 'app/src/components/Lozenge';
import styles from './BoardViewsPopover.less';
import { GlyphProps } from '@trello/nachos/icons/list';
import { WorkspaceViewsLink } from './WorkspaceViewsLink';
import { PowerUpViewOptions } from './PowerUpViewOptions';
import { BoardHeaderTestIds } from '@trello/test-ids';

const format = forTemplate('board-views');
const formatPrompt = forNamespace('upgrade prompt');

export interface ViewOption {
  name: string;
  descriptionString: string;
  icon: React.FunctionComponent<GlyphProps>;
  showUpsell?: boolean;
  navigateTo: () => void;
  track: () => void;
  isVisible: boolean;
  isBeta?: boolean;
  //A view that is generally available will not trigger a
  //"new" pill on the board views switcher
  isGA?: boolean;
  testId?: string;
}

export interface PowerUpViewOption {
  idPlugin: string;
  name: string;
  key: string;
  icon: string;
  description?: string;
  navigateTo: () => void;
}

export interface BoardViewsPopoverProps {
  idBoard: string;
  shortLink: string;
  orgName?: string;
  idOrg?: string;
  isOrgPrivate?: boolean;
  paidStatus?: 'enterprise' | 'bc' | 'standard' | 'free';
  shouldShowTeamTableLink?: boolean;
  hidePopover: () => void;
  currentView: string;
  viewOptions: ViewOption[];
  clearFilters: () => void;
  isLoadingPowerUpViews: boolean;
  powerUpViewOptions: PowerUpViewOption[];
  currentPowerUpView?: {
    idPlugin?: string;
    key?: string;
  };
  hasViewsFeature: boolean;
}

interface TooltipListItemProps {
  showTooltip: boolean;
  children: React.ReactNode;
}

const TooltipListItem: React.FunctionComponent<TooltipListItemProps> = ({
  showTooltip,
  children,
}) => {
  if (showTooltip) {
    return (
      <Tooltip tag="li" content={format('limit-upsell')} delay={100}>
        {children}
      </Tooltip>
    );
  }

  return <li>{children}</li>;
};

function ViewOption({
  option,
  selected,
  clearFilters,
  orgName,
  onClickUpsell,
}: {
  option: ViewOption;
  selected: boolean;
  onClickUpsell: () => void;
} & Pick<BoardViewsPopoverProps, 'clearFilters' | 'orgName'>) {
  const viewName = format(option.name);
  const viewDesc = format(option.descriptionString);
  const buttonIcon = React.createElement(option.icon, { size: 'small' });
  const betaPill = <Lozenge color="blue">{format('beta')}</Lozenge>;

  const ctaLink = orgName ? `/${orgName}/billing` : '/select-team-to-upgrade';

  const upsellPill = (
    <UpgradePromptPill
      ctaLink={ctaLink}
      icon={<BusinessClassIcon />}
      cta={formatPrompt('upgrade team')}
      ctaOnClick={onClickUpsell}
    />
  );

  const onClick = useCallback(() => {
    if (option.showUpsell) {
      return;
    }
    option.track();
    option.navigateTo();
    // Board filters do not affect dashboard yet.
    // Currently removing filters when switching to those views.
    if (option.name === 'dashboard') {
      clearFilters();
    }
  }, [clearFilters, option]);

  return (
    <div
      className={cx({
        'pop-over-list-item': true,
        current: selected,
      })}
      role="button"
      onClick={onClick}
    >
      {buttonIcon} {viewName} {option.isBeta && betaPill}{' '}
      {option.showUpsell && upsellPill}
      <span
        className="sub-name"
        data-test-id={
          option.showUpsell ? option.testId + '-upsell' : option.testId
        }
      >
        {viewDesc}
      </span>
    </div>
  );
}

export const BoardViewsPopover: React.FunctionComponent<BoardViewsPopoverProps> = ({
  idBoard,
  shortLink,
  orgName,
  idOrg,
  isOrgPrivate,
  paidStatus,
  shouldShowTeamTableLink,
  hidePopover,
  currentView,
  viewOptions,
  clearFilters,
  isLoadingPowerUpViews,
  powerUpViewOptions,
  currentPowerUpView,
  hasViewsFeature,
}) => {
  const { Controller } = require('app/scripts/controller');
  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'boardViewsInlineDialog',
      containers: {
        board: {
          id: idBoard,
        },
        organization: {
          id: idOrg,
        },
      },
    });
  }, [idBoard, idOrg]);

  const onClickUpsell = useCallback(() => {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'pill',
      actionSubjectId: 'bcUpgradePill',
      source: 'boardViewsInlineDialog',
      containers: {
        board: {
          id: idBoard,
        },
      },
    });
  }, [idBoard]);

  const optionItems = viewOptions.map((option) => {
    if (!option.isVisible) {
      return;
    }

    return (
      <TooltipListItem
        key={option.name}
        showTooltip={option.showUpsell || false}
      >
        <ViewOption
          option={option}
          selected={currentView === option.name}
          onClickUpsell={onClickUpsell}
          clearFilters={clearFilters}
          orgName={orgName}
        />
      </TooltipListItem>
    );
  });

  const shouldShowPowerUpViews = powerUpViewOptions.length > 0;
  const hasDefaultViews = useSeesVersionedVariation(
    'remarkable.default-views',
    'alpha',
  );
  const showDefaultViews = hasViewsFeature && hasDefaultViews && orgName;
  const showTeamTableLink = shouldShowTeamTableLink && orgName;

  return (
    <>
      <ul className="pop-over-list">{optionItems}</ul>
      {shouldShowPowerUpViews ? (
        <>
          <hr className={styles.lineSeparator} />
          <PowerUpViewOptions
            currentView={currentPowerUpView}
            isLoading={isLoadingPowerUpViews}
            viewOptions={powerUpViewOptions}
          />
        </>
      ) : null}
      {(showDefaultViews || showTeamTableLink) && (
        <>
          <hr className={styles.lineSeparator} />
        </>
      )}
      {showDefaultViews && (
        <>
          <WorkspaceViewsLink
            idBoard={idBoard}
            hidePopover={hidePopover}
            paidStatus={paidStatus}
            analyticsLinkName={'organizationMyWorkViewLink'}
            testId={BoardHeaderTestIds.TeamTableMyWorkOption}
            linkName={format('my-work')}
            href={Controller.getWorkspaceDefaultMyWorkViewUrl(orgName)}
          />
        </>
      )}
      {showTeamTableLink &&
        (hasDefaultViews ? (
          <>
            <WorkspaceViewsLink
              idBoard={idBoard}
              hidePopover={hidePopover}
              paidStatus={paidStatus}
              analyticsLinkName={'organizationCustomViewLink'}
              testId={BoardHeaderTestIds.TeamTableCustomViewOption}
              linkName={format('custom-view')}
              href={
                Controller.getWorkspaceDefaultCustomViewUrl(orgName) +
                `?idBoards=${shortLink}`
              }
            />
          </>
        ) : (
          <>
            <WorkspaceViewsLink
              idBoard={idBoard}
              hidePopover={hidePopover}
              paidStatus={paidStatus}
              analyticsLinkName={'teamBoardTableViewLink'}
              testId={BoardHeaderTestIds.TeamTableViewOption}
              linkName={format('team-table')}
              href={`/${orgName}/tables?idBoards=${shortLink}`}
            />
          </>
        ))}
    </>
  );
};
