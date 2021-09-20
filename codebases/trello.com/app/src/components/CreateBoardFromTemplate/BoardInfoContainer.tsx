/* eslint-disable import/no-default-export */
import React from 'react';
import { connect } from 'react-redux';
import {
  createBoardReset,
  createBoardSelectTeam,
  createBoardSelectVisibility,
  createBoardSetName,
  createBoardFromTemplateSubmit,
  createBoardKeepFromSource,
  preSelectTeam,
} from 'app/gamma/src/modules/state/ui/create-menu';
import { State } from 'app/gamma/src/modules/types';
import {
  getCreateBoardDisallowed,
  getCreateBoardMenu,
  getCreateBoardMenuBackgroundStyle,
  getCreateBoardSelectedTeam,
  getCreateBoardSelectedVisibility,
} from 'app/gamma/src/selectors/create-menu';
import { getOrgsWithPermissions } from 'app/gamma/src/selectors/teams';
import { isTeamAdmin, getMe } from 'app/gamma/src/selectors/members';
import { Dispatch } from 'app/gamma/src/types';
import { BoardInfo, AllProps, DispatchProps, StateProps } from './BoardInfo';

import { addSubscription } from 'app/scripts/init/subscriber';
import { isAtOrOverFreeBoardLimit } from 'app/gamma/src/util/model-helpers/team';
import {
  getEnterpriseById,
  getEnterpriseWithPermissions,
  isEnterpriseMemberOnNonEnterpriseTeam,
} from 'app/gamma/src/selectors/enterprises';
import { Analytics } from '@trello/atlassian-analytics';

const mapStateToProps = (state: State): StateProps => {
  const selectedTeam = getCreateBoardSelectedTeam(state);
  const enterpriseWithPermissions = getEnterpriseWithPermissions(state);
  const backgroundStyle = getCreateBoardMenuBackgroundStyle(state);
  const boardName = getCreateBoardMenu(state).name;
  const keepFromSource = getCreateBoardMenu(state).keepFromSource;
  const isCreateBoardDisallowed = getCreateBoardDisallowed(state);
  const isCreatingBoard = getCreateBoardMenu(state).isCreatingBoard;
  const isLoadingVisPermissions = getCreateBoardMenu(state)
    .isLoadingVizPermissions;

  const isCreateBoardSubmitEnabled =
    !isCreateBoardDisallowed &&
    !isCreatingBoard &&
    !isLoadingVisPermissions &&
    !(selectedTeam && isAtOrOverFreeBoardLimit(selectedTeam.model)) &&
    !!boardName.trim().length;

  const me = getMe(state);

  let enterprise = undefined;
  if (me && typeof me.idEnterprise === 'string') {
    enterprise = getEnterpriseById(state, me.idEnterprise);
  }

  return {
    backgroundStyle,
    boardName,
    isCreateBoardDisallowed,
    isCreatingBoard,
    isCreateBoardSubmitEnabled,
    isLoadingVisPermissions,
    isTeamAdmin: !!selectedTeam && isTeamAdmin(state, selectedTeam.model),
    isEnterpriseMemberOnNonEnterpriseTeam: isEnterpriseMemberOnNonEnterpriseTeam(
      state,
    ),
    enterprise,
    enterpriseWithPermissions,
    keepFromSource,
    selectedTeam,
    selectedVisibility: getCreateBoardSelectedVisibility(state),
    teams: getOrgsWithPermissions(state).sort((a, b) => {
      const teamAName = a.model.name.toLocaleLowerCase();
      const teamBName = b.model.name.toLocaleLowerCase();
      if (teamAName < teamBName) {
        return -1;
      }
      if (teamAName > teamBName) {
        return 1;
      }

      return 0;
    }),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    preSelectOrg() {
      dispatch(preSelectTeam());
    },
    setName(name) {
      dispatch(createBoardSetName(name));
    },
    onChangeBoardName(e) {
      dispatch(createBoardSetName(e.currentTarget.value));
    },
    onSelectTeam(idTeam) {
      dispatch(createBoardSelectTeam(idTeam));
    },
    onSelectVisibility(visibility) {
      dispatch(createBoardSelectVisibility(visibility));
    },
    resetState() {
      dispatch(createBoardReset());
    },
    onChangeKeepCards(keepCards) {
      dispatch(createBoardKeepFromSource(keepCards));
    },
    submitCreateBoard(
      templateId,
      templateCategory,
      selectedVisibility,
      selectedTeamId,
    ) {
      dispatch(createBoardFromTemplateSubmit(templateId));

      Analytics.sendCopiedBoardEvent({
        source: 'useTemplateInlineDialog',
        attributes: {
          sourceBoardId: templateId,
          fromTemplate: true,
          templateCategory: templateCategory,
          visibility: selectedVisibility,
          isBCFeature: true,
          requiredBC: false,
        },
        containers: {
          board: {
            id: templateId,
          },
          organization: {
            id: selectedTeamId,
          },
        },
      });
    },
  };
};

class BoardInfoContainerInner extends React.Component<AllProps> {
  teamSubscriptions: { id: string; unsubscribe: () => void }[] = [];

  componentDidMount() {
    this.updateTeamSubscriptions(this.props.teams);
    this.prefillBoardName(this.props.sourceBoardName);
    this.props.preSelectOrg();
    Analytics.sendScreenEvent({
      name: 'useTemplateInlineDialog',
    });
  }

  componentDidUpdate() {
    this.updateTeamSubscriptions(this.props.teams);
  }

  componentWillUnmount() {
    this.props.resetState();
    this.updateTeamSubscriptions([]);
  }

  prefillBoardName(sourceBoardName: string | null) {
    if (sourceBoardName) {
      this.props.setName(sourceBoardName);
    }
  }

  updateTeamSubscriptions(teams: AllProps['teams']) {
    const newTeamsById: Map<string, boolean> = teams.reduce((all, team) => {
      all.set(team.model.id, true);

      return all;
    }, new Map<string, boolean>());

    const oldTeamsById: Map<string, boolean> = this.teamSubscriptions.reduce(
      (all, entry) => {
        all.set(entry.id, true);

        return all;
      },
      new Map<string, boolean>(),
    );

    this.teamSubscriptions = [
      ...this.teamSubscriptions.filter((entry) => {
        if (newTeamsById.has(entry.id)) {
          return true;
        } else {
          entry.unsubscribe();

          return false;
        }
      }),
      ...teams
        .filter((team) => !oldTeamsById.has(team.model.id))
        .map((team) => {
          const id = team.model.id;

          return {
            id,
            unsubscribe: addSubscription({
              modelType: 'Organization',
              idModel: id,
              tags: ['updates', 'allActions'],
            }),
          };
        }),
    ];
  }

  render() {
    const {
      boardId,
      templateCategory,
      boardName,
      onChangeBoardName,
      keepFromSource,
      onChangeKeepCards,
    } = this.props;

    return (
      <BoardInfo
        {...this.props}
        boardId={boardId}
        templateCategory={templateCategory}
        boardName={boardName}
        onChangeBoardName={onChangeBoardName}
        keepFromSource={keepFromSource}
        onChangeKeepCards={onChangeKeepCards}
      />
    );
  }
}

export const BoardInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BoardInfoContainerInner);
