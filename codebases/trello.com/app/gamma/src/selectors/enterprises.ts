import { State } from 'app/gamma/src/modules/types';
import {
  AccessLevel,
  BoardPermissionLevel,
  EnterpriseModel,
} from 'app/gamma/src/types/models';
import { getMe } from './members';
import { getMyTeams, getMyTeamsByIds } from './teams';
import { isPaidManagedEnterpriseMember as isPaidManagedEnt } from '@trello/members';
import { ProductFeatures } from '@trello/product-features';

export const getEnterpriseById = (
  state: State,
  idEnterprise: string,
): EnterpriseModel | undefined =>
  state.models.enterprises.collection[idEnterprise];

export const getMyEnterprises = (state: State): EnterpriseModel[] => {
  const me = getMe(state);
  if (me && me.enterprises) {
    return me.enterprises;
  }

  return [];
};

export const hasEnterprises = (state: State): boolean => {
  const enterprises = getMyEnterprises(state);

  return !!enterprises && !!enterprises.length;
};

export const isEnterpriseAdmin = (state: State): boolean => {
  const me = getMe(state);

  return !!(
    me &&
    me.confirmed &&
    me.idEnterprisesAdmin &&
    me.idEnterprisesAdmin.length > 0
  );
};

export const isAdminOfEnterprise = (
  state: State,
  enterprise: EnterpriseModel,
): boolean => {
  const me = getMe(state);

  return !!(
    me &&
    isEnterpriseAdmin(state) &&
    me.idEnterprisesAdmin &&
    me.idEnterprisesAdmin.includes(enterprise.id)
  );
};

export const isAdminOfEnterpriseTeams = (
  state: State,
  enterprise: EnterpriseModel,
): boolean => {
  const me = getMe(state);

  if (isAdminOfEnterprise(state, enterprise)) return true;

  return !!(
    me &&
    me.idPremOrgsAdmin &&
    getMyTeamsByIds(state, me.idPremOrgsAdmin).some(
      (team) =>
        team && team.idEnterprise && team.idEnterprise === enterprise.id,
    )
  );
};

export const isManagedEnterpriseMember = (state: State): boolean => {
  const me = getMe(state);
  return !!(me && me.confirmed && me.idEnterprise);
};

export const isPaidManagedEnterpriseMember = (state: State) => {
  const me = getMe(state);
  if (!me) {
    return false;
  }

  return isPaidManagedEnt({
    confirmed: me.confirmed,
    idEnterprise: me.idEnterprise,
    enterpriseLicenses: me.enterpriseLicenses,
  });
};

export const isEnterpriseMemberOnNonEnterpriseTeam = (state: State) => {
  return (
    isPaidManagedEnterpriseMember(state) &&
    getMyTeams(state).some((team) => {
      return Boolean(
        !team.idEnterprise ||
          (team.idEnterprise &&
            !ProductFeatures.isEnterpriseProduct(team.products?.[0])),
      );
    })
  );
};

export function teamlessBoardsCanSetVisibility(
  state: State,
  enterprise: EnterpriseModel | string,
  vis: BoardPermissionLevel,
) {
  const enterpriseModel =
    typeof enterprise === 'string'
      ? getEnterpriseById(state, enterprise)
      : enterprise;

  if (!enterpriseModel) {
    return false;
  }

  if (vis === AccessLevel.Enterprise || vis === AccessLevel.Org) {
    return false;
  }

  const pref =
    enterpriseModel.organizationPrefs &&
    enterpriseModel.organizationPrefs.boardVisibilityRestrict[vis];

  return (
    !pref ||
    pref === AccessLevel.Org ||
    (pref === AccessLevel.Admin &&
      isAdminOfEnterpriseTeams(state, enterpriseModel))
  );
}

export interface EnterpriseWithPermissions {
  allowedVis: BoardPermissionLevel[];
  model: EnterpriseModel;
}

export function getEnterpriseWithPermissions(
  state: State,
): EnterpriseWithPermissions | undefined {
  const me = getMe(state);
  const enterprise =
    me &&
    me.idEnterprise &&
    isPaidManagedEnterpriseMember(state) &&
    getEnterpriseById(state, me.idEnterprise);

  if (!enterprise) {
    return undefined;
  }

  const permissions: BoardPermissionLevel[] = [
    AccessLevel.Private,
    AccessLevel.Public,
  ];

  const enterpriseWithPermissions = {
    allowedVis: permissions.filter((vis) =>
      teamlessBoardsCanSetVisibility(state, enterprise, vis),
    ),
    model: enterprise,
  };
  return enterpriseWithPermissions;
}
