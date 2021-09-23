import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import { NotificationsProvider } from '@glitchdotcom/shared-components';
import NotificationShim from '../NotificationShim';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import ProjectLoading from '../ProjectLoading';
import * as NotificationTemplates from '../NotificationTemplates';
import Footer from '../Footer';
import AssetsHelper from '../AssetsHelper';
import AssetsBlankSlate from '../AssetsBlankSlate';
import Asset from '../Asset';
import AssetDragToUpload from '../overlays/AssetDragToUpload';
import AppTypeSettings from '../AppTypeSettings';
import FullScreenSparklesWrapper from '../FullScreenSparklesWrapper';
import EditorHelper from '../EditorHelper';
import AppPreview from '../panels/AppPreview';
import Sidebar from '../Sidebar';
import { keyIsMeta } from '../../util';
import * as Markdown from '../../utils/markdown';
import isFileDotenv from '../../utils/dotenv';
import OwnerNotInGoodStandingOverlay from '../overlays/OwnerNotInGoodStandingOverlay';
import UptimeLimitsExceededOverlay from '../overlays/UptimeLimitsExceededOverlay';
import AnonymousProjectDeletedOverlay from '../overlays/AnonymousProjectDeletedOverlay';
import GlitchSubscriptionRequiredOverlay from '../overlays/GlitchSubscriptionRequiredOverlay';

// additional editor views
import CodeMirror from './CodeMirror';
import DotenvEditor from './DotenvEditor';
import Media from './Media';
import MarkdownPreview from './MarkdownPreview';

// Build notification elements statically
const notificationElements = Object.keys(NotificationTemplates).map((templateName) => (
  <NotificationShim key={templateName} template={NotificationTemplates[templateName]} templateName={templateName} />
));

const StyledNotificationsProvider = styled(NotificationsProvider)`
  top: 55px;
  right: 20px;
`;

function EditorSwitch() {
  const application = useApplication();
  const selectedFile = useObservable(application.selectedFile);

  const markdownPreviewVisible = useObservable(application.markdownPreviewVisible);
  const selectedFileIsMarkdown = useObservable(useCallback(() => Markdown.isFileMarkdown(selectedFile), [selectedFile]));
  const renderMarkdownPreview = selectedFileIsMarkdown && markdownPreviewVisible;

  const dotenvViewVisible = useObservable(application.dotenvViewVisible);
  const selectedFileIsDotenv = useObservable(useCallback(() => isFileDotenv(selectedFile), [selectedFile]));
  const renderDotenvEditor = selectedFileIsDotenv && dotenvViewVisible;

  useEffect(() => {
    application.refreshEditor();
  }, [application, dotenvViewVisible]);

  if (renderDotenvEditor) {
    return <DotenvEditor />;
  }

  if (renderMarkdownPreview) {
    return <MarkdownPreview />;
  }

  return <CodeMirror />;
}

export function EditorContents() {
  const application = useApplication();
  const assets = useObservable(application.assets);

  const editorIsPreviewingRewind = useObservable(application.editorIsPreviewingRewind);
  const editorIsRewindingProject = useObservable(application.editorIsRewindingProject);

  const notifyConnectionError = useObservable(application.notifyConnectionError);

  const projectIsLoaded = useObservable(application.projectIsLoaded);
  const assetsWrapVisible = useObservable(application.assetsWrapVisible);
  const appTypeConfigWrapVisible = useObservable(application.appTypeConfigWrapVisible);
  const editorWrapVisible = useObservable(application.editorWrapVisible);
  const mediaWrapVisible = useObservable(application.mediaWrapVisible);
  const appPreviewVisible = useObservable(application.appPreviewVisible);
  const embedAppPreviewSize = useObservable(application.embedAppPreviewSize);
  const projectIsReadOnlyForCurrentUser = useObservable(application.projectIsReadOnlyForCurrentUser);
  const editorIsEmbedded = useObservable(application.editorIsEmbedded);
  const embedEditingEnabled = useObservable(application.embedEditingEnabled);

  const renderAppPreview = appPreviewVisible || embedAppPreviewSize === 100;

  const [editorHidden, setEditorHidden] = useState(embedAppPreviewSize === 100);

  useEffect(() => {
    setEditorHidden(embedAppPreviewSize === 100);
  }, [embedAppPreviewSize]);

  useLayoutEffect(() => {
    application.refreshEditor();
  }, [application, editorHidden]);

  useEffect(() => {
    application.notifyTakeActionToEdit(false);
    if (!projectIsLoaded) {
      return;
    }
    if (projectIsReadOnlyForCurrentUser || (editorIsEmbedded && !embedEditingEnabled)) {
      application.notifyTakeActionToEdit(true);
    }
  }, [application, editorIsEmbedded, embedEditingEnabled, projectIsReadOnlyForCurrentUser, projectIsLoaded]);

  const mediaElement = useObservable(application.mediaElement);

  return (
    <main
      id="editor"
      className={cn({ 'editor-read-only': editorIsPreviewingRewind || editorIsRewindingProject, 'editor-connection-error': notifyConnectionError })}
    >
      {!editorHidden && (
        <div className="editor-container">
          <StyledNotificationsProvider>
            {notificationElements}
            {/* We need to pass application in explicitly here for better testability */}
            <OwnerNotInGoodStandingOverlay application={application} />
            <UptimeLimitsExceededOverlay />
            <AnonymousProjectDeletedOverlay />
            <GlitchSubscriptionRequiredOverlay />
            {projectIsLoaded ? (
              <>
                <Sidebar />
                <Footer />

                <Media element={mediaElement} visible={mediaWrapVisible} />

                <section className={cn('assets-wrap', { hidden: !assetsWrapVisible })}>
                  <AssetDragToUpload />
                  <AssetsHelper />

                  {assets.length === 0 ? (
                    <AssetsBlankSlate />
                  ) : (
                    <div className="assets">
                      {assets.map((asset) => (
                        <Asset key={asset.id} asset={asset} />
                      ))}
                    </div>
                  )}
                </section>

                <section
                  className={cn('app-type-config-wrap', {
                    hidden: !appTypeConfigWrapVisible,
                  })}
                >
                  <AppTypeSettings />
                </section>

                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                <section
                  className={cn('editor-wrap', { hidden: !editorWrapVisible || editorHidden })}
                  role="application"
                  onDragStart={() => {
                    application.userIsDraggingText(true);
                  }}
                  onDragEnd={() => {
                    application.userIsDraggingText(false);
                  }}
                  onKeyDown={(e) => {
                    if (keyIsMeta(e.keyCode)) {
                      return;
                    }
                    if (application.editorIsPreviewingRewind()) {
                      application.jigglePreviewingRewindNotification(true);
                    }
                    if (application.projectIsReadOnlyForCurrentUser() || (application.editorIsEmbedded() && !application.embedEditingEnabled())) {
                      application.jiggleTakeActionToEditNotification(true);
                    }
                  }}
                >
                  <FullScreenSparklesWrapper />
                  <EditorHelper />
                  <EditorSwitch />
                </section>
              </>
            ) : (
              <ProjectLoading />
            )}
          </StyledNotificationsProvider>
        </div>
      )}
      <AppPreview
        onClickClose={() => {
          application.appPreviewVisible(false);
        }}
        onTransitionEnd={() => {
          setEditorHidden(embedAppPreviewSize === 100);
        }}
        visible={renderAppPreview}
      />
    </main>
  );
}

export default function Editor() {
  const application = useApplication();
  const visible = useObservable(application.editorVisible);

  if (!visible) {
    return null;
  }

  return <EditorContents />;
}
