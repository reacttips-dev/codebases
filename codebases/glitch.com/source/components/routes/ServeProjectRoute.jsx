import { useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';

export default function ServeProjectRoute() {
  const application = useApplication();
  const params = useParams();
  const history = useHistory();
  const currentProjectDomain = useObservable(
    useCallback(() => {
      const currentProject = application.currentProject();
      return currentProject ? currentProject.domain() : null;
    }, [application]),
  );
  const projectIsRenaming = useObservable(application.projectIsRenaming);

  useEffect(() => {
    if (application.embedAppPreviewSize() < 100) {
      application.analytics.page('Editor');
    }
  }, [application]);

  useEffect(() => {
    // This prevents reconnecting when the user renames the project
    const domainIsSame = currentProjectDomain && currentProjectDomain.toLowerCase() === params.domain.toLowerCase();
    if (projectIsRenaming || domainIsSame) {
      return;
    }
    const domain = params.domain.toLowerCase();
    const search = new URLSearchParams(history.location.search);

    if (search.get('path')) {
      application.setRestorePosition(search.get('path'));
    }

    const highlights = search.get('highlights') || '';

    application.setHighlightLines(highlights.split(','), search.get('path'));

    application.projectMachine.send({ type: 'CONNECT_TO_PROJECT', data: { domain } });
  }, [application, history, params.domain, currentProjectDomain, projectIsRenaming]);

  return null;
}
