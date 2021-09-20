/* eslint-disable import/no-default-export */
import API from 'app/gamma/src/api';
import { normalizeMember } from 'app/gamma/src/api/normalizers/member';
import {
  LOAD_BOARD_SUCCESS,
  LoadBoardSuccessAction,
} from 'app/gamma/src/modules/loaders/load-board';
import {
  LOAD_HEADER_SUCCESS,
  LoadHeaderSuccessAction,
} from 'app/gamma/src/modules/loaders/load-header';
import {
  LoadMyBoardsSuccessAction,
  LOAD_MY_BOARDS_SUCCESS,
} from 'app/gamma/src/modules/loaders/load-my-boards';
import {
  LOAD_MEMBER_SUCCESS,
  LoadMemberSuccessAction,
} from 'app/gamma/src/modules/loaders/load-member';
import {
  isDeletedModel,
  SOCKET_MEMBER,
  SocketMemberAction,
  SOCKET_DROP_NON_PUBLIC,
  SocketDropNonPublic,
} from 'app/gamma/src/modules/sockets';
import { MemberResponse } from 'app/gamma/src/types/responses';
import { getMe } from 'app/gamma/src/selectors/members';
import {
  MemberMessagesDismissedModel,
  MemberModel,
  MemberPreferencesModel,
  NotificationEmailFrequency,
  LoginModel,
} from 'app/gamma/src/types/models';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import { Action, actionCreator, createReducer } from '@trello/redux';
import {
  UPDATE_MEMBER_PREFS,
  UpdateMemberPrefsAction,
} from 'app/gamma/src/modules/state/ui/member-home-profile';
import {
  GetSearchSuggestionsAction,
  PERFORM_SEARCH_SUCCESS,
  PerformSearchSuccessAction,
  SET_SEARCHED_SUGGESTIONS,
} from './search';
import { State } from 'app/gamma/src/modules/types';
import { Analytics } from '@trello/atlassian-analytics';
import { SourceType } from '@trello/atlassian-analytics/src/constants/Source';

const UPDATE_MARKETING_OPT_IN_REQUEST = Symbol(
  'models/UPDATE_MARKETING_OPT_IN_REQUEST',
);
const UPDATE_MARKETING_OPT_IN_SUCCESS = Symbol(
  'models/UPDATE_MARKETING_OPT_IN_SUCCESS',
);
const UPDATE_MARKETING_OPT_IN_ERROR = Symbol(
  'models/UPDATE_MARKETING_OPT_IN_ERROR',
);
const DISMISS_MESSAGE_REQUEST = Symbol('models/DISMISS_MESSAGE_REQUEST');
const DISMISS_MESSAGE_SUCCESS = Symbol('models/DISMISS_MESSAGE_SUCCESS');
const DISMISS_MESSAGE_ERROR = Symbol('models/DISMISS_MESSAGE_ERROR');
const DISMISS_ONE_TIME_MESSAGE_REQUEST = Symbol(
  'models/DISMISS_ONE_TIME_MESSAGE_REQUEST',
);
const DISMISS_ONE_TIME_MESSAGE_SUCCESS = Symbol(
  'models/DISMISS_ONE_TIME_MESSAGE_SUCCESS',
);
const DISMISS_ONE_TIME_MESSAGE_ERROR = Symbol(
  'models/DISMISS_ONE_TIME_MESSAGE_ERROR',
);

const SET_PRIMARY_EMAIL_REQUEST = Symbol('models/SET_PRIMARY_EMAIL_REQUEST');
const SET_PRIMARY_EMAIL_SUCCESS = Symbol('models/SET_PRIMARY_EMAIL_SUCCESS');
const SET_PRIMARY_EMAIL_ERROR = Symbol('models/SET_PRIMARY_EMAIL_ERROR');

const DELETE_EMAIL_REQUEST = Symbol('models/DELETE_EMAIL_REQUEST');
const DELETE_EMAIL_SUCCESS = Symbol('models/DELETE_EMAIL_SUCCESS');
const DELETE_EMAIL_ERROR = Symbol('models/DELETE_EMAIL_ERROR');

