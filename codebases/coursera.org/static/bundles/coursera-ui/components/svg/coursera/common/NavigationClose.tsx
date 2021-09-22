import React from 'react';
import { pure } from 'recompose';
import SvgIcon from '../../SvgIcon';

let NavigationClose = (props: $TSFixMe) => (
  <SvgIcon {...props}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </SvgIcon>
);

// @ts-expect-error ts-migrate(2322) FIXME: Type 'ComponentType<any>' is not assignable to typ... Remove this comment to see the full error message
NavigationClose = pure(NavigationClose);
// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type '(pr... Remove this comment to see the full error message
NavigationClose.displayName = 'NavigationClose';

export default NavigationClose;
