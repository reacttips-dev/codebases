import { useEffect } from 'react';
import useApplication from '../../hooks/useApplication';

export default function NewProjectRoute() {
  const application = useApplication();

  useEffect(() => {
    application.projectMachine.send({ type: 'CREATE_PROJECT', data: { projectOwner: application.currentUser() } });
  }, [application]);

  return null;
}
