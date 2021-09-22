import React from 'react';

import { getDescription } from 'bundles/course-v2/utils/NavigationItem';
import { DefaultNavigationItem } from 'bundles/course-v2/types/CourseNavigation';
import { ReplaceCustomContent } from 'bundles/custom-labels/types/CustomLabels';

import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';
import NavigationLink from 'bundles/course-v2/components/navigation/cds/NavigationLink';

type InputProps = {
  router: any;
  courseId: string;
  courseSlug: string;
  navigationItem: DefaultNavigationItem;
};

type Props = InputProps & {
  replaceCustomContent: ReplaceCustomContent;
};

const DefaultNavigationItemComponent = (props: Props) => {
  const { navigationItem, courseSlug, router, replaceCustomContent } = props;
  const { title, subtitle, url, selected } = getDescription(navigationItem, courseSlug, router, replaceCustomContent);

  return (
    <div className="rc-DefaultNavigationItem" data-e2e={navigationItem.typeName}>
      <NavigationLink url={url} title={title} subtitle={subtitle} selected={selected} />
    </div>
  );
};

export default withCustomLabelsByUserAndCourse<InputProps>(DefaultNavigationItemComponent);
