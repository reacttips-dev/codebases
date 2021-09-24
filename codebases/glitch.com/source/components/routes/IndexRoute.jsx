import { useEffect } from 'react';
import useApplication from '../../hooks/useApplication';
import { useProjectMachine } from '../../machines/Project';

export default function IndexRoute() {
  const application = useApplication();
  const [state] = useProjectMachine();

  useEffect(() => {
    if (state.value !== 'projectCreateFailed') {
      application.loadWelcomeProject();
    }
  }, [application, state.value]);

  return null;
}
