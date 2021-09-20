/* eslint-disable @trello/disallow-filenames */
import API from 'app/gamma/src/api';
import { TeamModel } from 'app/gamma/src/types/models';
import { OrganizationLimits } from 'app/gamma/src/types/responses';
import { ProductFeatures } from '@trello/product-features';
import { clientVersion } from '@trello/config';

export const isPremiumTeam = (team: TeamModel): boolean => {
  return ProductFeatures.hasProduct(team.products?.[0]);
};

interface TeamWithBoardLimit extends TeamModel {
  limits: OrganizationLimits;
}

export const hasFreeBoardLimitDefined = (
  team: TeamModel | TeamWithBoardLimit,
): team is TeamWithBoardLimit => {
  return !!(
    team &&
    team.limits &&
    team.limits.orgs &&
    team.limits.orgs.freeBoardsPerOrg
  );
};

export const freeBoardsUsed = (team: TeamModel): number | undefined => {
  if (isPremiumTeam(team) || !hasFreeBoardLimitDefined(team)) {
    return undefined;
  }

  const limit = team.limits.orgs.freeBoardsPerOrg;
  if (limit.count === undefined) {
    return undefined;
  }

  return limit.count;
};

export const freeBoardsRemaining = (team: TeamModel): number | undefined => {
  if (isPremiumTeam(team) || !hasFreeBoardLimitDefined(team)) {
    return undefined;
  }

  const limit = team.limits.orgs.freeBoardsPerOrg;
  if (limit.count === undefined) {
    return undefined;
  }

  const delta = limit.disableAt - limit.count;

  return delta < 0 ? 0 : delta;
};

export const freeBoardsOver = (team: TeamModel): number => {
  if (isPremiumTeam(team) || !hasFreeBoardLimitDefined(team)) {
    return 0;
  }

  const limit = team.limits.orgs.freeBoardsPerOrg;
  if (limit.count === undefined) {
    return 0;
  }

  const delta = limit.disableAt - limit.count;

  return delta < 0 ? Math.abs(delta) : 0;
};

export const isCloseToFreeBoardLimit = (team: TeamModel): boolean => {
  const remaining = freeBoardsRemaining(team);

  if (!hasFreeBoardLimitDefined(team) || remaining === undefined) {
    return remaining !== undefined && remaining <= 7;
  }

  const { disableAt, warnAt } = team.limits.orgs.freeBoardsPerOrg;

  return remaining <= disableAt - warnAt;
};

export const isAtOrOverFreeBoardLimit = (team: TeamModel): boolean => {
  const remaining = freeBoardsRemaining(team);

  return remaining === 0;
};

export const isFreeBoardLimitOverridden = (team: TeamModel): boolean => {
  if (isPremiumTeam(team) || !hasFreeBoardLimitDefined(team)) {
    return false;
  }

  const limit = team.limits.orgs.freeBoardsPerOrg;

  return limit.disableAt !== 10;
};

export const openBoardCount = (team: TeamModel): number | undefined => {
  if (!hasFreeBoardLimitDefined(team)) {
    return undefined;
  }

  return team.limits.orgs.freeBoardsPerOrg.count;
};

export const createTeamInvite = (
  idTeam: string,
  teamName: string,
  teamUrl: string,
): Promise<string> => {
  // The invite post url does not seem to like a standard fetch
  // body and needs the token as form data to create the invite
  // secret correctly
  const requestBody = new FormData();
  requestBody.append('token', API.client.options.getToken());

  return fetch(`/1/organizations/${idTeam}/invitationSecret`, {
    method: 'POST',
    body: requestBody,
    headers: {
      'X-Trello-Client-Version': clientVersion,
    },
  })
    .then((res) => res.json())
    .then((data: { secret: string }) => data.secret)
    .then((secret) =>
      // /:teamName portion of the URL which is captured and
      // replaced with /invite/:teamName/:secret
      teamUrl.replace(/(\/[^/]+$)/, `/invite$1/${secret}`),
    );
};
