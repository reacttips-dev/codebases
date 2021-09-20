import React, { useState } from 'react';
import { forNamespace } from '@trello/i18n';
import { useWorkspacesPreambleSelectTeamQuery } from './WorkspacesPreambleSelectTeamQuery.generated';
import styles from './WorkspacesPreambleSelectTeam.less';
import { Select } from '@trello/nachos/select';
import { Button } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';

const noop = () => {};

const format = forNamespace('workspaces preamble');

interface WorkspacesPreambleSelectTeamProps {
  boardId: string;
  isLoadingSelectedTeam: boolean;
  onSelectCreateTeam: () => void;
  onSelectTeam: (selectedTeamId: string) => void;
  onSubmit: () => void;
  selectedTeamId: string;
}

const CREATE_NEW_TEAM = 'CREATE_NEW_TEAM';

export const WorkspacesPreambleSelectTeam: React.FunctionComponent<WorkspacesPreambleSelectTeamProps> = ({
  boardId,
  isLoadingSelectedTeam,
  onSelectCreateTeam,
  onSelectTeam,
  onSubmit,
  selectedTeamId,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data, loading } = useWorkspacesPreambleSelectTeamQuery();

  const teamSelectOptions: {
    label: string;
    value: string;
    isDisabled?: boolean;
    meta?: string;
  }[] = (data?.member?.organizations || []).map((org) => {
    const status = org?.limits?.orgs?.freeBoardsPerOrg?.status;
    const shouldDisable = status === 'disabled' || status === 'maxExceeded';

    return {
      label: org.displayName,
      value: org.id,
      isDisabled: shouldDisable,
      meta: shouldDisable
        ? format('upgrade-prompt-headline-run-out-of-free-boards')
        : undefined,
    };
  });
  teamSelectOptions.push({
    label: format('team-select-create-workspace-option'),
    value: CREATE_NEW_TEAM,
  });

  const onChange = (option: { label: string; value: string }) => {
    if (option.value === CREATE_NEW_TEAM) {
      onSelectCreateTeam();
    } else if (option.value) {
      onSelectTeam(option.value);
    }
  };

  const onSelectTeamSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    onSubmit();
  };

  const isButtonLoading = isSubmitted || loading || isLoadingSelectedTeam;
  const isButtonEnabled = selectedTeamId && !isButtonLoading;

  return (
    <>
      <label htmlFor="workspacesPreambleTeamSelect">
        {format('workspace-select-label')}
      </label>
      <Select
        id="workspacesPreambleTeamSelect"
        defaultValue={{
          label: format('team-select-default-option'),
          value: '',
        }}
        isLoading={loading}
        isDisabled={isSubmitted || loading}
        options={teamSelectOptions}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={onChange}
      />
      <Button
        className={styles.selectTeamSubmitButton}
        onClick={isButtonEnabled ? onSelectTeamSubmit : noop}
        size="fullwidth"
        isDisabled={!isButtonEnabled}
        appearance="primary"
      >
        {isButtonLoading ? (
          <Spinner centered />
        ) : (
          format('prompt-continue-button-add-to-workspace')
        )}
      </Button>
    </>
  );
};
