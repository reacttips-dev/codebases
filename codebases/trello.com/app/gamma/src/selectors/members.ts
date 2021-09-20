import { State } from 'app/gamma/src/modules/types';
import {
  AccessLevel,
  MemberModel,
  NotificationEmailFrequency,
  TeamModel,
} from 'app/gamma/src/types/models';
import { getMyId } from './session';

import { idToDate } from '@trello/dates';
import { getMilliseconds } from '@trello/time';

export const getMemberById = (
  state: State,
  idMember: string,
): MemberModel | undefined => state.models.members[idMember];

export const getMembersByIds = (
  state: State,
  idMembers: string[] = [],
): MemberModel[] =>
  idMembers.reduce((result, idMember) => {
    const member = getMemberById(state, idMember);
    if (member) {
      result.push(member);
    }

    return result;
  }, [] as MemberModel[]);

export const getMemberByFullName = (state: State, fullName: string) =>
  Object.values(state.models.members).find(
    (member: MemberModel) => member.name === fullName,
  );

export const getMemberByIdMemberOrUsername = (
  state: State,
  idMemberOrUserName: string,
) =>
  Object.values(state.models.members).find(
    (member: MemberModel) =>
      member.username === idMemberOrUserName ||
      member.id === idMemberOrUserName,
  );

export const getMe = (state: State): MemberModel | undefined =>
  state.models.members[getMyId(state)];

export const getMyLocalePreference = (state: State) => {
  const me = getMe(state);

  return me && me.prefs && me.prefs.locale ? me.prefs.locale : 'en-US';
};

export const isColorBlind = (state: State): boolean => {
  const user = getMe(state);

  return user && user.prefs ? user.prefs.colorBlind : false;
};

export const isTeamAdmin = (state: State, team: TeamModel | null): boolean => {
  const idMe = getMyId(state);

  return (
    team !== null &&
    team.memberships !== undefined &&
    team.memberships.some(
      (membership) =>
        membership.type === AccessLevel.Admin &&
        membership.idMember === idMe &&
        !membership.deactivated,
    )
  );
};

export const isVirtualMember = (state: State, member: MemberModel | string) => {
  const m = typeof member === 'string' ? getMemberById(state, member) : member;

  return !!m && m.memberType === AccessLevel.Ghost;
};

export const getNotificationEmailFrequency = (state: State) => {
  const me = getMe(state);

  if (!me || !me.prefs) {
    return NotificationEmailFrequency.Instantly;
  }

  return me.prefs.minutesBetweenSummaries;
};

export const isMessageDismissed = (state: State, name: string) => {
  const me = getMe(state);
  if (!me || typeof me.messagesDismissed === 'undefined') {
    return true;
  }

  const messagesDismissed = me.messagesDismissed || [];

  return !!messagesDismissed.find((message) => message.name === name);
};

export const isOneTimeMessageDismissed = (state: State, name: string) => {
  const me = getMe(state);
  if (!me) {
    return false;
  }

  const oneTimeMessagesDismissed = me.oneTimeMessagesDismissed || [];

  return !!oneTimeMessagesDismissed.find((message) => message === name);
};

export const getCampaign = (state: State, name: string) => {
  const me = getMe(state);

  if (!me) {
    return null;
  }

  const campaigns = me.campaigns || [];

  return campaigns.find((campaign) => campaign.name === name) || null;
};

export const shouldShowMeMarketingOptIn = (state: State) => {
  const me = getMe(state);
  if (!me) {
    return false;
  }

  const isConfirmed = !!me.confirmed;

  const isMoreThanThreeDaysOld =
    new Date().getTime() - idToDate(me.id).getTime() >
    getMilliseconds({ days: 3 });

  const hasSetMarketingOptIn =
    me.marketingOptIn &&
    Object.prototype.hasOwnProperty.call(me.marketingOptIn, 'date');

  return isConfirmed && isMoreThanThreeDaysOld && !hasSetMarketingOptIn;
};

export const shouldShowMeNoticeOfTosChange = (state: State) => {
  const me = getMe(state);
  if (!me) {
    return false;
  }

  const hasDismissedMessage = isMessageDismissed(
    state,
    '1-nov-2018-tos-change-accepted',
  );

  //  Show notice of ToS change if the user's account was created before
  //  November 1, 2018 and the user has not already dismissed the message by
  //  clicking "I Agree"
  return new Date(2018, 10, 1) > idToDate(me.id) && !hasDismissedMessage;
};

export const memberHasOtherNotifications = (state: State) =>
  shouldShowMeMarketingOptIn(state) || shouldShowMeNoticeOfTosChange(state);
