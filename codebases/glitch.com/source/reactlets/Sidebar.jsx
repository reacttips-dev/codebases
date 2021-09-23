import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Loader } from '@glitchdotcom/shared-components';
import useObservable from '../hooks/useObservable';
import useApplication from '../hooks/useApplication';
import useUserPref from '../hooks/useUserPref';
import whenKeyIsEnter from '../utils/whenKeyIsEnter';

import SidebarPeople from './SidebarPeople';
import SidebarProjectActions from './SidebarProjectActions';
import NewFilePop from './pop-overs/NewFilePop';
import File from './File';
import Folder from './Folder';
import ProjectNavigatorsFooter from './ProjectNavigatorsFooter';
import AdvancedOptionsFooter from './AdvancedOptionsFooter';

const SIDEBAR_DEFAULT_WIDTH = 250;

function useSidebarResize() {
  const application = useApplication();
  const [sidebarWidthUserPref, setSidebarWidthUserPref] = useUserPref('sidebarWidth', SIDEBAR_DEFAULT_WIDTH);
  const [resizing, setResizing] = useState(false);
  const sidebarRef = useRef();

  useEffect(() => {
    if (resizing) {
      let resizeFrame;
      const onMouseMove = ({ pageX }) => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
          window.getSelection().removeAllRanges();
          const changeInWidth = pageX - sidebarWidthUserPref;
          const newSidebarWidth = sidebarWidthUserPref + changeInWidth;
          setSidebarWidthUserPref(newSidebarWidth);
          application.sidebarWidth(newSidebarWidth);
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
  }, [resizing, sidebarWidthUserPref, setSidebarWidthUserPref, application]);

  useLayoutEffect(() => {
    application.refreshEditor();
  }, [application]);

  return {
    sidebarRef,
    sidebarWidth: sidebarWidthUserPref,
    resizing,
    startResizing: () => {
      setResizing(true);
    },
    resetSize: () => {
      setSidebarWidthUserPref(SIDEBAR_DEFAULT_WIDTH);
      application.sidebarWidth(SIDEBAR_DEFAULT_WIDTH);
    },
  };
}

export default function Sidebar() {
  const application = useApplication();
  const collapsedFiletree = useObservable(application.collapsedFiletree);
  const sidebarIsCollapsed = useObservable(application.sidebarIsCollapsed);
  const newFilePopVisible = useObservable(application.newFilePopVisible);
  const projectIsReadOnlyForCurrentUser = useObservable(application.projectIsReadOnlyForCurrentUser);
  const projectIsLoaded = useObservable(application.projectIsLoaded);
  const projectContainerStatus = useObservable(application.projectContainerStatus);
  const debuggerReady = useObservable(application.debuggerReady);
  const editorIsPreviewingRewind = useObservable(application.editorIsPreviewingRewind);
  const assetsWrapVisible = useObservable(application.assetsWrapVisible);
  const jiggleAssetFiletreeEntry = useObservable(application.jiggleAssetFiletreeEntry);

  const { sidebarRef, sidebarWidth, startResizing, resetSize } = useSidebarResize();

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchStartTime, setTouchStartTime] = useState(null);

  const toggleSidebar = (event) => {
    event.stopPropagation();

    application.actionInterface.sidebarToggle();
    if (!application.sidebarIsCollapsed()) {
      application.refreshEditor();
    }
    application.updateEmbedSidebarCollapsed();
  };

  const filetreeChildNodes = () => {
    return collapsedFiletree.map((entry) => {
      if (entry.type() === 'file') {
        return <File file={entry} key={entry.id()} />;
      }
      return <Folder folder={entry} key={entry.id()} />;
    });
  };

  const toggleNewFilePop = () => {
    const newFilePopIsVisible = application.newFilePopVisible();
    application.closeAllPopOvers();
    if (newFilePopIsVisible) {
      application.newFilePopVisible(false);
    } else {
      application.newFilePopVisible(true);
    }
  };

  const openSidebarIfCollapsed = () => {
    if (application.sidebarIsCollapsed()) {
      application.actionInterface.sidebarToggle();
    }
  };

  const swipeToggleSidebar = (direction) => {
    // Note: event in here is the global touch event
    if (direction === 'left' && application.sidebarIsCollapsed()) {
      application.actionInterface.sidebarToggle();
    } else if (direction === 'right' && !application.sidebarIsCollapsed()) {
      application.actionInterface.sidebarToggle();
    }
  };

  const evaluateSwipe = (elapsedTime, distanceAbs, direction) => {
    const MIN_DISTANCE = 5;
    const MAX_DISTANCE = 30;
    const MIN_ACCELERATION = 500;
    const acceleration = distanceAbs / (elapsedTime / 1000) ** 2; // pixels per second
    if (acceleration > MIN_ACCELERATION && distanceAbs > MIN_DISTANCE) {
      swipeToggleSidebar(direction);
    } else if (distanceAbs > MAX_DISTANCE) {
      swipeToggleSidebar(direction);
    }
  };

  const touchStart = (event) => {
    const touchStartLocation = event.targetTouches[0];
    setTouchStartX(touchStartLocation.clientX);
    setTouchStartY(touchStartLocation.clientY);
    setTouchStartTime(Date.now());
  };

  const touchMove = (event) => {
    let direction;
    const currentTime = Date.now();
    const elapsedTime = currentTime - touchStartTime;
    const touchCurrentLocation = event.targetTouches[0];
    const touchCurrentX = touchCurrentLocation.clientX;
    const touchCurrentY = touchCurrentLocation.clientY;
    const distanceX = touchStartX - touchCurrentX;
    const distanceY = touchStartY - touchCurrentY;
    if (distanceX > 0) {
      direction = 'right';
    } else {
      direction = 'left';
    }
    const distanceAbs = Math.abs(distanceX);
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      evaluateSwipe(elapsedTime, distanceAbs, direction);
    }
  };

  return (
    /* ESLINT-CLEAN-UP */
    /* eslint-disable-next-line */
    <section
      id="sidebar"
      className={cn('sidebar', sidebarIsCollapsed && 'sidebar-collapsed')}
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onClick={openSidebarIfCollapsed}
      onKeyUp={whenKeyIsEnter(openSidebarIfCollapsed)}
      ref={sidebarRef}
      style={{ width: sidebarWidth }}
    >
      <SidebarPeople />
      <SidebarProjectActions />
      <div className="icon icon-collapse" onKeyUp={whenKeyIsEnter(toggleSidebar)} onClick={toggleSidebar} tabIndex="0" role="button" />
      <div className="sidebar-status-when-collapsed">
        {projectContainerStatus === 'building' && <Loader />}
        {['error', 'stopped'].includes(projectContainerStatus) && <span className="error" />}
        {debuggerReady && <span className="warning" />}
        {projectContainerStatus === 'asleep' && <span className="off" />}
      </div>
      {!projectIsReadOnlyForCurrentUser && projectIsLoaded && (
        <section id="sidebar-file-controls" className="sidebar-section sidebar-file-controls">
          <div className="button-wrap">
            <button
              id="new-file"
              className={cn('button new-file opens-pop-over', newFilePopVisible && 'active', editorIsPreviewingRewind && 'disabled')}
              data-testid="new-file"
              onClick={toggleNewFilePop}
            >
              <span className="label" aria-label="Open new file popover menu">
                New File
              </span>
              <span className="down-arrow icon" aria-level="" />
            </button>
            <NewFilePop />
          </div>
        </section>
      )}
      <section id="sidebar-files" className="sidebar-section sidebar-files">
        <div className="files">
          {!projectIsLoaded ? (
            <div className="loader-ellipses" />
          ) : (
            <ul className="filetree" data-testid="filetree">
              {projectIsLoaded && (
                /* ESLINT-CLEAN-UP */
                /* eslint-disable-next-line */
                <li
                  className={cn('filetree-child assets-sidebar-icon other', {
                    active: assetsWrapVisible,
                    jiggle: jiggleAssetFiletreeEntry,
                  })}
                  /* ESLINT-CLEAN-UP */
                  /* eslint-disable-next-line */
                  tabIndex="0"
                  onKeyUp={whenKeyIsEnter(application.showAssets)}
                  onClick={application.showAssets}
                  onAnimationEnd={() => {
                    application.jiggleAssetFiletreeEntry(false);
                  }}
                >
                  assets
                </li>
              )}

              {filetreeChildNodes()}
            </ul>
          )}
        </div>
      </section>

      {!sidebarIsCollapsed && (
        <footer className="footer-project-options">
          <ProjectNavigatorsFooter />
          <AdvancedOptionsFooter />
        </footer>
      )}

      {/* Existing accessibility issue ported to React.  */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div className="resizer" onMouseDown={startResizing} onDoubleClick={resetSize} />
    </section>
  );
}
