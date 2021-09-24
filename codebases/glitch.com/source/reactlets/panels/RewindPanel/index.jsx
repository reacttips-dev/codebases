import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Loader } from '@glitchdotcom/shared-components';
import Column from './Column';
import Playhead, { usePlayhead } from './Playhead';
import useApplication from '../../../hooks/useApplication';
import useObservable from '../../../hooks/useObservable';
import whenKeyIsEnter from '../../../utils/whenKeyIsEnter';

function useRewindPanelResize(initialHeight = null) {
  const application = useApplication();
  const [height, setHeight] = useState(initialHeight);
  const [resizing, setResizing] = useState(false);
  const panelRef = useRef();

  useEffect(() => {
    if (resizing) {
      let resizeFrame;
      const onMouseMove = (e) => {
        cancelAnimationFrame(resizeFrame);
        const { pageY } = e;
        resizeFrame = requestAnimationFrame(() => {
          window.getSelection().removeAllRanges();
          const rect = panelRef.current.getBoundingClientRect();
          const panelDistanceFromViewportBottom = window.innerHeight - rect.bottom;
          const cursorDistanceFromViewportBottom = window.innerHeight - pageY;
          const cursorDistanceFromPanelBottom = cursorDistanceFromViewportBottom - panelDistanceFromViewportBottom;
          setHeight(cursorDistanceFromPanelBottom);
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
  }, [resizing]);

  useLayoutEffect(() => {
    application.refreshEditor();
  }, [application, height]);

  return {
    panelRef,
    height,
    resizing,
    panelStyle: { height: typeof height === 'number' ? `${height}px` : height },
    startResizing: () => {
      setResizing(true);
    },
    resetSize: () => {
      setHeight(initialHeight);
    },
  };
}

function CommitInfo({ revision }) {
  const commitMessage = revision && revision.commitMessage;

  return (
    <div className={cn('commit-message', commitMessage && 'commit-message-filled')}>
      {commitMessage && commitMessage}
      {!commitMessage && '\u00A0'}
    </div>
  );
}

function RewindPanelContents({ onClickClose }) {
  const application = useApplication();
  const gettingRewinds = useObservable(application.gettingRewinds);
  const revisions = useObservable(application.rewindRevisions);
  const revisionWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--rewind-revision-width'), 10);
  const users = useObservable(application.rewindUsers);
  const displayedRevision = useObservable(application.displayedRevision);
  const loading = gettingRewinds || revisions === null || users === null;
  const rewindGraph = useRef();

  useEffect(() => {
    const initPromise = application.initRewind();
    return () => {
      // Do not cleanup until after init finishes to avoid inconsistent state.
      // This doesn't avoid issues when the panel is opened/closed several times
      // in a row quickly.
      initPromise.then(application.cleanupRewinds);
    };
  }, [application]);

  const selectRevision = useCallback(
    (i) => {
      application.selectRevision(i, false);
      application.analytics.track('Rewind Checkpoint Previewed', {
        checkpointDate: new Date(revisions[i].timestamp * 1000).toISOString(),
      });
    },
    [application, revisions],
  );

  useLayoutEffect(() => {
    if (rewindGraph.current) {
      rewindGraph.current.scrollLeft = rewindGraph.current.scrollWidth;
    }
  }, [loading]);

  // position is how far the playhead is from the right side of the timeline in px
  const { parentRef, dragging, position, setPosition, playheadProps } = usePlayhead(revisionWidth);
  const { panelRef, panelStyle, startResizing, resetSize } = useRewindPanelResize(window.innerHeight / 3);

  // We want a position of 50n to give us n-1, so we use Math.ceil - 1 instead of Math.floor. We also use Math.max to clamp the value
  // so that a position of 0 doesn't give us an index of -1.
  const positionRevisionIndex = Math.max(0, Math.ceil(position / revisionWidth) - 1);
  const playheadRevision = revisions ? revisions[positionRevisionIndex - 1] : null;

  // Select revision when we stop dragging the playhead
  const prevDragging = useRef(dragging);
  useEffect(() => {
    if (dragging !== prevDragging.current && !dragging && displayedRevision !== playheadRevision) {
      selectRevision(positionRevisionIndex);
    }
    prevDragging.current = dragging;
  }, [dragging, selectRevision, displayedRevision, revisions, playheadRevision, positionRevisionIndex]);

  const reset = () => {
    selectRevision(0);
    setPosition(revisionWidth);
  };

  return (
    <footer id="rewind-panel" className="rewind-panel panel" ref={panelRef} style={panelStyle}>
      {/* Existing a11y issue ported to React */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div className="resizer" onMouseDown={startResizing} onDoubleClick={resetSize} />

      <header className="header">
        <h1>Rewind</h1>

        <CommitInfo revision={playheadRevision} />

        <div className="close icon" role="button" tabIndex="0" onClick={onClickClose} onKeyDown={whenKeyIsEnter(onClickClose)} />
      </header>

      {loading && (
        <div className="loading-rewinds">
          <Loader />
        </div>
      )}

      {!loading && (
        <div ref={rewindGraph} className="rewind-graph">
          <div className="rewind-columns-container" style={{ width: `${(revisions.length + 1) * revisionWidth}px` }} ref={parentRef}>
            {/* Existing a11y issue ported to React */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div className={cn('rewind-column now', { highlighted: positionRevisionIndex === 0 })} onClick={reset}>
              <div className="time cell">
                <span className="time-label">Now</span>
              </div>
              {users.map((_user, i) => (
                /* eslint-disable-next-line react/no-array-index-key */
                <div key={i} className="rewind-item cell" />
              ))}
            </div>

            {revisions.map((revision, i) => (
              <Column
                /* eslint-disable-next-line react/no-array-index-key */
                key={revision.hash}
                revision={revision}
                previousRevision={revisions[i - 1]}
                nextRevision={revisions[i + 1]}
                highlighted={i + 1 === positionRevisionIndex}
                select={() => {
                  selectRevision(i + 1);
                  setPosition((i + 2) * revisionWidth);
                }}
                users={users}
              />
            ))}

            <Playhead {...playheadProps} />
          </div>
        </div>
      )}
    </footer>
  );
}

export default function RewindPanel() {
  const application = useApplication();
  const visible = useObservable(application.rewindPanelVisible);

  useEffect(() => {
    if (visible) {
      application.analytics.track('Rewind Panel Viewed');
    }
  }, [application, visible]);

  if (!visible) {
    return null;
  }

  return (
    <RewindPanelContents
      onClickClose={() => {
        application.rewindPanelVisible(false);
      }}
    />
  );
}
