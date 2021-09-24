import { useEffect } from 'react';
import useApplication from '../../hooks/useApplication';

export default function RedirectToGithubLogin() {
  const application = useApplication();

  useEffect(() => {
    application.redirectingToLogin(true);
    window.location = application.getGitHubLoginUrl();
  }, [application]);

  return null;
}
