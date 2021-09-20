// eslint-disable-next-line no-restricted-imports
import $ from 'jquery';
import React, { useEffect, Suspense } from 'react';

import { domReady, initializeLayers } from './doc-init';

import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { GlobalErrorHandler } from 'app/src/components/GlobalErrorHandler';
import { Banners } from 'app/src/components/Banners/Banners';
import {
  LayerManager,
  LayerManagerPortal,
  Layers,
} from 'app/src/components/LayerManager';
import { Header } from 'app/src/components/Header';
import Overlays from 'app/gamma/src/components/overlays';
import BoardsMenu from 'app/gamma/src/components/boards-menu';
import { MinimumVersionUpdater } from 'app/src/components/MinimumVersionUpdater';

import Backbone from '@trello/backbone';
import { Controller } from 'app/scripts/controller';
import 'app/scripts/debug/client-version-header';
import { Dates } from 'app/scripts/lib/dates';
import { Monitor } from 'app/scripts/lib/monitor';
import { WindowSize } from 'app/scripts/lib/window-size';
import { SessionStatus } from 'app/scripts/network/session-status';
import { ModelCache } from 'app/scripts/db/model-cache';
import { classicUpdaterClient } from 'app/scripts/network/classic-updater-client';
import { ColorBlindSupport } from 'app/src/components/ColorBlindSupport';

import './TrelloOnline.less';
import { PopoverBoundary } from '@trello/nachos/popover-boundary';
import { useAnalyticsContext } from './useAnalyticsContext';
import { useTimezoneUpdater } from './useTimezoneUpdater';
import { useDisconnectAlert } from './useDisconnectAlert';
import { useEmojiProvider } from './useEmojiProvider';
import { useHelpShortcut } from './useHelpShortcut';
import { useAnimatedLabels } from './useAnimatedLabels';
import { usePinnedBoardsMenu } from './usePinnedBoardsMenu';
import { useWindowSizeClass } from './useWindowSizeClass';
import { useDialogPositioner } from './useDialogPositioner';
import { usePopoverPositioner } from './usePopoverPositioner';
import { useSocketTracing } from './useSocketTracing';
import { Surface } from './Surface';
import { usePageTracking } from './usePageTracking';
import { useIframeSourcePreservation } from './useIframeSourcePreservation';
import { HeaderSkeleton } from 'app/src/components/HeaderSkeleton';
import { ChunkLoadErrorBoundary } from 'app/src/components/ChunkLoadErrorBoundary';
import {
  LazyWorkspaceNavigation,
  useWorkspaceNavigation,
  useWorkspaceNavigationHidden,
  useWorkspaceNavigationStateUpdater,
} from 'app/src/components/WorkspaceNavigation';
import { Flags } from '@trello/nachos/experimental-flags';
import { useWorkspaceStateUpdater } from '@trello/workspaces';
import { useLocationStateUpdater } from '@trello/router';
import { useRouteId, RouteId, isBoardRoute, isCardRoute } from '@trello/routes';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { ApolloSandbox } from 'app/src/components/ApolloSandbox';
import { useLazyComponent } from '@trello/use-lazy-component';

