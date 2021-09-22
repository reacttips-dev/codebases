import React from 'react';

import Typography from '@core/Typography';

export type Props = {
  children: string;
} & React.ComponentPropsWithoutRef<'p'>;

const FormStatusText = (props: Props): React.ReactElement => {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { children, color, ...restProps } = props;

  return (
    <Typography color="supportText" variant="body2" {...restProps}>
      {children}
    </Typography>
  );
};

export default FormStatusText;
