import { State } from 'app/gamma/src/modules/types';

import { ProductFeatures } from '@trello/product-features';
import {
  AccessLevel,
  BoardPermissionLevel,
  MemberModel,
  MembershipModel,
  TeamModel,
} from 'app/gamma/src/types/models';
import { getMe, getMemberById } from './members';
import { getMemberTypeFromMemberships } from './memberships';
import { getMyId } from './session';
import { isPaidManagedEnterpriseMember } from '@trello/members';

export function getMyTeams(state: State) {
  const idMe = getMyId(state);

  if (!idMe) {
    return [];
  }

  const inIdOrganizations = new Map<string, boolean>();
  const me = getMe(state);
  if (me && me.idOrganizations) {
    me.idOrganizations.forEach((id) => inIdOrganizations.set(id, true));
  }

  return state.models.teams.filter(
    ({ id, memberships }: { id: string; memberships?: MembershipModel[] }) => {
      return (
        inIdOrganizations.get(id) &&
        (!memberships || memberships.some(({ idMember }) => idMember === idMe))
      );
    },
  );
}

const filterTeams = (
  teams: TeamModel[],
  filterFn: (team: TeamModel) => boolean,
) => {
  return teams.filter(filterFn)[0] || null;
};

const filterMyTeams = (
  state: State,
  filterFn: (team: TeamModel) => boolean,
) => {
  const teams = getMyTeams(state);

  if (teams.length === 0) {
    return null;
  }

  return filterTeams(teams, filterFn);
};

export function getTeamById(state: State, idTeam: string) {
  return filterTeams(state.models.teams, ({ id }) => id === idTeam);
}

export const getMyTeamById = (state: State, idTeam: string) =>
  filterMyTeams(state, ({ id }) => id === idTeam);

export function getTeamMembershipType(
  state: State,
  org: TeamModel | string,
  member: MemberModel | string,
): AccessLevel {
  const teamModel: TeamModel =
    typeof org === 'string' ? getTeamById(state, org) : org;
  const memberModel =
    typeof member === 'string' ? getMemberById(state, member)! : member;

  return getMemberTypeFromMemberships(
    state,
    teamModel.memberships,
    memberModel,
    teamModel.id,
  );
}

export function isOrganizationOwned(state: State, org: TeamModel | string) {
  return (
    getTeamMembershipType(state, org, getMe(state) || '') === AccessLevel.Admin
  );
}

export function isMemberOfTeam(
  state: State,
  org: TeamModel | string,
  member: MemberModel | string,
): boolean {
  const teamModel: TeamModel =
    typeof org === 'string' ? getTeamById(state, org) : org;

  if (!teamModel) {
    return false;
  }

  const memberType = getTeamMembershipType(state, org, member);

  return (
    !!memberType &&
    [AccessLevel.Virtual, AccessLevel.Normal, AccessLevel.Admin].includes(
      memberType,
    )
  );
}

export function teamCanSetVisibility(
  state: State,
  org: TeamModel | string,
  vis: BoardPermissionLevel,
) {
  const teamModel: TeamModel =
    typeof org === 'string' ? getTeamById(state, org) : org;

  if (!teamModel) {
    return false;
  }

  const isRestrictVisEnabled = ProductFeatures.isFeatureEnabled(
    'restrictVis',
    teamModel.products && teamModel.products[0],
  );

  if (!isRestrictVisEnabled) {
    return true;
  }

  if (vis === AccessLevel.Enterprise && !teamModel.idEnterprise) {
    return false;
  }

  const pref = teamModel.prefs && teamModel.prefs.boardVisibilityRestrict[vis];

  return (
    !pref ||
    pref === AccessLevel.Org ||
    (pref === AccessLevel.Admin && isOrganizationOwned(state, org))
  );
}

export interface OrgWithPermissions {
  allowedVis: BoardPermissionLevel[];
  model: TeamModel;
}

export const getEnterpriseTeams = (state: State) => {
  return getMyTeams(state).filter((team) => {
    return ProductFeatures.isEnterpriseProduct(team.products?.[0]);
  });
};

export function getOrgsWithPermissions(state: State): OrgWithPermissions[] {
  const me = getMe(state);
  if (!me) return [];

  const isPaidManagedEntMember = isPaidManagedEnterpriseMember({
    confirmed: me.confirmed,
    idEnterprise: me.idEnterprise,
    enterpriseLicenses: me.enterpriseLicenses,
  });

  const permissions: BoardPermissionLevel[] = [
    AccessLevel.Private,
    AccessLevel.Org,
    AccessLevel.Public,
    AccessLevel.Enterprise,
  ];

  const orgsWithPermissions = getMyTeams(state)
    .filter(
      (org: TeamModel) =>
        !isPaidManagedEntMember ||
        ProductFeatures.isEnterpriseProduct(org.products?.[0]),
    )
    .map((org: TeamModel) => ({
      allowedVis: permissions.filter((vis) =>
        teamCanSetVisibility(state, org, vis),
      ),
      model: org,
    }));

  return orgsWithPermissions;
}

export const getMyTeamByName = (state: State, teamName: string) =>
  filterMyTeams(state, ({ name }) => name === teamName);

export const getMyTeamsByIds = (state: State, idTeams: string[] = []) =>
  idTeams.map((idTeam) => getMyTeamById(state, idTeam));
