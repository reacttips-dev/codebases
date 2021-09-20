import { getPaidStatus } from '@trello/organizations';
import { getAccountType, getMaxPaidStatus, Login } from '@trello/members';
import { getElapsedDaysFromId } from 'app/common/lib/util/date';
import { PremiumFeature } from '@trello/product-features';

// Contextual data types
export interface Member {
  id: string;
  logins: Login[];
  organizations: MemberOrganization[];
  products: number[];
}

export interface Organization {
  billableCollaboratorCount?: number | null;
  billableMemberCount?: number | null;
  id: string;
  premiumFeatures: PremiumFeature[];
  products: number[];
  teamType?: string | null;
}

export interface Workspace {
  billableCollaboratorCount?: number | null;
  billableMemberCount?: number | null;
  id: string;
  premiumFeatures: PremiumFeature[];
  products: number[];
  teamType?: string | null;
}
interface MemberOrganization {
  premiumFeatures: PremiumFeature[];
  products: number[];
}

// Contextual default attribute types
interface DefaultMemberAttributes {
  accountType: 'business' | 'personal';
  maxPaidStatus: 'bc' | 'enterprise' | 'free' | 'gold' | 'standard';
}

interface DefaultOrgAttributes {
  billableCollaboratorCount: number | null | undefined;
  billableMemberCount: number | null | undefined;
  paidStatus: 'bc' | 'enterprise' | 'free' | 'standard';
  teamAgeInDays: number;
  teamType: string | null | undefined;
}
interface DefaultWorkspaceAttributes {
  billableCollaboratorCount: number | null | undefined;
  billableMemberCount: number | null | undefined;
  paidStatus: 'bc' | 'enterprise' | 'free' | 'standard';
  teamAgeInDays: number;
  teamType: string | null | undefined;
}
export interface DefaultAnalyticsContext {
  member?: DefaultMemberAttributes;
  organization?: DefaultOrgAttributes;
  workspace?: DefaultWorkspaceAttributes;
}

const getDefaultMemberAttributes = ({
  logins,
  organizations,
  products,
}: Member): DefaultMemberAttributes => {
  const accountType = getAccountType(logins);
  const maxPaidStatus = getMaxPaidStatus(organizations, products);

  return {
    accountType,
    maxPaidStatus,
  };
};

const getDefaultOrgAttributes = ({
  billableCollaboratorCount,
  billableMemberCount,
  id,
  premiumFeatures,
  products,
  teamType,
}: Organization): DefaultOrgAttributes => {
  const paidStatus = getPaidStatus(premiumFeatures, products);
  const teamAgeInDays = getElapsedDaysFromId(id);

  return {
    billableCollaboratorCount,
    billableMemberCount,
    paidStatus,
    teamAgeInDays,
    teamType,
  };
};
const getDefaultWorkspaceAttributes = ({
  billableCollaboratorCount,
  billableMemberCount,
  id,
  premiumFeatures,
  products,
  teamType,
}: Workspace): DefaultWorkspaceAttributes => {
  const paidStatus = getPaidStatus(premiumFeatures, products);
  const teamAgeInDays = getElapsedDaysFromId(id);

  return {
    billableCollaboratorCount,
    billableMemberCount,
    paidStatus,
    teamAgeInDays,
    teamType,
  };
};

export const getDefaultAnalyticsContext = ({
  member,
  organization,
  workspace,
}: {
  member?: Member | null;
  organization?: Organization | null;
  workspace?: Workspace | null;
}): DefaultAnalyticsContext => {
  const defaultAnalyticsContext: DefaultAnalyticsContext = {};

  if (member)
    defaultAnalyticsContext.member = getDefaultMemberAttributes(member);
  if (organization)
    defaultAnalyticsContext.organization = getDefaultOrgAttributes(
      organization,
    );
  if (workspace)
    defaultAnalyticsContext.workspace = getDefaultWorkspaceAttributes(
      workspace,
    );
  return defaultAnalyticsContext;
};
