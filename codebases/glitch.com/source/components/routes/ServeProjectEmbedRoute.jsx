import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';

export default function ServeProjectEmbedRoute() {
  const application = useApplication();
  const params = useParams();
  const history = useHistory();
  const appPreviewVisible = useObservable(application.appPreviewVisible);
  const appPreviewSize = useObservable(application.appPreviewSize);

  useEffect(() => {
    document.body.classList.add('embedded');
    application.editorIsEmbedded(true);
    application.currentTheme('sugar');

    const search = new URLSearchParams(history.location.search);

    const highlights = search.get('highlights') || '';

    if (search.get('path')) {
      application.setRestorePosition(search.get('path'));
    }
    if (search.get('previewSize')) {
      // Query parameter is shared between embed and main editor
      // eslint-disable-next-line radix
      const previewSize = parseInt(search.get('previewSize'));
      application.appPreviewSize(previewSize);
      application.embedAppPreviewSize(previewSize);
      application.appPreviewVisible(previewSize > 0);
    } else {
      application.appPreviewVisible(false);
    }
    if (search.get('attributionHidden') !== undefined) {
      const value = JSON.parse(search.get('attributionHidden'));
      application.embedAttributionHidden(value);
    }
    if (search.get('bottombarCollapsed') !== undefined) {
      const value = JSON.parse(search.get('bottombarCollapsed'));
      application.embedBottombarCollapsed(value);
    }
    if (search.get('sidebarCollapsed') !== undefined) {
      const value = JSON.parse(search.get('sidebarCollapsed'));
      application.sidebarIsCollapsed(value);
    }
    application.setHighlightLines(highlights.split(','), search.get('path'));
  }, [application, history]);

  useEffect(() => {
    const domain = params.domain.toLowerCase();
    if (appPreviewVisible === undefined) {
      return;
    }
    if (appPreviewSize < 100) {
      application.projectMachine.send({ type: 'CONNECT_TO_PROJECT', data: { domain } });
    } else {
      application.projectMachine.send({ type: 'LOAD_PROJECT_METADATA', data: { domain } });
    }
  }, [application, params.domain, appPreviewVisible, appPreviewSize]);

  return null;
}
