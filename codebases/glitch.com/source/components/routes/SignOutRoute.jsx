import { useEffect } from 'react';
import useApplication from '../../hooks/useApplication';

export default function SignOutRoute() {
  const application = useApplication();

  useEffect(() => {
    application.logout();
  }, [application]);

  return null;
}
