import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useApplication from '../../hooks/useApplication';
import { importFromRepoId } from '../../data/base-project-domains';

export default function ImportGitRoute() {
  const application = useApplication();
  const history = useHistory();

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    const repoUrl = searchParams.get('url');
    searchParams.delete('url'); // we don't want this to be passed into the env variables for the next step of this route
    if (!repoUrl) {
      return; // sometimes this route gets called twice, with no url param. Adding this check until we have a more stable project machine.
    }

    if (application.isFeatureEnabled('new_git_import')) {
      const env = {};
      for (const [key, value] of searchParams.entries()) {
        env[key] = value;
      }
      application.projectMachine.send({
        type: 'CREATE_PROJECT',
        data: {
          baseProjectId: importFromRepoId,
          importGitRepoUrl: repoUrl,
          env,
          projectOwner: application.currentUser(),
        },
      });
      return;
    }
    try {
      const { host, pathname } = new URL(repoUrl);
      if (host !== 'github.com') {
        throw new Error('Only GitHub git repository URLs are supported');
      }
      const strippedRepoName = pathname.substring(1).replace(/.git$/, ''); // remove leading / and .git at end
      history.replace(`/import/github/${strippedRepoName}?${searchParams}`);
    } catch (error) {
      application.notifyGitImportUrlInvalid(true);
      history.push('/');
    }
  }, [application, history]);

  return null;
}
