import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';

export default function EnsureProjectLoaded({ children, fallback = null }) {
  const application = useApplication();
  const projectLoaded = useObservable(application.projectIsLoaded);
  return projectLoaded ? children : fallback;
}
