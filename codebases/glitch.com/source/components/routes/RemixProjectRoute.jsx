import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useApplication from '../../hooks/useApplication';

export default function RemixProjectRoute() {
  const application = useApplication();
  const { domain } = useParams();
  const history = useHistory();

  useEffect(() => {
    const search = new URLSearchParams(history.location.search);
    const env = {};
    for (const [key, value] of search.entries()) {
      env[key] = value;
    }
    application.projectMachine.send({ type: 'CREATE_PROJECT', data: { baseProjectDomain: domain, env, projectOwner: application.currentUser() } });
  }, [application, history, domain]);

  return null;
}
