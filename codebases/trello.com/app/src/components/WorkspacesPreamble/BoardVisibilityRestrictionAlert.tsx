import React, { useState } from 'react';
import { forNamespace } from '@trello/i18n';
import classNames from 'classnames';
import styles from './BoardVisibilityRestrictionAlert.less';
// eslint-disable-next-line no-restricted-imports
import { Board_Prefs_PermissionLevel } from '@trello/graphql/generated';
import { useBoardVisibilityRestrictionAlertQuery } from './BoardVisibilityRestrictionAlertQuery.generated';
import { Spinner } from '@trello/nachos/spinner';
import { CheckIcon } from '@trello/nachos/icons/check';
import { PublicIcon } from '@trello/nachos/icons/public';
import { PrivateIcon } from '@trello/nachos/icons/private';
import { OrganizationIcon } from '@trello/nachos/icons/organization';

import { useRestrictedBoardVisibility } from './useRestrictedBoardVisibility';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { memberId } from '@trello/session-cookie';

const noop = () => {};

const format = forNamespace('workspaces preamble');
const permissionsFormat = forNamespace('board perms');

interface BoardVisibilityRestrictionAlertProps {
  boardId: string;
  onSubmit: (visibility: Board_Prefs_PermissionLevel) => void;
  orgId: string;
}

export const BoardVisibilityRestrictionAlert: React.FunctionComponent<BoardVisibilityRestrictionAlertProps> = ({
  boardId,
  onSubmit,
  orgId,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { data, loading } = useBoardVisibilityRestrictionAlertQuery({
    variables: { orgId },
  });

  const {
    boardVisibility,
    loading: boardVisibilityRestrictionsLoading,
    teamAllowsPrivateBoards,
    teamAllowsPublicBoards,
    teamAllowsTeamVisibleBoards,
    teamRestrictsAllBoardVisibilities,
  } = useRestrictedBoardVisibility({
    orgId,
    boardId,
  });

  if (loading || boardVisibilityRestrictionsLoading) {
    return <Spinner centered />;
  }

  // It is possible that a BC team's settings are such that all board visibilities are restricted for some or all team members
  if (teamRestrictsAllBoardVisibilities) {
    const isTeamAdmin = !!data?.organization?.memberships?.find(
      (membership) =>
        membership.idMember === memberId &&
        membership.memberType === 'admin' &&
        !membership.deactivated &&
        !membership.unconfirmed,
    );
    const orgName = (
      <strong key="orgName">{data?.organization?.displayName}</strong>
    );
    const messaging = isTeamAdmin
      ? format('board-visibility-all-restricted', {
          orgName,
          teamSettingsPageLink: (
            <RouterLink
              key="settingsLink"
              href={`/${data?.organization?.name}/account`}
            >
              {format('workspace-board-visibility-settings-link')}
            </RouterLink>
          ),
        })
      : format('workspace-board-visibility-all-restricted-not-admin', {
          orgName,
        });

    return <p id="allVisibilitiesAreRestrictedMessaging">{messaging}</p>;
  }

  const onClickOption = (visibility: Board_Prefs_PermissionLevel) => {
    setIsSubmitted(true);
    onSubmit(visibility);
  };

  return (
    <>
      <p>
        {format('workspace-board-visibility-messaging', {
          orgName: (
            <strong key="orgName">{data?.organization?.displayName}</strong>
          ),
        })}
      </p>
      <div
        id="privateVisibilityOption"
        role="button"
        // eslint-disable-next-line react/jsx-no-bind
        onClick={
          teamAllowsPrivateBoards && !isSubmitted
            ? () => onClickOption(Board_Prefs_PermissionLevel.Private)
            : noop
        }
        className={classNames(styles.boardVisibilityOption, {
          [styles.boardVisibilityOptionDisabled]:
            !teamAllowsPrivateBoards || isSubmitted,
        })}
      >
        <div className={styles.boardVisibilityOptionTitle}>
          <PrivateIcon
            dangerous_className={styles.boardVisibilityIcon}
            color="red"
            size="small"
          />
          {permissionsFormat(['private', 'name'])}
          {boardVisibility === 'private' && (
            <CheckIcon
              dangerous_className={styles.boardVisibilityIcon}
              size="small"
            />
          )}
        </div>
        <p className={styles.boardVisibilityOptionDescription}>
          {permissionsFormat(['private', 'short summary'])}
          &nbsp;
          {!teamAllowsPrivateBoards && (
            <span className={styles.boardVisibilityDisabledMessaging}>
              {format('workspace-board-visibility-option-disabled')}
            </span>
          )}
        </p>
      </div>
      <div
        id="teamVisibleVisibilityOption"
        role="button"
        // eslint-disable-next-line react/jsx-no-bind
        onClick={
          teamAllowsTeamVisibleBoards && !isSubmitted
            ? () => onClickOption(Board_Prefs_PermissionLevel.Org)
            : noop
        }
        className={classNames(styles.boardVisibilityOption, {
          [styles.boardVisibilityOptionDisabled]:
            !teamAllowsTeamVisibleBoards || isSubmitted,
        })}
      >
        <div className={styles.boardVisibilityOptionTitle}>
          <OrganizationIcon
            dangerous_className={styles.boardVisibilityIcon}
            size="small"
          />
          {permissionsFormat(['org', 'name'])}
          {boardVisibility === 'org' && (
            <CheckIcon
              dangerous_className={styles.boardVisibilityIcon}
              size="small"
            />
          )}
        </div>
        <p className={styles.boardVisibilityOptionDescription}>
          {permissionsFormat(['org', 'short summary'])}
          &nbsp;
          {!teamAllowsTeamVisibleBoards && (
            <span className={styles.boardVisibilityDisabledMessaging}>
              {format('workspace-board-visibility-option-disabled')}
            </span>
          )}
        </p>
      </div>
      <div
        id="publicVisibilityOption"
        role="button"
        // eslint-disable-next-line react/jsx-no-bind
        onClick={
          teamAllowsPublicBoards && !isSubmitted
            ? () => onClickOption(Board_Prefs_PermissionLevel.Public)
            : noop
        }
        className={classNames(styles.boardVisibilityOption, {
          [styles.boardVisibilityOptionDisabled]:
            !teamAllowsPublicBoards || isSubmitted,
        })}
      >
        <div className={styles.boardVisibilityOptionTitle}>
          <PublicIcon
            dangerous_className={styles.boardVisibilityIcon}
            color="green"
            size="small"
          />
          {permissionsFormat(['public', 'name'])}
          {boardVisibility === 'public' && (
            <CheckIcon
              dangerous_className={styles.boardVisibilityIcon}
              size="small"
            />
          )}
        </div>
        <p className={styles.boardVisibilityOptionDescription}>
          {permissionsFormat(['public', 'short summary'])}
          &nbsp;
          {!teamAllowsPublicBoards && (
            <span className={styles.boardVisibilityDisabledMessaging}>
              {format('workspace-board-visibility-option-disabled')}
            </span>
          )}
        </p>
      </div>
    </>
  );
};