export const TrelloOnline = () => {
  useDisconnectAlert();
  usePageTracking();
  useIframeSourcePreservation();

  const staticIcons = useFeatureFlag('fep.static-icons', false);
  useEffect(() => {
    if (staticIcons) {
      document.body.classList.add('ff-static-icons');
    }
    return () => {
      document.body.classList.remove('ff-static-icons');
    };
  }, [staticIcons]);

  // THESE HOOKS ARE MOSTLY GLOBAL BEHAVIOR USING LEGACY JQUERY LOGIC. THEY
  // SHOULD EVENTUALLY MOVE CLOSER TO THEIR RELATED CODE AND BE DONE IN A MORE
  // CONVENTIONAL "REACT" WAY.

  // Updates the users timezone preference on the server when it notices a
  // timezone change on the client.
  useTimezoneUpdater();

  // Wires up the listener for the "?" keyboard shortcut, which is used to
  // access the shortcuts page or dialog.
  useHelpShortcut();

  // Wires up the listener for switching between text and non-text labels on
  // boards (which requires a class on the board for animations and dragging).
  useAnimatedLabels();

  // Wires up the listener for pinning and unpinning the boards menu. It's
  // possible that this code is entirely unused with the boards menu rewrite.
  usePinnedBoardsMenu();

  // Wires up a listener for window resize and publishes an event when we switch
  // between small, medium, large, and extra large. This event is observed from
  // the calendar PowerUp.
  useWindowSizeClass();

  // Repositions dialogs on window resize.
  useDialogPositioner();

  // Repositions popovers on window resize.
  usePopoverPositioner();

  // Sends Cloud SLA success events for received socket updates
  useSocketTracing();

  // Keeps location state up to date as user navigates between routes
  useLocationStateUpdater();

  // Keeps workspace state up to date as user navigates between routes
  useWorkspaceStateUpdater();

  // Keeps workspace navigation state up to date
  useWorkspaceNavigationStateUpdater();

  // Gets default analytics attributes for the Analytics Client on route changes
  useAnalyticsContext();

  // Get emoji data for usage in reactions and markdown
  useEmojiProvider();

  const AccessibilityMenuOptions = useLazyComponent(
    () => import(/* webpackChunkName: "accessibility" */ '@trello/a11y'),
    {
      namedImport: 'AccessibilityMenuOptions',
    },
  );

  const MobileAppDownloadPrompt = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "mobile-app-download-prompt" */ 'app/src/components/MobileAppDownloadPrompt'
      ),
    {
      namedImport: 'MobileAppDownloadPrompt',
    },
  );

  useEffect(() => {
    domReady();

    initializeLayers();

    const classicBody = $('#trello-root');

    const intervalId = window.setInterval(() => {
      Dates.update(classicBody);
      // @ts-expect-error
      Dates.trigger('renderInterval', Date.now());
    }, 10 * 1000);

    SessionStatus.start();
    Monitor.init();
    Controller.start().then(() => {
      Backbone.history.start({ pushState: true });
    });
    WindowSize.ensureRun();

    classicUpdaterClient.subscribe(({ typeName, delta }) => {
      ModelCache.enqueueRpcDelta(typeName, delta);
    });

    return () => {
      Controller.stop();
      window.clearInterval(intervalId);
    };
  }, []);

  const [
    {
      expanded: workspaceNavigationExpanded,
      enabled: workspaceNavigationEnabled,
    },
  ] = useWorkspaceNavigation();
  const [
    { hidden: workspaceNavigationHidden },
  ] = useWorkspaceNavigationHidden();
  const routeId = useRouteId();
  const isOnboardingFlow =
    routeId === RouteId.CREATE_FIRST_BOARD ||
    routeId === RouteId.CREATE_FIRST_TEAM;
  const isBoardOrCard = isBoardRoute(routeId) || isCardRoute(routeId);
  const showWorkspaceNav = workspaceNavigationEnabled && !isOnboardingFlow;

  const mainContentStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'auto',
  };

  if (
    showWorkspaceNav &&
    !workspaceNavigationHidden &&
    workspaceNavigationExpanded
  ) {
    mainContentStyles['paddingLeft'] = '260px';
  } else if (
    showWorkspaceNav &&
    !workspaceNavigationHidden &&
    !isBoardOrCard &&
    !workspaceNavigationExpanded
  ) {
    mainContentStyles['paddingLeft'] = '40px';
  }

  return (
    <ErrorBoundary
      errorHandlerComponent={GlobalErrorHandler}
      sendCrashEvent={true}
      tags={{ fromGlobalErrorBoundary: 'true' }}
    >
      <MinimumVersionUpdater>
        <ColorBlindSupport />
        <LayerManager>
          <BoardsMenu />
          <Surface>
            <ChunkLoadErrorBoundary
              fallback={<HeaderSkeleton />}
              retryAfter={15000}
            >
              <Header />
            </ChunkLoadErrorBoundary>
            <PopoverBoundary>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flex: 1,
                  position: 'relative',
                  overflowY: 'auto',
                }}
              >
                {showWorkspaceNav ? <LazyWorkspaceNavigation /> : null}
                <div style={mainContentStyles}>
                  <div
                    style={
                      showWorkspaceNav &&
                      !workspaceNavigationHidden &&
                      isBoardOrCard &&
                      !workspaceNavigationExpanded
                        ? { paddingLeft: '40px' }
                        : {}
                    }
                  >
                    <Banners />
                    <div id="banners" />
                  </div>
                  <div id="content" />
                </div>
              </div>
            </PopoverBoundary>
            <div id="footer">
              <div id="contact-us" style={{ display: 'none' }}>
                If you're having trouble loading Trello,{' '}
                <a
                  href="http://help.trello.com/article/736-troubleshooting-browser-issues-with-trello"
                  target="support"
                >
                  check out our troubleshooting guide
                </a>{' '}
                or{' '}
                <a
                  href="/contact?context=load-failure&source=from%20in%20app%20footer"
                  target="contact"
                >
                  contact us
                </a>
                !
              </div>
              <div id="footer-chrome" style={{ display: 'none' }} />
            </div>
          </Surface>
          <Overlays />
          <LayerManagerPortal layer={Layers.Flag}>
            <Flags />
          </LayerManagerPortal>
        </LayerManager>
        <div className="window-overlay">
          <div className="window" role="dialog">
            <div className="focus-dummy" tabIndex={-1} />
            <div className="window-wrapper" />
          </div>
        </div>
        <div className="pop-over" />
        <div className="tooltip-container" />
        <div id="clipboard-container" aria-hidden />
        <Suspense fallback={null}>
          <AccessibilityMenuOptions />
        </Suspense>
        <Suspense fallback={null}>
          <MobileAppDownloadPrompt />
        </Suspense>
      </MinimumVersionUpdater>
      <ApolloSandbox />
    </ErrorBoundary>
  );
};
