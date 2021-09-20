/* eslint-disable import/no-default-export,jsx-a11y/label-has-associated-control,jsx-a11y/no-onchange,react/no-danger */
import classNames from 'classnames';
import { Button } from '@trello/nachos/button';
import { TeamType } from 'app/gamma/src/modules/state/models/teams';
import React, { useState, useEffect, useCallback } from 'react';
import { EnterpriseModel } from 'app/gamma/src/types/models';
import preventDefault from 'app/gamma/src/util/prevent-default';
import { byAttributeCaseInsensitive } from 'app/gamma/src/util/sort';
import styles from './create-team.less';

import { TeamTestIds } from '@trello/test-ids';
import { Analytics } from '@trello/atlassian-analytics';
import { forNamespace, forTemplate } from '@trello/i18n';
import { TeamTypeSelect } from 'app/src/components/TeamTypeSelect';

const formatBody = forTemplate('org_create');
const formatProduct = forNamespace('products');

const idPrefix = `${Date.now()}-`; // for id specificity

interface CreateTeamProps {
  teamType: TeamType;
  enterprises?: EnterpriseModel[];
  submitCreateTeam: (action: {
    type: TeamType;
    displayName: string;
    teamType?: string;
    desc?: string;
    enterprise?: string;
    redirectAfterCreate?: boolean;
  }) => void;
}

interface CreateTeamState {
  displayName: string;
  desc?: string;
  enterprise?: string;
  isSubmitting: boolean;
  teamType?: string;
}

const CreateTeam = ({
  teamType,
  enterprises,
  submitCreateTeam,
}: CreateTeamProps) => {
  const [state, setState] = useState<CreateTeamState>({
    displayName: '',
    teamType: undefined,
    desc: undefined,
    enterprise:
      teamType === TeamType.Enterprise && enterprises && enterprises.length
        ? enterprises[0].id
        : undefined,
    isSubmitting: false,
  });

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'createWorkspaceInlineDialog',
      attributes: {
        teamType: teamType,
      },
    });
    // This should only run once when the component mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeTeamName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setState({
        ...state,
        displayName: e.target.value,
      });
    },
    [state],
  );

  const onChangeTeamType = useCallback(
    (teamTypeValue: string) => {
      setState({
        ...state,
        teamType: teamTypeValue,
      });
    },
    [state],
  );

  const onChangeEnterprise: React.FormEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      setState({
        ...state,
        enterprise: e.currentTarget.value,
      });
    },
    [state],
  );

  const onChangeTeamDescription: React.FormEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      setState({
        ...state,
        desc: e.currentTarget.value,
      });
    },
    [state],
  );

  const onCreateTeam: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      setState({ ...state, isSubmitting: true });
      const { displayName, desc, enterprise } = state;
      const teamVerticalType = state.teamType;
      const redirectAfterCreate = !!enterprise;
      submitCreateTeam({
        type: teamType,
        displayName: displayName.trim(),
        teamType: teamVerticalType,
        desc,
        enterprise,
        redirectAfterCreate,
      });
    },
    [state, submitCreateTeam, teamType],
  );

  const getEnterprises = () => {
    const { enterprise } = state;
    if (!enterprises || !enterprises.length) {
      return undefined;
    }

    return enterprises.length === 1 ? (
      <p id={`${idPrefix}create-team-enterprise-name`}>
        {enterprises[0].displayName}
      </p>
    ) : (
      <select
        className={styles.select}
        id={`${idPrefix}create-team-enterprise-name`}
        onChange={onChangeEnterprise}
        disabled={state.isSubmitting}
        value={enterprise}
      >
        {enterprises
          .sort(byAttributeCaseInsensitive('displayName'))
          .map((ent, index) => {
            const { id, displayName } = ent;

            return (
              <option aria-selected={index === 0} value={id} key={id}>
                {displayName}
              </option>
            );
          })}
      </select>
    );
  };

  const { displayName, isSubmitting } = state;
  const teamVerticalType = state.teamType;
  const isSubmitDisabled =
    !displayName.trim() || !teamVerticalType || isSubmitting;

  return (
    <form onSubmit={preventDefault(onCreateTeam)}>
      <label htmlFor={`${idPrefix}create-team-org-display-name`}>
        {formatBody('name')}
      </label>
      <input
        autoFocus={true}
        className={styles.textInput}
        dir="auto"
        id={`${idPrefix}create-team-org-display-name`}
        maxLength={100}
        onChange={onChangeTeamName}
        value={state.displayName}
        tabIndex={0}
        type="text"
        data-test-id={TeamTestIds.CreateTeamNameInput}
        disabled={isSubmitting}
      />
      <TeamTypeSelect onChange={onChangeTeamType} isDisabled={isSubmitting} />
      {teamType === TeamType.Enterprise ? (
        <>
          <label htmlFor={`${idPrefix}create-team-enterprise-name`}>
            {formatProduct('enterprise')}
          </label>
          {getEnterprises()}
        </>
      ) : (
        <>
          <label
            htmlFor={`${idPrefix}create-team-org-description`}
            dangerouslySetInnerHTML={{
              __html: formatBody('description-optional'),
            }}
          />
          <textarea
            className={styles.textAreaInput}
            dir="auto"
            id={`${idPrefix}create-team-org-description`}
            name="desc"
            onChange={onChangeTeamDescription}
            tabIndex={0}
            disabled={isSubmitting}
          />
        </>
      )}
      <Button
        appearance="primary"
        className={styles.submitButton}
        type="submit"
        size="wide"
        isDisabled={isSubmitDisabled}
        testId={TeamTestIds.CreateTeamSubmitButton}
      >
        {formatBody('create')}
      </Button>
      <hr className={styles.separator} />
      <p className={classNames(styles.quiet, styles.bottomParagraph)}>
        {formatBody(
          teamType === TeamType.Enterprise
            ? 'a-team-is-a-group-of-boards-and-people-owned'
            : 'a-team-is-a-group-of-boards-and-people',
        )}
      </p>
    </form>
  );
};

export default CreateTeam;
