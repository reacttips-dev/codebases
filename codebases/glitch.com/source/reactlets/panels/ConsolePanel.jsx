import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import cn from 'classnames';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import useUserPref from '../../hooks/useUserPref';
import whenKeyIsEnter from '../../utils/whenKeyIsEnter';

export const ROW_HEIGHT = 25;
export const PADDING = 16;

const MIN_HEIGHT = 150;

function ConsolePanel() {
  const application = useApplication();
  const embedded = useObservable(application.editorIsEmbedded);
  const readOnly = useObservable(application.projectIsReadOnlyForCurrentUser);
  const consoleUrl = useObservable(application.consoleUrl);
  const [resizing, setResizing] = useState(false);
  const [height, setHeight] = useUserPref('consolePanelHeight', Math.max(MIN_HEIGHT, window.innerHeight / 3));
  const isMember = useObservable(application.projectIsMemberOrMoreForCurrentUser);

  useLayoutEffect(() => {
    application.refreshEditor();
  }, [application, height]);

  useEffect(() => {
    return () => {
      window.requestAnimationFrame(() => {
        application.refreshEditor();
      });
    };
  }, [application]);

  const consolePanelRef = useRef(null);
  useEffect(() => {
    if (resizing) {
      let resizeFrame = null;
      const onMouseMove = (e) => {
        cancelAnimationFrame(resizeFrame);
        const { pageY } = e;
        resizeFrame = requestAnimationFrame(() => {
          window.getSelection().removeAllRanges();
          const rect = consolePanelRef.current.getBoundingClientRect();
          const panelDistanceFromViewportBottom = window.innerHeight - rect.bottom;
          const cursorDistanceFromViewportBottom = window.innerHeight - pageY;
          const cursorDistanceFromPanelBottom = cursorDistanceFromViewportBottom - panelDistanceFromViewportBottom;
          setHeight(Math.max(cursorDistanceFromPanelBottom, MIN_HEIGHT));
        });
      };

      const onMouseUp = () => {
        setResizing(false);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      return () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
    }
    return undefined;
  }, [resizing, setHeight]);

  return (
    <footer
      className="console-panel panel"
      style={{ height: typeof height === 'number' && `${height}px` }}
      data-testid="console-panel"
      ref={consolePanelRef}
    >
      {/* Existing a11y issue ported to React */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="resizer"
        onMouseDown={() => {
          setResizing(true);
        }}
        onDoubleClick={() => {
          setHeight(null);
        }}
      />
      <header className="header">
        <h1>Terminal</h1>

        <div className="controls">
          {!embedded && (
            <div className="button-wrap">
              <a
                className={cn('button', { disabled: readOnly })}
                href={consoleUrl}
                onClick={() => application.analytics.track('Full Page Terminal Viewed')}
                target="_blank"
                rel="noopener noreferrer"
              >
                Full Page Terminal
                <span className="text-icon" aria-label="">
                  →
                </span>
              </a>
            </div>
          )}

          <div
            className="close icon"
            role="button"
            onClick={() => {
              application.consolePanelVisible(false);
            }}
            onKeyDown={whenKeyIsEnter(() => {
              application.consolePanelVisible(false);
            })}
            tabIndex="0"
          />
        </div>
      </header>

      {isMember && (
        <div className="console-container">
          <iframe className="console-frame" src={consoleUrl} style={{ pointerEvents: resizing ? 'none' : 'all' }} title="Console" />
        </div>
      )}

      {!isMember && (
        <div className="console-container" style={{ color: 'white', fontFamily: 'monospace' }}>
          Sorry. Only project members can view this window.
        </div>
      )}
    </footer>
  );
}

// ConsolePanelWrapper ensures that we have a projectName and a token before connecting to the console socket.
export default function ConsolePanelWrapper() {
  const application = useApplication();
  const visible = useObservable(application.consolePanelVisible);

  if (!visible) {
    return null;
  }

  return <ConsolePanel />;
}
