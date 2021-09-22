import type { ElementType } from 'react';
import React, { useContext } from 'react';
import { CdsTypographyMigrationContext } from 'bundles/authoring/common/components/cds/CdsTypographyMigrationContext';
import { isCdsTypographyMigrationEnabled as isCdsTypographyEpicRolledOut } from 'bundles/authoring/featureFlags';
import { getShouldLoadRaven } from 'js/lib/sentry';
import raven from 'raven-js';

import { Typography } from '@coursera/cds-core';
import {
  H1,
  H1Xl,
  H1BoldXl,
  H1Display,
  H1DisplayBoldXl,
  H2,
  H3,
  H4,
  H4Bold,
  P,
  View,
  Strong,
  Caption,
  Label,
} from '@coursera/coursera-ui';

type BaseProps = {
  variant:
    | 'd1'
    | 'd1semibold'
    | 'd2'
    | 'd2semibold'
    | 'h1'
    | 'h1semibold'
    | 'h2'
    | 'h2semibold'
    | 'h3semibold'
    | 'h3bold'
    | 'h4bold'
    | 'body1'
    | 'body2';
  cuiComponentName:
    | 'H1'
    | 'H1Xl'
    | 'H1BoldXl'
    | 'H1Display'
    | 'H1DisplayBoldXl'
    | 'H2'
    | 'H3'
    | 'H4'
    | 'H4Bold'
    | 'P'
    | 'View'
    | 'Strong'
    | 'Caption'
    | 'Label';
  children?: React.ReactNode;
  component?: React.ElementType;
  className?: string;
};
type Props = BaseProps & Omit<React.ComponentPropsWithoutRef<ElementType>, keyof BaseProps>;

const cuiComponents = {
  H1,
  H1Xl,
  H1BoldXl,
  H1Display,
  H1DisplayBoldXl,
  H2,
  H3,
  H4,
  H4Bold,
  P,
  View,
  Strong,
  Caption,
  Label,
};

const CdsMigrationTypography = ({ variant, component, className, cuiComponentName, children, ...rest }: Props) => {
  const { isCdsTypographyMigrationEnabled } = useContext(CdsTypographyMigrationContext);

  if (!isCdsTypographyMigrationEnabled && isCdsTypographyEpicRolledOut() && getShouldLoadRaven()) {
    raven.captureException(new Error('Authoring typography component being used outside of /teach'), {
      tags: {
        product: 'cds-typography', // use this tag for categorizing errors caught on FE
      },
      extra: {
        message:
          'a <CdsMigrationTypography /> is being used outside of /teach, see the children below to help figure out where',
        children,
      },
    });
  }

  if (isCdsTypographyMigrationEnabled) {
    return (
      <Typography variant={variant} className={className} {...(component ? { component } : {})} {...rest}>
        {children}
      </Typography>
    );
  } else {
    const CuiComponent = cuiComponents[cuiComponentName];
    return (
      <CuiComponent rootClassName={className} tag={component} {...rest}>
        {children}
      </CuiComponent>
    );
  }
};

export default CdsMigrationTypography;
