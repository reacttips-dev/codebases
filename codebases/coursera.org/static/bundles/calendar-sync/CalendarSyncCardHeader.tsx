import React from 'react';

import { Strong } from '@coursera/coursera-ui';
import { Typography } from '@coursera/cds-core';
import useRouter from 'js/lib/useRouter';
import { isDegreeHomeV2Enabled } from 'bundles/degree-home/utils/experimentUtils';

type Props = {
  asBanner: boolean;
  children: string;
};

export default ({ asBanner, children }: Props) => {
  const router = useRouter();
  const degreeSlug = router.params?.degreeSlug;

  if (asBanner) {
    return <Strong>{children}</Strong>;
  }

  if (isDegreeHomeV2Enabled(degreeSlug)) {
    return <Typography variant="h2semibold">{children}</Typography>;
  } else {
    return <h3>{children}</h3>;
  }
};
