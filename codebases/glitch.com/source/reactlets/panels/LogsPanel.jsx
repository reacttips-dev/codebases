import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@glitchdotcom/shared-components';
import cn from 'classnames';
import moment from 'moment';
import escapeRegExp from 'lodash/escapeRegExp';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import useRelativeTime from '../../hooks/useRelativeTime';
import useUserPref from '../../hooks/useUserPref';
import whenKeyIsEnter from '../../utils/whenKeyIsEnter';
import { successPattern } from '../../log-patterns';
import { DIVIDER, ENTRY } from '../../models/log-element';

export const ROW_HEIGHT = 25;
export const PADDING = 16;

const MIN_HEIGHT = 150;

function extractLink(text, filePaths) {
  for (const filePath of filePaths) {
    const filePathRegex = new RegExp(`/app/(${escapeRegExp(filePath)}(:\\d*)?)`); // /app/server.js:6, /app/cool.js:234, package.json
    const match = text.match(filePathRegex);
    const matchPosition = text.search(filePathRegex);
    if (match) {
      const start = matchPosition;
      const matchedPath = match[0];
      const end = matchedPath.length + matchPosition;
      const path = match[1];

      return { start, matchedPath, path, end };
    }
  }
  return null;
}

function atEndOfScroll(node) {
  return node.scrollHeight - node.scrollTop === node.clientHeight;
}

function getEndOfScroll(node) {
  return node.scrollHeight - node.clientHeight;
}

function LogText({ entry }) {
  const { timestamp, message, emoji, stream } = entry;
  const application = useApplication();
  const filePaths = useObservable(application.projectFilePaths);
  const link = useMemo(() => extractLink(message, filePaths), [message, filePaths]);
  const time = useMemo(() => moment(timestamp).format('LT'), [timestamp]);
  const matchesSuccessPattern = useMemo(() => successPattern.match(message), [message]);
  const isError = stream === 'stderr';
  const isSuccess = stream === 'stdout' && matchesSuccessPattern;

  const jumpToLocation = () => {
    application.selectFileByLogPath(link.path);
  };

  return (
    <div
      className={cn('log-item', { 'error-log': isError, 'success-log': isSuccess, 'has-jump-button': link })}
      data-testid={`log-entry:${entry.id}`}
    >
      <pre>
        {isSuccess && <>{emoji} </>}
        {link ? (
          <>
            <button className="button jump-to-button" onClick={jumpToLocation}>
              Jump To
            </button>
            {message.slice(0, link.start).trimLeft()}
            <button className="text" onClick={jumpToLocation}>
              {link.matchedPath}
            </button>
            {message.slice(link.end)}
          </>
        ) : (
          message
        )}
      </pre>
      <span className="log-time">{time}</span>
    </div>
  );
}

function LogDivider({ entry }) {
  const { timestamp } = entry;
  const time = useMemo(() => moment.min(moment(timestamp), moment()), [timestamp]);
  const relativeTime = useRelativeTime(time.valueOf());

  return (
    <div className="log-item instance-divider" data-testid={`log-divider:${entry.id}`}>
      <hr />
      <span className="log-time relative-time">{relativeTime}</span>
    </div>
  );
}

const LogRow = React.memo(function LogRow(props) {
  const { entry } = props;
  if (entry.type === ENTRY) {
    return <LogText {...props} />;
  }
  if (entry.type === DIVIDER) {
    return <LogDivider {...props} />;
  }
  throw new Error('Unknown log type.');
});

const msPerFrame = 1000 / 60;

// A specialized version of useObservable delays setting React state when the observable emits an update
function useLogs() {
  const application = useApplication();
  const [logs, setLogs] = useState(() => application.logsData());

  useEffect(() => {
    let id;
    const cb = (nextLogs) => {
      clearTimeout(id);
      id = setTimeout(() => {
        setLogs(nextLogs);
      }, msPerFrame * 5);
    };
    application.logsData.observe(cb);
    setLogs(application.logsData());

    return () => {
      clearTimeout(id);
      application.logsData.stopObserving(cb);
    };
  }, [application, application.logsData]);

  return logs;
}

