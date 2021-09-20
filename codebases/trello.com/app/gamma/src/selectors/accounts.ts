import { State } from 'app/gamma/src/modules/types';
import { getMe } from './members';
import { getMyTeams } from './teams';

import { TeamModel } from 'app/gamma/src/types/models';

export const hasMemberAccount = (state: State) => {
  return (getMe(state)?.products ?? []).length > 0;
};

export const hasOrgAccount = (state: State) => {
  const teams = getMyTeams(state);

  return !!teams.some((org: TeamModel) => {
    return (org.products ?? []).length > 0;
  });
};

export const hasMemberOrOrgAccount = (state: State) => {
  return hasMemberAccount(state) || hasOrgAccount(state);
};
