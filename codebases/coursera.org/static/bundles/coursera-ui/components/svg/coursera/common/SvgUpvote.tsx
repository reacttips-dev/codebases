import React from 'react';
import { pure } from 'recompose';
import SvgIcon from '../../SvgIcon';

let SvgUpvote = (props: $TSFixMe) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <title>SvgUpvote</title>
    <path d="M17.9726562,23.994873 L6.85271794,23.994873 L24.1144615,3.46445069 L42.0405036,23.9357782 L30.2181414,23.9357782 L30.2181414,44.2382989 L17.9726562,44.2382989 L17.9726562,23.994873 Z M11.1472821,21.994873 L19.9726562,21.994873 L19.9726562,42.2382989 L28.2181414,42.2382989 L28.2181414,21.9357782 L37.6307584,21.9357782 L24.1453041,6.53554931 L11.1472821,21.994873 Z" />
  </SvgIcon>
);

// @ts-expect-error ts-migrate(2322) FIXME: Type 'ComponentType<any>' is not assignable to typ... Remove this comment to see the full error message
SvgUpvote = pure(SvgUpvote);
// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type '(pr... Remove this comment to see the full error message
SvgUpvote.displayName = 'SvgUpvote';

export default SvgUpvote;
