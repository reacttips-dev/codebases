import React, { useState } from 'react';
import { forNamespace } from '@trello/i18n';
import styles from './BoardMemberRestrictionAlert.less';
import { useBoardMemberRestrictionAlertQuery } from './BoardMemberRestrictionAlertQuery.generated';
import { Button } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';
import { useRestrictedGuests } from './useRestrictedGuests';

const format = forNamespace('workspaces preamble');

interface BoardMemberRestrictionAlertProps {
  boardId: string;
  onCancel: () => void;
  onSubmit: () => void;
  orgId: string;
}

export const BoardMemberRestrictionAlert: React.FunctionComponent<BoardMemberRestrictionAlertProps> = ({
  boardId,
  onCancel,
  onSubmit,
  orgId,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { data, loading } = useBoardMemberRestrictionAlertQuery({
    variables: { orgId },
  });
  const {
    boardMembersNotInTeam,
    loading: restrictedGuestsLoading,
  } = useRestrictedGuests({
    orgId,
    boardId,
  });

  const onConfirm = () => {
    setIsSubmitted(true);
    onSubmit();
  };

  if (loading || restrictedGuestsLoading) {
    return <Spinner centered />;
  }

  return (
    <>
      <p className={styles.boardMemberRestrictionAlertMessaging}>
        {format('workspace-board-member-restriction-messaging', {
          orgName: (
            <strong key="orgName">{data?.organization?.displayName}</strong>
          ),
        })}
      </p>
      <p className={styles.boardMemberRestrictionAlertMembers}>
        <strong>
          {boardMembersNotInTeam.map((member) => member.fullName).join(', ')}
        </strong>
      </p>
      <Button
        appearance="danger"
        className={styles.boardMemberRestrictionAlertConfirmButton}
        isDisabled={isSubmitted}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={onConfirm}
        shouldFitContainer
      >
        {isSubmitted ? (
          <Spinner centered />
        ) : (
          format('workspace-board-member-restriction-submit')
        )}
      </Button>
      <Button
        appearance="default"
        className={styles.boardMemberRestrictionAlertCancelButton}
        isDisabled={isSubmitted}
        onClick={onCancel}
        shouldFitContainer
      >
        {format('board-member-restriction-cancel')}
      </Button>
    </>
  );
};