const DELETE_SECONDARY_EMAILS_REQUEST = Symbol(
  'models/DELETE_SECONDARY_EMAILS_REQUEST',
);
const DELETE_SECONDARY_EMAILS_SUCCESS = Symbol(
  'models/DELETE_SECONDARY_EMAILS_SUCCESS',
);
const DELETE_SECONDARY_EMAILS_ERROR = Symbol(
  'models/DELETE_SECONDARY_EMAILS_ERROR',
);

type UpdateMarketingOptInRequestAction = Action<
  typeof UPDATE_MARKETING_OPT_IN_REQUEST,
  { member: MemberModel; optedIn: boolean }
>;
type UpdateMarketingOptInSuccessAction = Action<
  typeof UPDATE_MARKETING_OPT_IN_SUCCESS,
  MemberResponse
>;
type UpdateMarketingOptInErrorAction = Action<
  typeof UPDATE_MARKETING_OPT_IN_ERROR,
  { member: MemberModel; error: Error }
>;
type DismissMessageRequestAction = Action<
  typeof DISMISS_MESSAGE_REQUEST,
  { member: MemberModel; dismissedMessage: MemberMessagesDismissedModel }
>;
type DismissMessageSuccessAction = Action<
  typeof DISMISS_MESSAGE_SUCCESS,
  MemberResponse
>;
type DismissMessageErrorAction = Action<
  typeof DISMISS_MESSAGE_ERROR,
  { member: MemberModel; name: string }
>;
type DismissOneTimeMessageRequestAction = Action<
  typeof DISMISS_ONE_TIME_MESSAGE_REQUEST,
  { member: MemberModel; name: string }
>;
type DismissOneTimeMessageSuccessAction = Action<
  typeof DISMISS_ONE_TIME_MESSAGE_SUCCESS,
  MemberResponse
>;
type DismissOneTimeMessageErrorAction = Action<
  typeof DISMISS_ONE_TIME_MESSAGE_ERROR,
  { member: MemberModel; name: string }
>;

type SetPrimaryEmailRequestAction = Action<
  typeof SET_PRIMARY_EMAIL_REQUEST,
  null
>;
type SetPrimaryEmailSuccessAction = Action<
  typeof SET_PRIMARY_EMAIL_SUCCESS,
  { me: MemberModel; emailId: string }
>;
type SetPrimaryEmailErrorAction = Action<typeof SET_PRIMARY_EMAIL_ERROR, null>;

type DeleteEmailRequestAction = Action<typeof DELETE_EMAIL_REQUEST, null>;
type DeleteEmailSuccessAction = Action<
  typeof DELETE_EMAIL_SUCCESS,
  { me: MemberModel; emailId: string }
>;
type DeleteEmailErrorAction = Action<typeof DELETE_EMAIL_ERROR, null>;

type DeleteSecondaryEmailsRequestAction = Action<
  typeof DELETE_SECONDARY_EMAILS_REQUEST,
  null
>;
type DeleteSecondaryEmailsSuccessAction = Action<
  typeof DELETE_SECONDARY_EMAILS_SUCCESS,
  { me: MemberModel; emailIds: Array<string | null> }
>;
type DeleteSecondaryEmailsErrorAction = Action<
  typeof DELETE_SECONDARY_EMAILS_ERROR,
  null
>;

