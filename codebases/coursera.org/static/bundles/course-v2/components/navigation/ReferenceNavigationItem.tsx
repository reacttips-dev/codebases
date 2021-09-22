import React from 'react';
import connectToRouter from 'js/lib/connectToRouter';

import { getReferenceUrl } from 'bundles/course-v2/utils/Course';
import { NavigationResource } from 'bundles/course-v2/types/CourseNavigation';

import NavigationDrawerLink from 'bundles/course-v2/components/navigation/NavigationDrawerLink';

type InputProps = {
  resource: NavigationResource;
};

type Props = InputProps & {
  courseSlug: string;
  selectedResourceId: string;
};

const ReferenceNavigationItem = (props: Props) => {
  const {
    courseSlug,
    resource: { shortId, name },
    selectedResourceId,
  } = props;
  const selected = selectedResourceId === shortId;
  const url = getReferenceUrl(courseSlug, shortId);

  return (
    <NavigationDrawerLink
      trackingName="nav_reference"
      className="rc-ReferenceNavigationItem"
      url={url}
      title={name}
      selected={selected}
    />
  );
};

export default connectToRouter<Props, InputProps>((router) => ({
  courseSlug: router.params.courseSlug,
  selectedResourceId: router.params.reference_id,
}))(ReferenceNavigationItem);
