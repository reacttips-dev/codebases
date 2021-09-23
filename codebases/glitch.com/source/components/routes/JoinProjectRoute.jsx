import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useApplication from '../../hooks/useApplication';

export default function JoinProjectRoute() {
  const application = useApplication();
  const { token } = useParams();

  useEffect(() => {
    application.joinProjectWithToken(token);
  }, [application, token]);

  return null;
}
