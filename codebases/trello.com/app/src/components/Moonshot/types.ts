/* eslint-disable @trello/disallow-filenames */
import { MoonshotSteps } from './campaigns';
import { Noun } from '@trello/analytics';
import { MoonshotOrganizationQuery } from './MoonshotOrganizationQuery.generated';
import { MoonshotQuery } from './MoonshotQuery.generated';
import React from 'react';
import { MemberResponse } from 'app/gamma/src/types/responses';

export enum ExperimentVariations {
  CONTROL = 'control',
  NOT_ENROLLED = 'not-enrolled',
  EXPERIMENT = 'experiment',
}
export interface MoonshotSubmitFunction {
  (step?: MoonshotSteps): void;
}

export interface MoonshotStep {
  step: number;
  key: MoonshotSteps;
  render: (options: {
    onSubmit: MoonshotSubmitFunction;
    orgId?: string;
    isSlack?: boolean;
  }) => React.ReactNode | null;
  noun: Noun;
}

export interface MoonshotAnalyticsAttributes {
  idEnterprise: string | null;
  isEnterprise: boolean;
  orgId: string;
  confirmed: boolean | undefined;
  numInvited: number;
  invitedMembers: MemberResponse[];
  moonshotVariation: string;
}
export interface MoonshotContextState {
  currentStep: MoonshotSteps;
  onSubmit: MoonshotSubmitFunction;
  orgId: string;
  organization?: MoonshotOrganizationQuery['organization'];
  loading: boolean;
  isSlack: boolean;
  idEnterprise: string | null;
  isEnterprise: boolean;
  slackCampaign?: NonNullable<MoonshotQuery['member']>['campaigns'][0];
  moonshotCampaign?: NonNullable<MoonshotQuery['member']>['campaigns'][0];
  isFreeTrial: boolean;
  member?: MoonshotQuery['member'];
  setOrgId(id: string): void;
  analyticsAttributes: MoonshotAnalyticsAttributes | undefined;
}
