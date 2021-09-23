import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import cn from 'classnames';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import AppPreviewUrlPop from '../pop-overs/AppPreviewUrlPop';
import useMessageHandler from '../../hooks/useMessageHandler';
import useGlitchApi from '../../hooks/useGlitchApi';
import { PROJECT_URL } from '../../env';

const MIN_WIDTH = 150;

function useResizing(resizerRef, panelRef, defaultWidth = window.innerWidth / 3) {
  const application = useApplication();
  const editorIsEmbedded = useObservable(application.editorIsEmbedded);
  const embedAppPreviewSize = useObservable(application.embedAppPreviewSize);
  const [width, setWidth] = useState(defaultWidth);
  const [resizing, setResizing] = useState(false);

  const startResizing = () => {
    if (!editorIsEmbedded) {
      setResizing(true);
    }
  };

  const resetSize = () => {
    setWidth(window.innerWidth / 3);
  };

  useEffect(() => {
    if (editorIsEmbedded || !resizing) {
      return undefined;
    }

    let resizeFrame;
    const onMouseMove = (e) => {
      window.cancelAnimationFrame(resizeFrame);
      const { pageX } = e;
      resizeFrame = window.requestAnimationFrame(() => {
        window.getSelection().removeAllRanges();
        const rect = panelRef.current.getBoundingClientRect();
        const panelDistanceFromViewportRight = window.innerWidth - rect.right;
        const cursorDistanceFromViewportRight = window.innerWidth - pageX;
        const cursorDistanceFromPanel = cursorDistanceFromViewportRight - panelDistanceFromViewportRight;
        setWidth(Math.max(cursorDistanceFromPanel, MIN_WIDTH));
      });
    };

    const onMouseUp = () => {
      setResizing(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [panelRef, editorIsEmbedded, resizing]);

  // Refresh editor when width changes
  useLayoutEffect(() => {
    application.refreshEditor();
  }, [application, width]);

  // Refresh editor when app preview is closed
  useLayoutEffect(() => {
    return () => {
      window.requestAnimationFrame(() => {
        application.refreshEditor();
      });
    };
  }, [application]);

  const panelProps = { ref: panelRef, style: { width: editorIsEmbedded ? `${embedAppPreviewSize}%` : `${width}px` } };
  const resizerProps = { ref: resizerRef, onMouseDown: startResizing, onDoubleClick: resetSize };

  return { resizing, panelProps, resizerProps };
}

function useAppPreviewUrlPop() {
  const application = useApplication();
  const [render, setRender] = useState(false);

  useEffect(() => {
    return application.onCloseAllPopOvers(() => {
      setRender(false);
    });
  }, [application]);

  const show = useCallback(() => {
    setRender(true);
  }, []);

  const hide = useCallback(() => {
    setRender(false);
  }, []);

  const toggle = useCallback(() => {
    setRender((currentRender) => !currentRender);
  }, []);

  return {
    show,
    hide,
    toggle,
    render,
  };
}

export default function AppPreview({ onClickClose, onTransitionEnd, visible }) {
  const application = useApplication();

  const embedded = useObservable(application.editorIsEmbedded);
  const previewURL = useObservable(application.previewURL);
  const projectName = useObservable(application.projectName);
  const projectPrivacy = useObservable(application.projectPrivacy);
  const isPrivateProject = projectPrivacy === 'private_project';

  // For embeds, we manually compute the iframe URL because previewURL is not
  // available until the editor finishes initializing but we want it sooner.
  let iframeSource = previewURL;
  if (embedded && !previewURL) {
    const hashUrl = new URL(window.location.hash.slice(2), window.location);
    const domain = hashUrl.pathname.split('/').pop();
    iframeSource = `${PROJECT_URL.replace('%s', domain)}/`;
  }

  const iframeTitle = useObservable(
    useCallback(() => {
      if (application.currentProject()) {
        return `Preview of ${application.currentProject().name()}`;
      }
      return null;
    }, [application]),
  );
  const { resizing, panelProps, resizerProps } = useResizing(useRef(), useRef());
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    // The analytics library receives the project information based on an observable watching projectName
    // in application.js, so we wait for the same here.
    if (visible && projectName) {
      application.analytics.track('App Viewed');
    }
  }, [application, projectName, visible]);

  const appPreviewUrlPop = useAppPreviewUrlPop();

  const iframeHasRendered = useRef(false);
  if (visible) {
    iframeHasRendered.current = true;
  }
  const renderIframe = isPrivateProject ? iframeHasRendered.current : visible;

  const iframeRef = useRef();
  const glitchApi = useGlitchApi();

  useMessageHandler((e) => e.source === iframeRef.current?.contentWindow, 'REQUEST_AUTH_TOKEN', () => {
    const frameWindow = iframeRef.current.contentWindow;

    glitchApi.createAuthorizationToken(projectName).then(({ authorizationToken }) => {
      frameWindow.postMessage({ type: 'AUTH_TOKEN', authorizationToken }, '*');
    });
  });

  return (
    /* Existing a11y issue ported to React. */
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
    <div
      id="app-preview"
      className={cn('app-preview', {
        'is-embedded': embedded,
        'app-preview-collapsed': collapsed && !embedded,
        'is-resizing': resizing,
        'app-preview-transition': !resizing,
        hidden: !visible,
      })}
      onClick={() => {
        setCollapsed(false);
      }}
      onTransitionEnd={onTransitionEnd}
      {...panelProps}
    >
      {!embedded && (
        <>
          <div className="resizer" {...resizerProps} />

          <div className="app-preview-helper">
            {/* Existing a11y issue ported to React. */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div
              className="icon-collapse icon"
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed((currentCollapsed) => !currentCollapsed);
              }}
            />

            <div className="url-wrapper">
              <button
                className={cn('button opens-pop-over', { active: appPreviewUrlPop.render })}
                onClick={(e) => {
                  if (e) {
                    e.stopPropagation();

                    // We need this to prevent the click event handler attached to the document in useClickOut from being called.
                    // TODO find a better way to do this that works better with React's synthetic event system.
                    e.nativeEvent.stopImmediatePropagation();
                  }
                  appPreviewUrlPop.toggle();
                }}
              >
                Change URL
              </button>
              {appPreviewUrlPop.render && <AppPreviewUrlPop />}
            </div>

            <button
              className="button"
              onClick={() => {
                application.updateAppPreview();
              }}
            >
              <span className="icon refresh" />
            </button>

            {/* Existing a11y issue ported to React. */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div className="close icon" onClick={onClickClose} />
          </div>

          {resizing && <div className="resize-helper" />}
        </>
      )}

      {renderIframe && (
        <div className="iframe-wrapper">
          <iframe
            allow="geolocation; microphone; camera; midi; vr; encrypted-media"
            src={iframeSource}
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            title={iframeTitle}
            data-testid="app-preview-iframe"
            ref={iframeRef}
          />
        </div>
      )}
    </div>
  );
}
