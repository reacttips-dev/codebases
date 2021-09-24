import React from 'react';
import * as Sentry from '@sentry/browser';

import { trackEvent } from 'modules/analytics';
import {
  fetchPartnerIds,
  PartnerIdsResponse,
} from 'modules/AnchorAPI/user/fetchPartnerIds';
import { getCurrentUser } from 'client/user';
import { State } from './types';

const { useEffect, useReducer } = React;
const FETCH = 'FETCH';
const RECEIVE_USER = 'RECEIVE_USER';
const FETCH_USER_FAILED = 'FETCH_USER_FAILED';
const RESET = 'RESET';
const RECEIVE_PARTNER_IDS = 'RECEIVE_PARTNER_IDS';

const initialState: State = {
  userId: null,
  webStationId: null,
  status: 'idle',
  imageUrl: null,
  partnerIds: {
    optimizely: undefined,
    mparticle: undefined,
  },
};

type Action =
  | { type: typeof FETCH }
  | { type: typeof RECEIVE_USER; payload: CurrentUserResponse }
  | {
      type: typeof RECEIVE_PARTNER_IDS;
      payload: PartnerIdsResponse;
    }
  | { type: typeof RESET }
  | { type: typeof FETCH_USER_FAILED; error: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case FETCH:
      return { ...state, status: 'loading', error: undefined };
    case RECEIVE_USER: {
      // if we have user data, set that into state
      if (action.payload && action.payload.user) {
        const {
          payload: {
            user: { userId, stationId: webStationId, name, imageUrl },
          },
        } = action;
        return {
          ...state,
          userId,
          webStationId,
          name,
          imageUrl,
          status: 'success',
        };
      }
      return { ...state, status: 'success' };
    }
    case RECEIVE_PARTNER_IDS: {
      const { optimizely, mparticle } = action.payload;
      return {
        ...state,
        partnerIds: {
          optimizely,
          mparticle,
        },
      };
    }
    case FETCH_USER_FAILED:
      return {
        ...state,
        error: action.error,
        status: 'error',
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
};

type CurrentUserResponse = {
  user?: {
    imageUrl: string | null;
    name: string;
    networkRoleUserId: number;
    stationId: string;
    userId: number;
  };
};

const useCurrentUser = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const fetchCurrentUser = async (isFromSignup?: boolean) => {
    dispatch({ type: FETCH });
    try {
      const currentUserResponse: CurrentUserResponse = await getCurrentUser();
      const userId = currentUserResponse.user?.userId;
      dispatch({
        type: RECEIVE_USER,
        payload: currentUserResponse,
      });

      if (userId) {
        const partnerIds = await fetchPartnerIds(userId);
        dispatch({
          type: RECEIVE_PARTNER_IDS,
          payload: partnerIds,
        });

        if (isFromSignup && partnerIds.mparticle) {
          /**
           * Upon fetching IDs after signup, we must await mParticle.EventType
           * and customerid before we can track the 'onboarding_completed' event.
           * These properties becomes available after initializeWithUser() is
           * called in our App component's useEffect hook.
           */
          let attempts = 0;
          const trackOnboardingCompleted = (maxAttempts = 50) => {
            attempts = attempts + 1;

            if (
              typeof mParticle !== 'undefined' &&
              mParticle.EventType &&
              mParticle.Identity.getCurrentUser?.()?.getUserIdentities()
                .userIdentities.customerid
            ) {
              trackEvent(
                'onboarding_completed',
                { type: 'email' },
                { providers: [mParticle] }
              );
              return;
            }
            if (attempts === maxAttempts) {
              Sentry.captureException(
                new Error(
                  'Unable to track onboarding_completed event (exceeded max attempts)'
                )
              );
              return;
            }
            setTimeout(trackOnboardingCompleted, 1000);
          };
          setTimeout(trackOnboardingCompleted, 1000);
        }
      }
    } catch (err) {
      const message = err.message ? err.message : '';
      dispatch({
        type: FETCH_USER_FAILED,
        error: `Failed to getCurrentUser ${message}`,
      });
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);
  function resetCurrentUser() {
    dispatch({ type: RESET });
  }
  return { state, dispatch, fetchCurrentUser, resetCurrentUser };
};

export { useCurrentUser };
