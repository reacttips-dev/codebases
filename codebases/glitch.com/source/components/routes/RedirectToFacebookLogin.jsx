import { useEffect } from 'react';
import useApplication from '../../hooks/useApplication';

export default function RedirectToFacebookLogin() {
  const application = useApplication();

  useEffect(() => {
    application.redirectingToLogin(true);
    window.location = application.getFacebookLoginUrl();
  }, [application]);

  return null;
}