const updateMarketingOptInRequest = actionCreator<UpdateMarketingOptInRequestAction>(
  UPDATE_MARKETING_OPT_IN_REQUEST,
);
const updateMarketingOptInSuccess = actionCreator<UpdateMarketingOptInSuccessAction>(
  UPDATE_MARKETING_OPT_IN_SUCCESS,
);
const updateMarketingOptInError = actionCreator<UpdateMarketingOptInErrorAction>(
  UPDATE_MARKETING_OPT_IN_ERROR,
);
const dismissMessageRequest = actionCreator<DismissMessageRequestAction>(
  DISMISS_MESSAGE_REQUEST,
);
const dismissMessageSuccess = actionCreator<DismissMessageSuccessAction>(
  DISMISS_MESSAGE_SUCCESS,
);
const dismissMessageError = actionCreator<DismissMessageErrorAction>(
  DISMISS_MESSAGE_ERROR,
);
const dismissOneTimeMessageRequest = actionCreator<DismissOneTimeMessageRequestAction>(
  DISMISS_ONE_TIME_MESSAGE_REQUEST,
);
const dismissOneTimeMessageSuccess = actionCreator<DismissOneTimeMessageSuccessAction>(
  DISMISS_ONE_TIME_MESSAGE_SUCCESS,
);
const dismissOneTimeMessageError = actionCreator<DismissOneTimeMessageErrorAction>(
  DISMISS_ONE_TIME_MESSAGE_ERROR,
);

const setPrimaryEmailRequest = actionCreator<SetPrimaryEmailRequestAction>(
  SET_PRIMARY_EMAIL_REQUEST,
);
const setPrimaryEmailSuccess = actionCreator<SetPrimaryEmailSuccessAction>(
  SET_PRIMARY_EMAIL_SUCCESS,
);
const setPrimaryEmailError = actionCreator<SetPrimaryEmailErrorAction>(
  SET_PRIMARY_EMAIL_ERROR,
);

const deleteEmailRequest = actionCreator<DeleteEmailRequestAction>(
  DELETE_EMAIL_REQUEST,
);
const deleteEmailSuccess = actionCreator<DeleteEmailSuccessAction>(
  DELETE_EMAIL_SUCCESS,
);
const deleteEmailError = actionCreator<DeleteEmailErrorAction>(
  DELETE_EMAIL_ERROR,
);

const deleteSecondaryEmailsRequest = actionCreator<DeleteSecondaryEmailsRequestAction>(
  DELETE_SECONDARY_EMAILS_REQUEST,
);
const deleteSecondaryEmailsSuccess = actionCreator<DeleteSecondaryEmailsSuccessAction>(
  DELETE_SECONDARY_EMAILS_SUCCESS,
);
const deleteSecondaryEmailsError = actionCreator<DeleteSecondaryEmailsErrorAction>(
  DELETE_SECONDARY_EMAILS_ERROR,
);

// Reducer
export interface MemberState {
  [memberId: string]: MemberModel;
}

const initialState: MemberState = {};
const upsertMember = (state: MemberState, member: MemberResponse) => {
  return {
    ...state,
    [member.id]: normalizeMember(member, state[member.id]),
  };
};

