import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useApplication from '../../hooks/useApplication';
import { importFromRepoId } from '../../data/base-project-domains';

export default function ImportGithubRoute() {
  const application = useApplication();
  const { org, repo } = useParams();
  const history = useHistory();

  useEffect(() => {
    const gitHubRepo = `${org}/${repo}`;
    const searchParams = new URLSearchParams(history.location.search);
    if (application.isFeatureEnabled('new_git_import')) {
      searchParams.set('url', `https://github.com/${gitHubRepo}`);
      history.replace(`/import/git?${searchParams.toString()}`);
      return;
    }
    const env = {};
    for (const [key, value] of searchParams.entries()) {
      env[key] = value;
    }
    application.projectMachine.send({
      type: 'CREATE_PROJECT',
      data: {
        baseProjectId: importFromRepoId,
        domain: gitHubRepo.replace('/', '-'),
        importGitHubRepo: gitHubRepo,
        env,
        projectOwner: application.currentUser(),
      },
    });
  }, [application, history, org, repo]);

  return null;
}