function LogsContainer() {
  const logs = useLogs();
  const scrollRef = useRef();
  const [followScroll, setFollowScroll] = useState(true);

  // We only auto-scroll the logs if they've changed by comparing them to the previous logs.
  // Mutating the list of logs instead of replacing the value will not trigger auto-scroll.
  const prevLogs = useRef();
  useLayoutEffect(() => {
    if (followScroll && prevLogs.current !== logs) {
      scrollRef.current.scrollTop = getEndOfScroll(scrollRef.current);
      prevLogs.current = logs;
    }
  }, [followScroll, logs]);

  return (
    <div
      ref={scrollRef}
      className="logs-scroll"
      onScroll={() => {
        setFollowScroll(atEndOfScroll(scrollRef.current));
      }}
      data-testid="logs-scroll-list"
    >
      <div className="logs-container">
        {logs.map((log) => (
          <LogRow key={log.id} entry={log} />
        ))}
      </div>
    </div>
  );
}

function LogsPanel() {
  const application = useApplication();
  const debuggerEnabled = useObservable(application.debuggerEnabled);
  const embedded = useObservable(application.editorIsEmbedded);
  const packageJsonFile = useObservable(useCallback(() => application.fileByPath('package.json'), [application]));
  const debuggerIsReady = packageJsonFile !== null;
  const [resizing, setResizing] = useState(false);
  const [height, setHeight] = useUserPref('logsPanelHeight', Math.max(MIN_HEIGHT, window.innerHeight / 3));

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

  const logsPanelRef = useRef(null);
  useEffect(() => {
    if (resizing) {
      let resizeFrame = null;
      const onMouseMove = (e) => {
        cancelAnimationFrame(resizeFrame);
        const { pageY } = e;
        resizeFrame = requestAnimationFrame(() => {
          window.getSelection().removeAllRanges();
          const rect = logsPanelRef.current.getBoundingClientRect();
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
    <footer className="logs-panel panel" style={{ height: typeof height === 'number' && `${height}px` }} data-testid="logs-panel" ref={logsPanelRef}>
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
        <h1>Logs</h1>

        <div className="controls">
          <div className="button-wrap">
            <button
              className="button clear-logs"
              onClick={() => {
                application.clearLogs();
              }}
            >
              Clear <Icon icon="bomb" />
            </button>
          </div>

          {!embedded && debuggerEnabled ? (
            <div className="button-wrap">
              <button
                className="button button-secondary"
                onClick={() => {
                  application.disableDebugger();
                }}
              >
                Stop Debugger <Icon icon="octagonalSign" />
              </button>
            </div>
          ) : (
            <div className={cn('button-wrap', { disabled: !debuggerIsReady })}>
              <button
                className="button button-debugger"
                disabled={!debuggerIsReady}
                onClick={() => {
                  application.openDebugger();
                }}
              >
                Debugger
                <span className="text-icon" aria-label="">
                  →
                </span>
              </button>
            </div>
          )}

          <div
            className="close icon"
            role="button"
            onClick={() => {
              application.logsPanelVisible(false);
            }}
            onKeyDown={whenKeyIsEnter(() => {
              application.logsPanelVisible(false);
            })}
            tabIndex="0"
          />
        </div>
      </header>

      <LogsContainer />
    </footer>
  );
}

// LogsPanelWrapper ensures that we have a projectName and a token before connecting to the logs socket.
export default function LogsPanelWrapper() {
  const application = useApplication();
  const visible = useObservable(application.logsPanelVisible);

  useEffect(() => {
    if (visible) {
      application.analytics.track('Logs Viewed');
    }
  }, [application, visible]);

  if (!visible) {
    return null;
  }

  return <LogsPanel />;
}
