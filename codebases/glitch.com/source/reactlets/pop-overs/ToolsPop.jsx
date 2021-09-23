import React from 'react';
import cn from 'classnames';
import { Icon, Loader } from '@glitchdotcom/shared-components';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';

const CONTAINER_STATUS_BUILDING = 'building';
const CONTAINER_STATUS_ERROR = 'error';
const CONTAINER_STATUS_ASLEEP = 'asleep';

export default function ToolsPop() {
  const application = useApplication();
  const visible = useObservable(application.toolsPopVisible);
  const logsPanelVisible = useObservable(application.logsPanelVisible);
  const consolePanelVisible = useObservable(application.consolePanelVisible);
  const isMember = useObservable(application.projectIsMemberOrMoreForCurrentUser);
  const containerStatus = useObservable(application.projectContainerStatus);
  const debuggerReady = useObservable(application.debuggerReady);
  const readOnly = useObservable(application.projectIsReadOnlyForCurrentUser);
  const isEmbedded = useObservable(application.editorIsEmbedded);
  const rewindPanelVisible = useObservable(application.rewindPanelVisible);

  if (!visible) {
    return null;
  }

  return (
    <dialog className="pop-over tools-pop">
      <section className="info">
        <h1>Tools</h1>
      </section>

      <section className="actions">
        <div className="button-wrap">
          <button
            className={cn('button rewind-button', rewindPanelVisible && 'active')}
            onClick={() => {
              application.closeAllPopOvers();
              application.rewindPanelVisible.toggle();
            }}
            aria-label="Rewind"
            data-testid="rewind-button"
          >
            Rewind <span className="rewind icon rewind-with-text" />
          </button>
        </div>
        <div className="button-wrap">
          <button
            className={cn('button', { active: logsPanelVisible, disabled: readOnly })}
            onClick={() => {
              application.closeAllPopOvers();
              application.logsPanelVisible.toggle();
            }}
            disabled={readOnly}
          >
            Logs <Icon icon="newspaper" />
            {isMember && (
              <div className="status-badge icon">
                {containerStatus === CONTAINER_STATUS_BUILDING && (
                  <div className="status loading">
                    <Loader />
                  </div>
                )}
                {containerStatus === CONTAINER_STATUS_ERROR && <div className="status error">Error</div>}
                {containerStatus === CONTAINER_STATUS_ASLEEP && <div className="status off">Zzz</div>}
                {debuggerReady && <div className="status warning">Debug</div>}
              </div>
            )}
          </button>
        </div>
        <div className="button-wrap">
          <button
            className={cn('button', { active: consolePanelVisible, disabled: readOnly })}
            onClick={() => {
              application.closeAllPopOvers();
              application.consolePanelVisible.toggle();
            }}
            disabled={readOnly}
          >
            Terminal <Icon icon="pager" />
          </button>
        </div>
      </section>

      <section className="actions">
        <div className="button-wrap">
          <button
            className={cn('button button-small button-secondary', { disabled: readOnly && isEmbedded })}
            onClick={() => {
              application.closeAllPopOvers();
              application.gitImportExportPopVisible(true);
            }}
            disabled={readOnly && isEmbedded}
            data-testid="github-import-export-button"
          >
            Import and Export
          </button>
        </div>

        <div className="button-wrap">
          <button
            className={cn('button button-small button-secondary', { disabled: readOnly })}
            onClick={() => {
              application.analytics.track('Custom Domains Viewed');
              application.closeAllPopOvers();
              application.customDomainPopVisible(true);
            }}
            disabled={readOnly}
          >
            Custom Domains
          </button>
        </div>
      </section>
    </dialog>
  );
}
