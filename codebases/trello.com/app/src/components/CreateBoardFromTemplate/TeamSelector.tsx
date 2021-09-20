import React from 'react';
import { localizeCount, forTemplate } from '@trello/i18n';
import { Select } from '@trello/nachos/select';
import { OrgWithPermissions } from 'app/gamma/src/selectors/teams';
import { AccessLevel } from 'app/gamma/src/types/models';
import {
  freeBoardsOver,
  freeBoardsRemaining,
  isCloseToFreeBoardLimit,
} from 'app/gamma/src/util/model-helpers/team';
import { isDesktop } from '@trello/browser';
import { featureFlagClient } from '@trello/feature-flag-client';

const formatCreateBoard = forTemplate('create_board');
const formatTemplates = forTemplate('templates');

const idPrefix = `${Date.now()}-`; // for id specificity
const idNoTeam = `${Date.now()}-noteam`;

const noTeam: OrgWithPermissions = {
  allowedVis: [AccessLevel.Private, AccessLevel.Public],
  model: {
    id: idNoTeam,
    name: idNoTeam,
    // eslint-disable-next-line @trello/no-module-logic
    displayName: formatCreateBoard('no team'),
    memberships: [],
    products: [],
    url: '',
  },
};

const boardLimitInfo = (team: OrgWithPermissions) => {
  if (team.model.id === idNoTeam) {
    return null;
  }

  const boardsRemaining = freeBoardsRemaining(team.model);
  const showBoardsRemaining =
    !isDesktop() && isCloseToFreeBoardLimit(team.model);
  const boardsOver = freeBoardsOver(team.model);
  const showBoardsOver = boardsOver > 0;

  if (!showBoardsRemaining || boardsRemaining === undefined) {
    return null;
  }

  const boardsRemainingText = localizeCount(
    'boards-remaining',
    boardsRemaining,
  );

  if (!showBoardsOver) {
    return boardsRemainingText;
  }

  return `${boardsRemainingText} | ${localizeCount('boards-over', boardsOver)}`;
};
export interface TeamSelectorProps {
  onSelectTeam: (idTeam: string | null) => void;
  selectedTeam: OrgWithPermissions | null;
  teams: OrgWithPermissions[];
}

export const TeamSelector: React.FunctionComponent<TeamSelectorProps> = ({
  onSelectTeam,
  selectedTeam,
  teams,
}) => {
  const blockTeamlessBoardsEnabled = featureFlagClient.get(
    'btg.block-teamless-boards',
    false,
  );

  // Do not show a team selector if there are no teams to select
  if (blockTeamlessBoardsEnabled && teams.length === 0) {
    return null;
  }

  const teamList = blockTeamlessBoardsEnabled ? teams : [noTeam, ...teams];
  const teamOptions = teamList.map((team) => {
    const limitInfoText = boardLimitInfo(team);

    return {
      label: team?.model?.displayName,
      value: team?.model?.id,
      meta: limitInfoText ? <span>{limitInfoText}</span> : null,
    };
  });

  const selectedTeamValue =
    teamOptions.find((option) => option.value === selectedTeam?.model?.id) ||
    teamOptions.find((option) => option.value === idNoTeam);

  return (
    <>
      <label htmlFor={`${idPrefix}create-board-select-team`}>
        {formatTemplates('team')}
      </label>
      <Select
        id={`${idPrefix}create-board-select-team`}
        value={selectedTeamValue}
        options={teamOptions}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={(option: { value: string }) => {
          onSelectTeam(option.value);
        }}
      />
    </>
  );
};
