import { useEffect, useState } from 'react';

import { guid } from 'helpers/guid';

// This hook creates a static guid after the first render (to prevent server- and client-side id value mismatches.)
const useClientGuid = () => {
  const [generatedGuid, setGuid] = useState<string | undefined>();
  useEffect(() => {
    setGuid(guid());
  }, []);

  return generatedGuid;
};

export default useClientGuid;
