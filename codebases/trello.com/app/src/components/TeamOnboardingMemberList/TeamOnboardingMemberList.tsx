import React, { useState } from 'react';
import styles from './TeamOnboardingMemberList.less';
import { Analytics } from '@trello/atlassian-analytics';
import { useTeamOnboardingMemberListQuery } from './TeamOnboardingMemberListQuery.generated';
import { useTeamOnboardingMemberListInviteMutation } from './TeamOnboardingMemberListInviteMutation.generated';
import { Facepile } from 'app/src/components/Facepile';
import { forNamespace } from '@trello/i18n';
import ManageOrgMembersComponent from 'app/scripts/views/organization/manage-org-members-component';
import { PopOver } from 'app/scripts/views/lib/pop-over';
import { Button } from '@trello/nachos/button';
import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';
import { BCTeamOnboardingTestIds } from '@trello/test-ids';
import { useTeamOnboarding } from 'app/src/components/BusinessClassTeamOnboarding/useTeamOnboarding';
import { isMoonshotRedesign } from 'app/src/components/Moonshot/experimentVariation';

const format = forNamespace('team onboarding');
interface TeamOnboardingMemberListProps {
  orgId: string;
  model: object; //backbone model, passed through to the ManageOrgMembersComponent
  modelCache: object;
}

export const TeamOnboardingMemberList: React.FC<TeamOnboardingMemberListProps> = ({
  orgId,
  model,
  modelCache,
}) => {
  const [selectedMembers] = useState<string[]>([]);
  const [addMembersToOrg] = useTeamOnboardingMemberListInviteMutation();

  const { data } = useTeamOnboardingMemberListQuery({
    variables: { orgId },
  });

  const { isFreeTrialActive } = useTeamOnboarding(orgId);

  const memberIds = data?.organization?.members?.map((m) => m.id) || [];

  const inviteMembers = async () => {
    try {
      await addMembersToOrg({
        variables: {
          orgId,
          users: selectedMembers.map((idMember) => ({ id: idMember })),
        },
      });
    } catch (err) {
      sendErrorEvent(err, {
        tags: {
          ownershipArea: 'trello-bizteam',
          feature: Feature.TeamOnboarding,
        },
        extraData: {
          component: 'TeamOnboardingMemberList',
          errorCode: err?.networkError?.extensions?.code ?? 'UNKNOWN_ERROR',
        },
      });
    }
  };

  const onSubmit = async () => {
    if (orgId) {
      await inviteMembers();
    }
  };

  const renderInviteMemberPopOverComponent = (e: React.MouseEvent) => {
    if (!PopOver.isVisible) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'teamGettingStartedInviteButton',
        source: 'teamGettingStartedScreen',
        containers: {
          organization: {
            id: orgId,
          },
        },
        attributes: {
          paidStanding: isFreeTrialActive ? 'free-trial' : 'bc',
        },
      });
    }

    PopOver.toggle({
      elem: e.currentTarget,
      getViewTitle: () => format('invite'),
      role: 'dialog',
      reactElement: (
        // @ts-expect-error
        <ManageOrgMembersComponent
          key="team-onboarding-member-list"
          model={model}
          modelCache={modelCache}
        />
      ),
    });

    onSubmit();
  };

  return (
    <div className={styles.memberListContainer}>
      {isMoonshotRedesign() ? (
        <>
          <div>
            <Button
              className={styles.primaryButton}
              appearance="primary"
              shouldFitContainer
              // eslint-disable-next-line react/jsx-no-bind
              onClick={renderInviteMemberPopOverComponent}
              data-test-id={
                BCTeamOnboardingTestIds.BCTeamOnboardingInviteMemberButton
              }
            >
              {format(['invite-people'])}
            </Button>
          </div>
          <div>
            <Facepile memberIds={memberIds} maxFaceCount={4} />
          </div>
        </>
      ) : (
        <>
          <Facepile memberIds={memberIds} maxFaceCount={4} />
          <Button
            className={styles.inviteMemberButton}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={renderInviteMemberPopOverComponent}
            data-test-id={
              BCTeamOnboardingTestIds.BCTeamOnboardingInviteMemberButton
            }
          >
            {format(['invite'])}
          </Button>
        </>
      )}
    </div>
  );
};
