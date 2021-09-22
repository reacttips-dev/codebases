import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';
import SvgIcon from '../../SvgIcon';

let SvgCheckSolid = ({ stroke = '#fff', ...props }) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <title>check solid</title>
    <circle fill={props.fill} cx="24" cy="24" r="24" />
    <polygon fill={stroke} points="14.41 23.1 13 24.51 23.19 34.7 34.57 15 32.84 14 22.76 31.45" />
  </SvgIcon>
);

// @ts-expect-error ts-migrate(2322) FIXME: Type 'ComponentType<{ [x: string]: any; stroke?: s... Remove this comment to see the full error message
SvgCheckSolid = pure(SvgCheckSolid);
// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type '({ ... Remove this comment to see the full error message
SvgCheckSolid.displayName = 'SvgCheckSolid';

// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type '({ st... Remove this comment to see the full error message
SvgCheckSolid.propTypes = {
  stroke: PropTypes.string,
  fill: PropTypes.string,
};

export default SvgCheckSolid;
