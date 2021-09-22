/* eslint-disable import/no-mutable-exports */
import React from 'react';
import { pure } from 'recompose';
import SvgIcon from '../../SvgIcon';

let ActionCheckCircle = (props: $TSFixMe) => (
  <SvgIcon {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </SvgIcon>
);
// @ts-expect-error ts-migrate(2322) FIXME: Type 'ComponentType<any>' is not assignable to typ... Remove this comment to see the full error message
ActionCheckCircle = pure(ActionCheckCircle);
// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type '(pr... Remove this comment to see the full error message
ActionCheckCircle.displayName = 'ActionCheckCircle';
// @ts-expect-error ts-migrate(2339) FIXME: Property 'muiName' does not exist on type '(props:... Remove this comment to see the full error message
ActionCheckCircle.muiName = 'SvgIcon';

export default ActionCheckCircle;
