import React, { useCallback, useEffect, useState, useRef } from 'react';
import cn from 'classnames';
import dedent from 'dedent';
import qs from 'querystring';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import useUserPref from '../../hooks/useUserPref';
import copyToClipboard from '../../utils/copyToClipboard';
import whenKeyIsEnter from '../../utils/whenKeyIsEnter';
import * as messages from '../../utils/messages';

const SNIPPET_IFRAME = 'SNIPPET_IFRAME';
const SNIPPET_MEDIUM = 'SNIPPET_MEDIUM';

function useFilePath() {
  const application = useApplication();
  const embedSelectedFilePath = useObservable(application.embedSelectedFilePath);
  const editorSelectedFilePath = useObservable(
    useCallback(() => {
      const file = application.selectedFile();
      if (file) {
        return file.path();
      }
      return null;
    }, [application]),
  );

  return embedSelectedFilePath || editorSelectedFilePath;
}

function useEmbedUrl(filePath, previewSize, attributionHidden, sidebarCollapsed) {
  const application = useApplication();

  return application.embedUrl({
    previewSize,
    attributionHidden,
    sidebarCollapsed,
    path: filePath,
    previewFirst: false,
  });
}

function useMediumCode(filePath, previewSize, attributionHidden, sidebarCollapsed) {
  const application = useApplication();
  const editorUrl = useObservable(application.editorUrl);

  const query = qs.stringify({
    previewSize,
    attributionHidden,
    sidebarCollapsed,
    path: filePath,
    previewFirst: false,
  });

  return `${editorUrl}?${query}`;
}

function ShareEmbedContents() {
  const application = useApplication();
  const projectIsPrivate = useObservable(application.projectIsPrivate);
  const projectName = useObservable(
    useCallback(() => {
      if (application.currentProject()) {
        return application.currentProject().domain();
      }
      return null;
    }, [application]),
  );

  const [previewSize, setPreviewSize] = useUserPref('embedAppPreviewSize', 0);
  const [attributionHidden, setAttributionHidden] = useUserPref('embedAttributionHidden', false);

  const filePath = useFilePath();
  const sidebarCollapsed = useObservable(application.embedSidebarCollapsed);
  const embedUrl = useEmbedUrl(filePath, previewSize, attributionHidden, sidebarCollapsed);
  const mediumCode = useMediumCode(filePath, previewSize, attributionHidden, sidebarCollapsed);

  const [snippetMode, setSnippetMode] = useState(SNIPPET_IFRAME);

  // The iframe URL should not change over time, as we don't want the iframe to
  // reload. Instead, we use postMessage to update the page within the iframe.
  const iframeUrlRef = useRef(embedUrl);

  const iframeCode = dedent`
    <!-- Copy and Paste Me -->
    <div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
      <iframe
        src="${embedUrl}"
        title="${projectName} on Glitch"
        allow="geolocation; microphone; camera; midi; vr; encrypted-media"
        style="height: 100%; width: 100%; border: 0;">
      </iframe>
    </div>
`;

  const embedIframe = useRef(null);
  const postMessageToShareEmbed = (message) => {
    if (embedIframe.current) {
      embedIframe.current.contentWindow.postMessage(message, '*');
    }
  };

  useEffect(() => {
    postMessageToShareEmbed(messages.updateEmbedState({ embedAppPreviewSize: previewSize }));
  }, [application, previewSize]);

  useEffect(() => {
    postMessageToShareEmbed(messages.updateEmbedState({ embedAttributionHidden: attributionHidden }));
  }, [attributionHidden]);

  const toggleAttributionHidden = () => {
    setAttributionHidden((currentAttributionHidden) => !currentAttributionHidden);
  };

  return (
    <div className="overlay-background">
      <dialog className="overlay share-embed-overlay">
        <section className="info">
          <h1>Embed App</h1>
        </section>

        <section className="section-wrapper">
          <div className="section-embed">
            <div className="glitch-embed-wrap">
              <iframe
                className="glitch-embed-iframe"
                src={iframeUrlRef.current}
                allow="geolocation; microphone; camera; midi; vr; encrypted-media"
                alt="Example share embed"
                title={`${projectName} embed`}
                onLoad={() => {
                  postMessageToShareEmbed(messages.updateEmbedState({ embedParentIsGlitch: true }));
                  postMessageToShareEmbed(messages.updateEmbedState({ embedAppPreviewSize: previewSize }));
                  postMessageToShareEmbed(messages.updateEmbedState({ embedAttributionHidden: attributionHidden }));
                }}
                ref={embedIframe}
              />
            </div>

            {projectIsPrivate && (
              <p>
                <span className="private-icon" /> Only project members will be able to view
              </p>
            )}
          </div>

          <div className="section-embed-options">
            <div className="button-wrap">
              <div className="segmented-buttons">
                <button
                  className={cn('button button-small', { active: previewSize === 100 })}
                  onClick={() => {
                    setPreviewSize(100);
                  }}
                >
                  Show App
                </button>
                <button
                  className={cn('button button-small', { active: previewSize === 0 })}
                  onClick={() => {
                    setPreviewSize(0);
                  }}
                >
                  Show Code
                </button>
              </div>
            </div>

            {previewSize === 0 && <p>Change files or collapse the filetree to customize</p>}

            <div className="button-wrap">
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
              <label htmlFor="attribution-hidden-checkbox" className="button button-small" onKeyDown={whenKeyIsEnter(toggleAttributionHidden)}>
                <input
                  id="attribution-hidden-checkbox"
                  className="input pointer-events-none"
                  type="checkbox"
                  checked={attributionHidden}
                  onChange={toggleAttributionHidden}
                  tabIndex="-1"
                />
                Hide Attribution
              </label>
            </div>

            <div className="button-wrap">
              <div className="segmented-buttons">
                <button
                  className={cn('button button-small', { active: snippetMode === SNIPPET_IFRAME })}
                  onClick={() => {
                    setSnippetMode(SNIPPET_IFRAME);
                  }}
                >
                  iframe
                </button>
                <button
                  className={cn('button button-small', { active: snippetMode === SNIPPET_MEDIUM })}
                  onClick={() => {
                    setSnippetMode(SNIPPET_MEDIUM);
                  }}
                >
                  Medium
                </button>
              </div>
            </div>

            <div className="input-wrap">
              <textarea className="textarea" readOnly value={snippetMode === SNIPPET_IFRAME ? iframeCode : mediumCode} />
              <button
                className="button button-copy-only-style button-large"
                onClick={() => {
                  copyToClipboard(snippetMode === SNIPPET_IFRAME ? iframeCode : mediumCode);
                  application.analytics.track('Embed Code Copied');
                }}
              >
                Copy Embed Code
              </button>
            </div>
          </div>
        </section>
      </dialog>
    </div>
  );
}
export default function ShareEmbed() {
  const application = useApplication();
  const projectLoaded = useObservable(application.projectIsLoaded);
  const visible = useObservable(application.shareEmbedOverlayVisible);

  if (!projectLoaded || !visible) {
    return null;
  }

  return <ShareEmbedContents />;
}
