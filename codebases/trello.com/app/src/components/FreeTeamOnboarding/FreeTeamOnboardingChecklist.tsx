import React, { Suspense, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import { useLazyComponent } from '@trello/use-lazy-component';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right-large';
import CheckIcon from '@atlaskit/icon/glyph/check';

import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { forTemplate } from '@trello/i18n';
import { Spinner } from '@trello/nachos/spinner';

import { useFreeTeamOnboardingChecklist } from './useFreeTeamOnboardingChecklist';
import { preloadCreateBoardData } from 'app/gamma/src/modules/state/ui/create-menu';
import styles from './FreeTeamOnboardingChecklist.less';

const format = forTemplate('free_team_onboarding');

interface CheckItemProps {
  completed: boolean;
  index: number;
  title: string;
  subtitle?: string;
}

const CheckItem: React.FC<CheckItemProps> = ({
  completed,
  index,
  title,
  subtitle,
}) => {
  let content;
  if (completed) {
    content = (
      <span className={styles.bullet}>
        <CheckIcon
          label=""
          primaryColor="inherit"
          secondaryColor="inherit"
          size="small"
        />
      </span>
    );
  } else {
    content = <span className={styles.bullet}>{index + 1}</span>;
  }

  return (
    <>
      {content}
      <span className={styles.checklistContent}>
        {title} <small>{subtitle}</small>
      </span>
      <span className={styles.chevron}>
        <ChevronRightIcon
          label=""
          primaryColor="inherit"
          secondaryColor="inherit"
          size="medium"
        />
      </span>
    </>
  );
};

export const FreeTeamOnboardingChecklist: React.FC<{
  orgId: string;
}> = ({ orgId }) => {
  const dispatch = useDispatch();
  const CreateBoardOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-board-overlay" */ 'app/gamma/src/components/overlays/create-board-overlay'
      ),

    {
      preload: false,
    },
  );

  const [showCreateBoardOverlay, setShowCreateBoardOverlay] = useState(false);

  const closeCreateBoardOverlay = useCallback(() => {
    setShowCreateBoardOverlay(false);
  }, [setShowCreateBoardOverlay]);

  const openCreateBoardOverlay = useCallback(() => {
    dispatch(preloadCreateBoardData());
    setShowCreateBoardOverlay(true);
  }, [dispatch, setShowCreateBoardOverlay]);

  const {
    loading,
    checklistItems,
    completedCount,
    onClickChecklistItem,
  } = useFreeTeamOnboardingChecklist(orgId);
  const completedPercentage = Math.ceil(
    (completedCount / checklistItems.length) * 100,
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <Spinner centered />
      </div>
    );
  }

  const items = checklistItems.map(
    (
      {
        key,
        title,
        subtitle,
        href,
        openInNewTab,
        hasOnClick,
        completed,
        testId,
      },
      i,
    ) => {
      // item that isn't meant to be interacted with
      if (!href && !hasOnClick) {
        return (
          <li key={key} data-test-id={testId}>
            <div
              className={classNames(styles.checkListItem, {
                [styles.completed]: completed,
              })}
            >
              <span className={styles.bullet}>
                <CheckIcon
                  label=""
                  primaryColor="inherit"
                  secondaryColor="inherit"
                  size="small"
                />
              </span>
              <span className={styles.checklistContent}>
                {title} <small>{subtitle}</small>
              </span>
            </div>
          </li>
        );
      } else if (href) {
        return (
          <li key={key} data-test-id={testId}>
            <RouterLink
              href={href}
              target={openInNewTab ? '_blank' : '_self'}
              rel={openInNewTab ? 'noopener' : undefined}
              className={classNames(styles.checkListItem, {
                [styles.completed]: completed,
              })}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => onClickChecklistItem(key)}
            >
              <CheckItem
                completed={completed}
                index={i}
                title={title}
                subtitle={subtitle}
              />
            </RouterLink>
          </li>
        );
      } else if (hasOnClick) {
        return (
          <li key={key} data-test-id={testId}>
            <RouterLink
              className={classNames(styles.checkListItem, {
                [styles.completed]: completed,
              })}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={(e) => {
                e.preventDefault();
                openCreateBoardOverlay();
                onClickChecklistItem(key);
              }}
            >
              <CheckItem
                completed={completed}
                index={i}
                title={title}
                subtitle={subtitle}
              />
            </RouterLink>
          </li>
        );
      }
    },
  );

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.title}>{format('lets-make-trello')}</h2>
        <p className={styles.subTitle}>{format('follow-these-steps')}</p>
        <div className={styles.progressContainer}>
          <span className={styles.percentage}>{completedPercentage}%</span>
          <span className={styles.progressBar}>
            <span
              className={styles.innerBar}
              style={{ width: `${completedPercentage}%` }}
            />
          </span>
        </div>
        <ul className={styles.checkList}>{items}</ul>
      </div>
      {showCreateBoardOverlay && (
        <Suspense fallback={null}>
          <CreateBoardOverlay onClose={closeCreateBoardOverlay} />
        </Suspense>
      )}
    </>
  );
};
