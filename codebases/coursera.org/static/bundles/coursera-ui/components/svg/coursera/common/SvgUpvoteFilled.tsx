import React from 'react';
import { pure } from 'recompose';
import SvgIcon from '../../SvgIcon';

let SvgUpvoteFilled = (props: $TSFixMe) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <title>SvgUpvoteFilled</title>
    <polygon points="17.9726562 23.994873 6.85271794 23.994873 24.1144615 3.46445069 42.0405036 23.9357782 30.2181414 23.9357782 30.2181414 44.2382989 17.9726562 44.2382989" />
  </SvgIcon>
);

// @ts-expect-error ts-migrate(2322) FIXME: Type 'ComponentType<any>' is not assignable to typ... Remove this comment to see the full error message
SvgUpvoteFilled = pure(SvgUpvoteFilled);
// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type '(pr... Remove this comment to see the full error message
SvgUpvoteFilled.displayName = 'SvgUpvoteFilled';

export default SvgUpvoteFilled;
