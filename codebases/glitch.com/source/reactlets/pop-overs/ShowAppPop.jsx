import React from 'react';
import cn from 'classnames';
import { Box } from '@glitchdotcom/glitch-design-system';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';

export default function ShowAppPop() {
  const application = useApplication();
  const visible = useObservable(application.showAppPopVisible);
  const appPreviewVisible = useObservable(application.appPreviewVisible);
  const currentProject = useObservable(application.currentProject);
  const appPrivacy = useObservable(currentProject?.privacy);

  const isWebkit = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isSafari = !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
  const isSideBySideDisabled = (isWebkit || isSafari) && appPrivacy === 'private_project';

  React.useEffect(() => {
    // We want to make sure that safari users can _never_ end up with the side by side enabled
    // if they are in a private project
    if (isSideBySideDisabled) {
      application.appPreviewVisible(false);
    }
  }, [appPreviewVisible, application, isSideBySideDisabled]);

  if (!visible) {
    return null;
  }

  const handleSideBySide = () => {
    application.analytics.track('Show App Clicked', { viewSelected: 'Next to The Code' });
    application.closeAllPopOvers();
    application.appPreviewIsCollapsed(false);
    application.appPreviewVisible.toggle();
  };

  return (
    // Probably isn't an actual a11y error since we're just stopping the event propagation
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      className="pop-over show-app-pop"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <section>
        <div className="show-app-pop-button-container">
          <Box sx={{ width: '50%' }}>
            <button
              className="show-app-pop-button no-button-styles"
              data-testid="show-app-new-window-button"
              onClick={() => {
                application.analytics.track('Show App Clicked', { viewSelected: 'In A New Window' });
                application.closeAllPopOvers();
                application.actionInterface.showApp();
              }}
            >
              <div className="show-app-pop-button-image show-app-pop-image-live-app" />
              <div className="show-app-pop-button-title">In a New Window</div>
            </button>
          </Box>
          <Box
            sx={{
              width: '50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'center',
              justifyItems: 'center',
              alignItems: 'center',
            }}
          >
            <button
              className={cn('show-app-pop-button no-button-styles', { active: appPreviewVisible, disabled: isSideBySideDisabled })}
              data-testid="show-app-next-to-code-button"
              onClick={handleSideBySide}
            >
              <div className="show-app-pop-button-image show-app-pop-image-editor-preview" />
              <div className="show-app-pop-button-title">
                Next to The Code
                {isSideBySideDisabled && (
                  <div className="show-app-pop-button-title-disabled">Not yet available for private projects in Safari and Webkit</div>
                )}
              </div>
            </button>
            {isSideBySideDisabled && (
              <a
                href="https://glitch.happyfox.com/kb/article/98-why-can-t-i-use-the-preview-next-to-code-option-when-working-on-a-private-project-in-safari-webkit/"
                className="show-app-pop-button-title-disabled"
                target="_blank"
                rel="noreferrer"
              >
                Find out why.
              </a>
            )}
          </Box>
        </div>
      </section>
    </dialog>
  );
}
