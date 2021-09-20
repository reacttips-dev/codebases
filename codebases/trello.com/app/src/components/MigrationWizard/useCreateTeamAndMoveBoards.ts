import { sendErrorEvent } from '@trello/error-reporting';
import { Analytics } from '@trello/atlassian-analytics';
import { getNetworkError, NetworkError } from '@trello/graphql-error-handling';
import { ApolloError } from '@apollo/client';
import { localizeErrorCode } from '@trello/i18n';
import { Feature } from 'app/scripts/debug/constants';
import { FREE_TRIAL_THRESHOLD, screenToSource } from './constants';
import { MigrationWizardSteps } from './types';
import { MigrationWizardContext } from './MigrationWizardContext';
import { useUseCreateTeamAndMoveBoardsCreateTeamMutation } from './UseCreateTeamAndMoveBoardsCreateTeamMutation.generated';
import { useMigrationWizardMoveBoardMutation } from './MigrationWizardMoveBoardMutation.generated';
import { useMigrationWizardUpdateVoluntaryDoneMutation } from './MigrationWizardUpdateVoluntaryDoneMutation.generated';
import { useAddFreeTrialMutation } from './AddFreeTrialMutation.generated';
import { useContext, useState } from 'react';

export const useCreateTeamAndMoveBoards = () => {
  const [teamNameError, setTeamNameError] = useState('');
  const [teamError, setTeamError] = useState('');
  const [boardError, setBoardError] = useState('');
  const { setOrgId } = useContext(MigrationWizardContext);
  const [
    createTeamQuery,
    { loading: creatingTeam },
  ] = useUseCreateTeamAndMoveBoardsCreateTeamMutation();
  const [addFreeTrial] = useAddFreeTrialMutation();
  const [updateBoard] = useMigrationWizardMoveBoardMutation();
  const [
    updateTeamifyVoluntaryDone,
  ] = useMigrationWizardUpdateVoluntaryDoneMutation();

  const createTeam = async (name: string, { withFreeTrial = false }) => {
    if (creatingTeam) {
      return;
    }

    const trimmedName = name.trim();

    let result;
    try {
      const { data } = await createTeamQuery({
        variables: {
          name: trimmedName,
        },
      });
      result = data;
    } catch (err) {
      const networkError = getNetworkError(err);
      switch (networkError?.code) {
        case 'ORG_DISPLAY_NAME_SHORT':
          setTeamNameError(
            localizeErrorCode('organization', 'ORG_DISPLAY_NAME_SHORT'),
          );
          break;
        default:
          setTeamError(localizeErrorCode('organization', 'UNKNOWN_ERROR'));
          sendErrorEvent(err, {
            tags: {
              ownershipArea: 'trello-bizteam',
              feature: Feature.MigrationWizard,
            },
            extraData: {
              file: 'useCreateTeamAndMoveBoards',
            },
            networkError,
          });
          break;
      }
    }

    if (result?.createOrganization) {
      const organizationId = result.createOrganization.id;
      //not using setOrgId yet so that useTeamGuests does not run before boards have been moved
      if (!withFreeTrial) return organizationId;

      try {
        await addFreeTrial({
          variables: { orgId: organizationId },
        });

        return organizationId;
      } catch (err) {
        const networkError = getNetworkError(err);
        setTeamError(networkError?.message || 'Could not add free trial');

        sendErrorEvent(err, {
          tags: {
            ownershipArea: 'trello-bizteam',
            feature: Feature.MigrationWizard,
          },
          extraData: {
            file: 'useCreateTeamAndMoveBoards',
          },
          networkError,
        });

        return;
      }
    }
  };

  const updateBoards = async (orgId: string, boardIds: string[]) => {
    const movedBoards: string[] = [];
    for (const boardId of boardIds) {
      try {
        const { data } = await updateBoard({
          variables: {
            orgId,
            boardId,
            keepBillableGuests: true,
          },
        });

        if (data?.updateBoardOrg?.id) {
          movedBoards.push(data?.updateBoardOrg?.id);

          Analytics.sendUpdatedBoardFieldEvent({
            field: 'organization',
            value: orgId,
            source: screenToSource[MigrationWizardSteps.MOVE_YOUR_BOARDS],
            containers: {
              board: {
                id: boardId,
              },
              organization: {
                id: orgId,
              },
            },
          });
        }
      } catch (error) {
        const processError = (errorToProcess: ApolloError) => {
          const networkError = getNetworkError(errorToProcess);
          switch (networkError?.code) {
            default:
              setBoardError(localizeErrorCode('organization', 'UNKNOWN_ERROR'));
              sendErrorEvent(errorToProcess, {
                tags: {
                  ownershipArea: 'trello-bizteam',
                  feature: Feature.MigrationWizard,
                },
                extraData: {
                  file: 'useCreateTeamAndMoveBoards',
                },
                networkError,
              });
              break;
          }
        };

        if (Array.isArray(error.networkError)) {
          error.networkError.map((networkError: NetworkError) =>
            processError(new ApolloError({ networkError })),
          );
        } else {
          processError(error);
        }
      }
    }

    return movedBoards;
  };

  const createTeamAndMoveBoards = async (name: string, boardIds: string[]) => {
    if (!boardIds || boardIds.length === 0) {
      throw new Error('Need to provide boards to move');
    }

    const organizationId = await createTeam(name, {
      withFreeTrial: boardIds.length > FREE_TRIAL_THRESHOLD,
    });

    const movedBoards = organizationId
      ? await updateBoards(organizationId, boardIds)
      : [];

    //orgId must be set only after all boards have been moved so that useTeamGuests
    //runs when there is a chance for there to be guests
    if (organizationId) {
      setOrgId(organizationId);
    }

    try {
      await updateTeamifyVoluntaryDone({
        variables: {
          memberId: 'me',
        },
      });
    } catch (err) {
      const networkError = getNetworkError(err);
      sendErrorEvent(networkError || err, {
        tags: {
          ownershipArea: 'trello-bizteam',
          feature: Feature.MigrationWizard,
        },
        extraData: {
          file: 'useCreateTeamAndMoveBoards',
        },
        networkError,
      });
    }

    return {
      organizationId,
      movedBoards,
    };
  };

  return {
    createTeamAndMoveBoards,
    teamNameError,
    setTeamNameError,
    teamError,
    setTeamError,
    boardError,
    setBoardError,
  };
};
