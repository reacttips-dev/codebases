import React from 'react';
import { TrackedLink2, TrackingProps } from 'bundles/page/components/TrackedLink2';

/*
 * This link component is used for routing between home and item pages.
 * Previously it used to enable request CSR assets on navigation to help with
 * performance, but now just wraps normal SSR cross-app navigation with
 * TrackedLink2 to keep things simple.
 *
 * It should be migrated to TrackedLink2 in general.
 */

type Props = TrackingProps;

const LearnerAppClientNavigationLink: React.SFC<Props> = ({ ...props }) => {
  return <TrackedLink2 {...props} />;
};

export default LearnerAppClientNavigationLink;