export default createReducer(initialState, {
  [LOAD_BOARD_SUCCESS](state, { payload }: LoadBoardSuccessAction) {
    const { members = [] } = payload;

    return members.reduce(
      (result, member) => upsertMember(result, member),
      state,
    );
  },

  [LOAD_MY_BOARDS_SUCCESS](state, { payload }: LoadMyBoardsSuccessAction) {
    return upsertMember(state, payload);
  },

  [LOAD_HEADER_SUCCESS](state, { payload }: LoadHeaderSuccessAction) {
    return upsertMember(state, payload);
  },

  [PERFORM_SEARCH_SUCCESS](state, { payload }: PerformSearchSuccessAction) {
    const { members = [], cards = [] } = payload;
    const cardMembers = cards.reduce((result, card) => {
      return result.concat(card.members ? card.members : []);
    }, [] as MemberResponse[]);

    return members
      .concat(cardMembers)
      .reduce((result, m) => upsertMember(result, m), state);
  },

  [SET_SEARCHED_SUGGESTIONS](state, { payload }: GetSearchSuggestionsAction) {
    const { members = [], cards = [] } = payload;
    const cardMembers = cards.reduce((result, card) => {
      return result.concat(card.members ? card.members : []);
    }, [] as MemberResponse[]);

    return members
      .concat(cardMembers)
      .reduce((result, m) => upsertMember(result, m), state);
  },

  [SOCKET_DROP_NON_PUBLIC](state, { payload: memberId }: SocketDropNonPublic) {
    return {
      ...state,
      [memberId]: {
        ...state[memberId],
        nonPublic: {},
      },
    };
  },

  [UPDATE_MEMBER_PREFS](state, { payload }: UpdateMemberPrefsAction) {
    return upsertMember(state, payload);
  },

  [SOCKET_MEMBER](state, { payload }: SocketMemberAction) {
    if (isDeletedModel(payload)) {
      const { [payload.id]: removed, ...remaining } = state;

      return remaining;
    }
    return upsertMember(state, payload);
  },

  [LOAD_MEMBER_SUCCESS](state, { payload }: LoadMemberSuccessAction) {
    return upsertMember(state, payload);
  },

  [UPDATE_MARKETING_OPT_IN_REQUEST](
    state,
    { payload }: UpdateMarketingOptInRequestAction,
  ) {
    const { member, optedIn } = payload;

    return {
      ...state,
      [member.id]: {
        ...member,
        marketingOptIn: {
          date: new Date().toISOString(),
          optedIn,
        },
      },
    };
  },

  [UPDATE_MARKETING_OPT_IN_SUCCESS](
    state,
    { payload: member }: UpdateMarketingOptInSuccessAction,
  ) {
    return upsertMember(state, member);
  },

  [UPDATE_MARKETING_OPT_IN_ERROR](
    state,
    { payload }: UpdateMarketingOptInErrorAction,
  ) {
    const { member } = payload;

    return {
      ...state,
      [member.id]: {
        ...member,
        marketingOptIn: {},
      },
    };
  },

  [DISMISS_MESSAGE_REQUEST](state, { payload }: DismissMessageRequestAction) {
    const { member, dismissedMessage } = payload;
    const messagesDismissed = member.messagesDismissed || [];

    return {
      ...state,
      [member.id]: {
        ...member,
        messagesDismissed: [...messagesDismissed, dismissedMessage],
      },
    };
  },

  [DISMISS_MESSAGE_SUCCESS](
    state,
    { payload: member }: DismissMessageSuccessAction,
  ) {
    return upsertMember(state, member);
  },

  [DISMISS_MESSAGE_ERROR](state, { payload }: DismissMessageErrorAction) {
    const { member, name } = payload;
    const messagesDismissed = (member.messagesDismissed || []).filter(
      (message) => message.name !== name,
    );

    return {
      ...state,
      [member.id]: {
        ...member,
        messagesDismissed: [...messagesDismissed],
      },
    };
  },

  [DISMISS_ONE_TIME_MESSAGE_REQUEST](
    state,
    { payload }: DismissOneTimeMessageRequestAction,
  ) {
    const { member, name } = payload;
    const oneTimeMessagesDismissed = member.oneTimeMessagesDismissed || [];

    return {
      ...state,
      [member.id]: {
        ...member,
        oneTimeMessagesDismissed: [...oneTimeMessagesDismissed, name],
      },
    };
  },

  [DISMISS_ONE_TIME_MESSAGE_SUCCESS](
    state,
    { payload: member }: DismissOneTimeMessageSuccessAction,
  ) {
    return upsertMember(state, member);
  },

  [DISMISS_ONE_TIME_MESSAGE_ERROR](
    state,
    { payload }: DismissOneTimeMessageErrorAction,
  ) {
    const { member, name } = payload;
    const oneTimeMessagesDismissed = (
      member.oneTimeMessagesDismissed || []
    ).filter((message) => message !== name);

    return {
      ...state,
      [member.id]: {
        ...member,
        oneTimeMessagesDismissed: [...oneTimeMessagesDismissed],
      },
    };
  },

  [SET_PRIMARY_EMAIL_SUCCESS](
    state,
    { payload: { me, emailId } }: SetPrimaryEmailSuccessAction,
  ) {
    return {
      ...state,
      [me.id]: {
        ...me,
        logins:
          me.logins &&
          me.logins.map((login) => ({
            ...login,
            primary: login.id === emailId,
          })),
      },
    };
  },

  [DELETE_EMAIL_SUCCESS](
    state,
    { payload: { me, emailId } }: DeleteEmailSuccessAction,
  ) {
    return {
      ...state,
      [me.id]: {
        ...me,
        logins: me.logins && me.logins.filter((login) => login.id !== emailId),
      },
    };
  },

  [DELETE_SECONDARY_EMAILS_SUCCESS](
    state,
    { payload: { me, emailIds } }: DeleteSecondaryEmailsSuccessAction,
  ) {
    return {
      ...state,
      [me.id]: {
        ...me,
        logins:
          me.logins &&
          me.logins.filter((login) => emailIds.indexOf(login.id) === -1),
      },
    };
  },
});

