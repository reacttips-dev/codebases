import React from 'react';

import { getDescription } from 'bundles/course-v2/utils/NavigationItem';
import { ResourcesNavigationItem } from 'bundles/course-v2/types/CourseNavigation';
import { ReplaceCustomContent } from 'bundles/custom-labels/types/CustomLabels';

import NavigationLink from 'bundles/course-v2/components/navigation/NavigationLink';
import NavigationDrawer from 'bundles/course-v2/components/navigation/NavigationDrawer';
import ReferenceNavigationItem from 'bundles/course-v2/components/navigation/ReferenceNavigationItem';
import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';

type InputProps = {
  router: any;
  courseId: string;
  courseSlug: string;
  navigationItem: ResourcesNavigationItem;
};

type Props = InputProps & {
  replaceCustomContent: ReplaceCustomContent;
};

const ReferenceCollectionNavigationItem = (props: Props) => {
  const { navigationItem, courseSlug, router, replaceCustomContent } = props;
  const {
    definition: { resources },
  } = navigationItem;

  if (resources.length === 0) {
    return null;
  }

  const { title, url, selected } = getDescription(navigationItem, courseSlug, router, replaceCustomContent);

  return (
    <div className="rc-ReferenceCollectionNavigationItem">
      <NavigationLink title={title} url={url} selected={selected} ariaExpanded={selected ? 'true' : 'false'} />

      {selected && (
        <NavigationDrawer>
          {resources.map((resource, i) => (
            <ReferenceNavigationItem key={`reference${i}`} resource={resource} />
          ))}
        </NavigationDrawer>
      )}
    </div>
  );
};

export default withCustomLabelsByUserAndCourse<InputProps>(ReferenceCollectionNavigationItem);
