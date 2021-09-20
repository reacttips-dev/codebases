// We wanted to conditionally import sdk browser APIs only for target 'browser'.
// This `preload_script` will be replaced by the browser preload script path at the compile time by webpack
// For desktop app this `preload_script` import is proxied
import 'preload_script';
import React from 'react';
import { render } from 'react-dom';

// Initialize aether
import { light, dark } from '@postman/aether';

// CSS imports to create CSS bundle
import BaselineStyles from '../../../styles/baseline.scss';
import '@postman/aether/esmLib/styles/index.scss';

// Components needed for initial render
import CrashHandler from '../../components/empty-states/CrashHandler';
import { ThemeProvider } from 'styled-components';
import Platform from './Platform';

// Init import
import platformInit from './init';

// Other imports
import getPartitionIdForSignedOutUser from '../../modules/partition-manager/getPartitionIdForSignedOutUser';

// Route and logged in state detection
import { isHomePageActive } from '../../../onboarding/src/features/Homepage/utils';
const isLoggedIn = window && window.USER_ID && window.USER_ID !== '0';

/**
 * Hides the placeholder loading state
 */
function hideLoadingState () {
  let loader = document.getElementsByClassName('pm-loader')[0];
  loader && loader.classList.add('is-hidden');
}

/**
 * Fetches theme for home
 */
function getTheme () {
  const themes = { light, dark };
  let theme = {
    name: 'light',
    ...themes['light']
  };
  let settingsPartition = localStorage.getItem(`settings-${getPartitionIdForSignedOutUser()}`);
  settingsPartition = settingsPartition ? JSON.parse(settingsPartition) : null;
  if (settingsPartition && settingsPartition.postmanTheme) {
    theme = {
      name: settingsPartition.postmanTheme,
      ...themes[settingsPartition.postmanTheme]
    };
  }
  return theme;
}

const rootEl = document.getElementById('app-root');

/**
 *
 * @param {*} err
 * @returns
 */
function renderPlatformUI (err) {
  // We hide the loading state just before the point when we are rendering the requester. Earlier,
  // this was happening while initializing ThemeDomDelegator. This was causing an issue where there
  // was a blank white screen rendered after the loader was hidden and before the requester got
  // rendered. This was resulting in a jarring experience while loading the app.
  hideLoadingState();

  if (err) {
    render(<CrashHandler showError />, rootEl);
    return;
  }

  render(
    <CrashHandler>
      <ThemeProvider theme={getTheme()}>
        <Platform />
      </ThemeProvider>
    </CrashHandler>,
    rootEl,
    () => {}
  );
}

platformInit(() => {
  if (!isLoggedIn && isHomePageActive()) {
    renderPlatformUI();
  } else {
    import(/* webpackChunkName: "requester-legacy" */ '../requester/index').then(({ default: requesterInit }) => {
      requesterInit();
    });
  }
});
