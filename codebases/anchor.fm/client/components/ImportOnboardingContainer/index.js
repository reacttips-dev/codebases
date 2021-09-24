import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  fetchTempVanitySlugFromPodcastName,
  resetOnboarding,
} from '../../onboarding';
import { ImportCreateAccount } from '../ImportOnboarding/ImportCreateAccount';
import { ImportLogin } from '../ImportOnboarding/ImportLogin';
import { ImportAlreadyLoggedIn } from '../ImportOnboarding/ImportAlreadyLoggedIn';
import { AnchorAPI } from '../../modules/AnchorAPI';
import { checkAuthentication } from '../../user';

export const ImportCreateAccountContainer = connect(
  ({ onboarding, user: { user, stationId } }) => ({
    stationId,
    userId: user ? user.userId : null,
    enableReinitialize: true,
    initialValues: {
      vanitySlug: onboarding.vanitySlug,
    },
    onboarding,
  }),
  dispatch => ({
    actions: {
      fetchTempVanitySlugFromPodcastName: () =>
        dispatch(fetchTempVanitySlugFromPodcastName()),
      redirectToSwitchPage: () => {
        dispatch(push('/switch/form'));
      },
      resetPersistedState: () => {
        dispatch(resetOnboarding());
      },
    },
  })
)(ImportCreateAccount);

export const ImportLoginContainer = connect(
  ({ onboarding, user: { user, stationId, menuMode } }) => ({
    stationId,
    userId: user ? user.userId : null,
    onboarding,
    menuMode,
  }),
  dispatch => ({
    actions: {
      redirectToSwitchPage: () => {
        dispatch(push('/switch/form'));
      },
      resetPersistedState: () => {
        dispatch(resetOnboarding());
      },
    },
  })
)(ImportLogin);

export const ImportAlreadyLoggedInContainer = connect(
  ({ onboarding, user: { user, stationId } }) => ({
    stationId,
    userId: user ? user.userId : null,
    onboarding,
    isFromSignup: false,
  }),
  dispatch => ({
    actions: {
      logOutAndRedirect: async redirectPath => {
        await AnchorAPI.logoutCurrentUser();
        await dispatch(
          checkAuthentication({ shouldRedirectToDashboard: false })
        );
        dispatch(push(redirectPath));
      },
      redirectToSwitchPage: () => {
        dispatch(push('/switch/form'));
      },
      resetPersistedState: () => {
        dispatch(resetOnboarding());
      },
    },
  })
)(ImportAlreadyLoggedIn);