// Action creators
export const updateMemberPrefs = ({
  id,
  prefType,
  pref,
}: {
  id: string;
  prefType: keyof MemberPreferencesModel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pref: any;
}): StandardThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      const member = await API.client.rest.put(`members/${id}`, {
        query: { [`prefs/${prefType}`]: pref },
      });

      dispatch(actionCreator(UPDATE_MEMBER_PREFS)(member));

      Analytics.sendTrackEvent({
        action: 'updated',
        actionSubject: prefType,
        source: 'appHeader', // these actions are usually dispatched via the header, not the member prefs page
        attributes: {
          updatedOn: 'member',
          value: pref,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const updateNotificationEmailFrequency = (
  frequency: NotificationEmailFrequency,
): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const me = getMe(getState());

    if (!me) {
      return;
    }

    dispatch(
      updateMemberPrefs({
        id: me.id,
        prefType: 'minutesBetweenSummaries',
        pref: frequency,
      }),
    );
  };
};

export const updateMarketingOptIn = (optedIn: boolean): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const me = getMe(getState());
    if (!me) {
      return;
    }

    try {
      dispatch(
        updateMarketingOptInRequest({
          member: me,
          optedIn,
        }),
      );

      const member = await API.client.rest.put<MemberResponse>('members/me', {
        body: { 'marketingOptIn/optedIn': optedIn },
        // `doNotRetry` is set so that optimistic rollbacks work
        // in the case of a failure
        doNotRetry: true,
      });

      dispatch(updateMarketingOptInSuccess(member));

      // this is also being tracked in `marketing-opt-in-banner`, do we still need this?
      Analytics.sendTrackEvent({
        action: 'updated',
        actionSubject: 'optedIn',
        source: 'appHeader',
        attributes: {
          updatedOn: 'member',
          value: optedIn,
        },
      });
    } catch (err) {
      dispatch(
        updateMarketingOptInError({
          member: me,
          error: err,
        }),
      );
    }
  };
};

export const addDismissedMessage = (name: string): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const me = getMe(getState());
    if (!me) {
      return;
    }

    try {
      dispatch(
        dismissMessageRequest({
          member: me,
          dismissedMessage: {
            _id: '',
            count: 1,
            lastDismissed: new Date().toISOString(),
            name,
          },
        }),
      );

      const member = await API.client.rest.post<MemberResponse>(
        'members/me/messagesDismissed',
        {
          body: { name },
        },
      );

      dispatch(dismissMessageSuccess(member));
    } catch (err) {
      dispatch(
        dismissMessageError({
          member: me,
          name,
        }),
      );
    }
  };
};

export const addOneTimeDismissedMessage = (
  name: string,
): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const me = getMe(getState());
    if (!me) {
      return;
    }

    try {
      dispatch(
        dismissOneTimeMessageRequest({
          member: me,
          name,
        }),
      );

      const member = await API.client.rest.post<MemberResponse>(
        'members/me/oneTimeMessagesDismissed',
        {
          body: { value: name },
        },
      );

      dispatch(dismissOneTimeMessageSuccess(member));
    } catch (err) {
      dispatch(
        dismissOneTimeMessageError({
          member: me,
          name,
        }),
      );
    }
  };
};

