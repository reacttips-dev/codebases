/* eslint-disable react/prop-types */
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, CookieProvider, EventsProvider  } from '@skillshare/ui-components/components/providers';
import { ApolloClientManager } from '@skillshare/ui-components/shared/apollo';
import { DefaultThemeProvider } from '@skillshare/ui-components/themes';
import { GamificationBanner } from '@skillshare/ui-components/Gamification/GamificationBanner';
import { GamificationModal } from '@skillshare/ui-components/GamificationModal/GamificationModal';
import { GamificationToast } from '@skillshare/ui-components/GamificationToast/GamificationToast';
import { GAMIFICATION_ACTION_STEPS } from '@skillshare/ui-components/GamificationToast/GamificationToastCopy';

const shouldInitializeGamification = (rootElement) =>  {
  const requestSource = SS.serverBootstrap.requestSource;
  const nonAllowedSources = ['iphone_web', 'android_web'];
  const isSourceNotAllowed = nonAllowedSources.includes(requestSource);

  return !!rootElement && !isSourceNotAllowed;
};

const getElement = (classSelector) => {
  const element = document.querySelector(classSelector);

  if (!shouldInitializeGamification(element)) {
    return null;
  }

  return element;
}

const GamificationWrapper = (props) => {
  const apiHost = SS.serverBootstrap?.apiData?.host;

  if (!apiHost) {
    return (<></>);
  } 

  const client = ApolloClientManager.getClient({
    uri: `${apiHost}/api/graphql`,
  });

  
  return (
    <ApolloProvider client={client}>
      <DefaultThemeProvider>
        { props.children }
      </DefaultThemeProvider>
    </ApolloProvider>
  );
};

const initializeGamificationBanner = () => {
  const banner = getElement('.gamification-banner');
  const alert = document.querySelector('.site-alert');
  const csrfToken = $.cookie('YII_CSRF_TOKEN');
  const trackEventHandler = SS.EventTracker.trackingCallback();
  if (alert && banner) {
   alert.classList.add('gamification-alert')
  }
  return banner && ReactDOM.render(
    <CookieProvider cookies={{ YII_CSRF_TOKEN: csrfToken }}>
      <EventsProvider trackEventHandler={trackEventHandler}>
        <GamificationWrapper>
          <GamificationBanner
            content="Get started on your creative journey."
          />
        </GamificationWrapper>
      </EventsProvider>
    </CookieProvider>,
    banner
  );
};

const initializeGamificationModal = () => {
  const modal = getElement('.gamification-modal');

  return modal && ReactDOM.render(
    <GamificationWrapper>
      <GamificationModal
        imageSrc="http://static.skillshare.com/assets/images/homepage/modal/gamification-modal.png"
      />
    </GamificationWrapper>,
    modal
  );
};

const getOrCreateToastSelector = (baseClass) => {
  const fullScreenContainer = document.querySelector('.vjs-fullscreen');

  if (!fullScreenContainer) {
    return `.${baseClass}`;
  }

  const toastFullScreenClass = `${baseClass}-fullscreen`;
  const toastFullScreenSelector = `.${toastFullScreenClass}`;
  const toastFullScreen = document.querySelector(toastFullScreenSelector);

  if (!toastFullScreen) {
    const div = document.createElement('div');
    div.classList.add(toastFullScreenClass);
    fullScreenContainer.insertAdjacentElement('afterbegin', div);
  }

  return toastFullScreenSelector;
}

const initializeGamificationToast = (step, isVideoPlayer = false) => {
  const baseToastClass = 'gamification-toast';
  const toastSelector = isVideoPlayer ? getOrCreateToastSelector(baseToastClass) : `.${baseToastClass}`;
  const toast = getElement(toastSelector);
  const url = '/home?via=toast';

  return toast && ReactDOM.render(
    <GamificationWrapper>
      <GamificationToast
          actionStep={step}
          key={Date.now()}
          path={url}
      />
    </GamificationWrapper>,
    toast
  );
};

export {
  initializeGamificationBanner,
  initializeGamificationModal,
  initializeGamificationToast,
  GAMIFICATION_ACTION_STEPS
} ;
