/* eslint-disable import/no-mutable-exports */
import React from 'react';
import { pure } from 'recompose';
import SvgIcon from '../../SvgIcon';

let AlertWarning = (props: $TSFixMe) => (
  <SvgIcon {...props}>
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </SvgIcon>
);
// @ts-expect-error ts-migrate(2322) FIXME: Type 'ComponentType<any>' is not assignable to typ... Remove this comment to see the full error message
AlertWarning = pure(AlertWarning);
// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type '(pr... Remove this comment to see the full error message
AlertWarning.displayName = 'AlertWarning';
// @ts-expect-error ts-migrate(2339) FIXME: Property 'muiName' does not exist on type '(props:... Remove this comment to see the full error message
AlertWarning.muiName = 'SvgIcon';

export default AlertWarning;