const _setPrimaryEmail = async (
  email: LoginModel,
  dispatch: Dispatch,
  getState: () => State,
  source?: SourceType,
): Promise<object> => {
  dispatch(setPrimaryEmailRequest());

  const { _value } = await API.client.rest.put(
    `members/me/logins/${email.id}/primary`,
  );

  if (_value !== 'OK') {
    // Should only happen if the user is doing something fishy
    throw new Error('Could not set Email as Primary');
  }

  const me = getMe(getState());

  if (!me) {
    // This shouldn't really happen, but there you have it.
    throw new Error('Member not found');
  }

  if (source) {
    Analytics.sendTrackEvent({
      action: 'updated',
      actionSubject: 'primaryEmail',
      source,
      attributes: {
        totalAccountEmails: me && me.logins ? me.logins.length : 0,
      },
    });
  }

  return dispatch(
    setPrimaryEmailSuccess({
      me,
      emailId: email.id,
    }),
  );
};

export const setPrimaryEmail = (
  email: LoginModel,
  source?: SourceType,
): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    try {
      await _setPrimaryEmail(email, dispatch, getState, source);
    } catch (err) {
      dispatch(setPrimaryEmailError());
    }
  };
};

export const deleteLogin = (
  email: LoginModel,
  source?: SourceType,
): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    try {
      dispatch(deleteEmailRequest());
      let me = getMe(getState());

      const totalEmailsBefore = me && me.logins ? me.logins.length : 0;

      const { _value } = await API.client.rest.del(
        `members/me/logins/${email.id}`,
      );

      if (_value !== 'OK') {
        // Should only happen if the user is doing something fishy
        throw new Error('Could not delete Email');
      }

      if (!me) {
        // This shouldn't really happen, but there you have it.
        throw new Error('Member not found');
      }

      dispatch(
        deleteEmailSuccess({
          me,
          emailId: email.id,
        }),
      );

      me = getMe(getState());
      if (source) {
        Analytics.sendTrackEvent({
          action: 'deleted',
          actionSubject: 'secondaryEmail',
          source,
          attributes: {
            totalAccountEmailsBefore: totalEmailsBefore,
            totalAccountEmailsAfter: me && me.logins ? me.logins.length : 0,
          },
        });
      }
    } catch (err) {
      dispatch(deleteEmailError());
    }
  };
};

export const setPrimaryEmailAndDeleteSecondaries = (
  email: LoginModel,
  secondaries: LoginModel[],
  source?: SourceType,
): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    try {
      await _setPrimaryEmail(email, dispatch, getState);
    } catch (err) {
      dispatch(setPrimaryEmailError());
    }
    try {
      let me = getMe(getState());
      const totalEmailsBefore = me && me.logins ? me.logins.length : 0;
      dispatch(deleteSecondaryEmailsRequest());

      const values = [];
      for (const secondaryEmail of secondaries) {
        values.push(
          await API.client.rest.del(`members/me/logins/${secondaryEmail.id}`),
        );
      }

      const deletedEmails = values
        .map(({ _value }, idx) => {
          return _value === 'OK' ? secondaries[idx].id : null;
        })
        .filter((value) => value !== null);

      if (deletedEmails.length === 0) {
        throw new Error('Could not delete secondary emails');
      }

      if (!me) {
        // This shouldn't really happen, but there you have it.
        throw new Error('Member not found');
      }

      dispatch(deleteSecondaryEmailsSuccess({ me, emailIds: deletedEmails }));

      if (source) {
        me = getMe(getState());
        Analytics.sendTrackEvent({
          action: 'deleted',
          actionSubject: 'secondaryEmail',
          source,
          attributes: {
            totalAccountEmailsBefore: totalEmailsBefore,
            totalAccountEmailsAfter: me && me.logins ? me.logins.length : 0,
          },
        });
      }
    } catch (err) {
      dispatch(deleteSecondaryEmailsError());
    }
  };
};
