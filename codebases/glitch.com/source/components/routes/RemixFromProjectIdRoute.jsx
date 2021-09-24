import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useApplication from '../../hooks/useApplication';

export default function RemixFromProjectIdRoute() {
  const application = useApplication();
  const { projectId } = useParams();
  const history = useHistory();

  useEffect(() => {
    const search = new URLSearchParams(history.location.search);
    const env = {};
    for (const [key, value] of search.entries()) {
      env[key] = value;
    }
    application.projectMachine.send({ type: 'CREATE_PROJECT', data: { baseProjectId: projectId, env, projectOwner: application.currentUser() } });
  }, [application, history, projectId]);

  return null;
}
