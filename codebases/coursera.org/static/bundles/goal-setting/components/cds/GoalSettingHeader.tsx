import React from 'react';

import { Typography } from '@coursera/cds-core';

type Props = {
  children: string;
};

export default ({ children }: Props) => <Typography variant="h2semibold">{children}</Typography>;
