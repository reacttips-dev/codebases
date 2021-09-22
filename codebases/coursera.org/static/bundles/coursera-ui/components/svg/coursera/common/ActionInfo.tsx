/* eslint-disable import/no-mutable-exports */
import React from 'react';
import { pure } from 'recompose';
import SvgIcon from '../../SvgIcon';

let ActionInfo = (props: $TSFixMe) => (
  <SvgIcon {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </SvgIcon>
);
// @ts-expect-error ts-migrate(2322) FIXME: Type 'ComponentType<any>' is not assignable to typ... Remove this comment to see the full error message
ActionInfo = pure(ActionInfo);
// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type '(pr... Remove this comment to see the full error message
ActionInfo.displayName = 'ActionInfo';
// @ts-expect-error ts-migrate(2339) FIXME: Property 'muiName' does not exist on type '(props:... Remove this comment to see the full error message
ActionInfo.muiName = 'SvgIcon';

export default ActionInfo;
