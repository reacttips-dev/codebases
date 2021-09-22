import React from 'react';
import { compose } from 'recompose';

import type { SlackAccount } from 'bundles/slack-account-link/types/SlackAccount';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _t from 'i18n!nls/slack-account-link';
import SlackButtonWithAccountLinking from './SlackButtonWithAccountLinking';

type InputProps = {
  slackLink: string;
  slackTeamDomain: string;
  email: string;
  className: string;
  loadingComponent?: React.ReactElement;
  cdsEnabled?: boolean;
};

type Props = InputProps & {
  account: SlackAccount | null;
  degreeId: string;
  slackTeamMembersCount: number;
  inProgress: boolean;
  refetch: () => void;
};

export const SlackTeamMessageButton = ({
  slackLink,
  slackTeamDomain,
  account,
  degreeId,
  email,
  className,
  loadingComponent,
  inProgress,
  slackTeamMembersCount,
  cdsEnabled = false,
  refetch,
}: Props) => {
  if (inProgress && loadingComponent) {
    return loadingComponent;
  } else {
    return (
      <SlackButtonWithAccountLinking
        accountStatus={account?.status || 'EMAIL_VERIFIED'}
        degreeId={degreeId}
        slackLink={slackLink}
        teamDomain={slackTeamDomain}
        email={email}
        className={className}
        buttonText={cdsEnabled ? _t('Open Slack') : _t('Message team')}
        disabled={!!inProgress}
        onUpdate={() => refetch()}
        classMatesWithSlackAccountCount={slackTeamMembersCount}
        cdsEnabled={cdsEnabled}
      />
    );
  }
};

/* eslint-disable graphql/template-strings */
const externalSlackDataProviderHoc = graphql(
  gql`
    query AccountLinkSlackMyAccountQuery($domainName: String!) {
      ExternalSlackTeamInformationV1Resource(domainName: $domainName)
        @rest(
          type: "ExternalSlackTeamInformationV1Resource"
          path: "externalSlackTeamInformation.v1?q=bySlackTeamDomainName&domainName={args.domainName}&fields=slackTeam,degreeId,slackTeamMembersCount"
          method: "GET"
        ) {
        elements @type(name: "ExternalSlackTeamInformation") {
          id
          slackTeam
          degreeId
          slackTeamMembersCount
        }
      }
    }
  `,

  {
    options: ({ slackTeamDomain }: { slackTeamDomain: string }) => {
      const domainName = slackTeamDomain;
      return { variables: { domainName } };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: ({ data: { ExternalSlackTeamInformationV1Resource } }: any) => {
      return {
        degreeId: ExternalSlackTeamInformationV1Resource?.elements[0]?.degreeId,
        slackTeamMembersCount: ExternalSlackTeamInformationV1Resource?.elements[0]?.slackTeamMembersCount,
      };
    },
  }
);

/* eslint-disable graphql/template-strings */
const slackAccountDataProviderHoc = graphql(
  gql`
    query SlackTeamMessageMyAccountQuery($degreeId: String!) {
      SlackAuthV1Resource(degreeId: $degreeId)
        @rest(
          type: "SlackAuthV1Resource"
          path: "slackAuth.v1?q=me&degreeId={args.degreeId}&fields=status,email,degreeId,slackTeamId"
          method: "GET"
        ) {
        elements @type(name: "SlackAccount") {
          id
          email
          status
          degreeId
          slackTeamId
        }
      }
    }
  `,
  {
    skip: ({ degreeId }: { degreeId: string }) => !degreeId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: ({ data: { refetch, loading, SlackAuthV1Resource } }: any) => {
      return {
        account: SlackAuthV1Resource?.elements[0] || null,
        inProgress: loading,
        refetch,
      };
    },
  }
);

export default compose<Props, InputProps>(
  externalSlackDataProviderHoc,
  slackAccountDataProviderHoc
)(SlackTeamMessageButton);
