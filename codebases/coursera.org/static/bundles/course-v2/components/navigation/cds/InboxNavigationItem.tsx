import React, { Component } from 'react';

import { getDescription } from 'bundles/course-v2/utils/NavigationItem';
import { InboxNavigationItem as InboxNavigationItemType } from 'bundles/course-v2/types/CourseNavigation';
import { ReplaceCustomContent } from 'bundles/custom-labels/types/CustomLabels';

import NavigationLink from 'bundles/course-v2/components/navigation/cds/NavigationLink';
import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';

type InputProps = {
  router: any;
  courseId: string;
  courseSlug: string;
  navigationItem: InboxNavigationItemType;
};

type Props = InputProps & {
  userId: string;
  replaceCustomContent: ReplaceCustomContent;
};

type State = {
  hasSeenMessages: boolean;
};

class InboxNavigationItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { hasSeenMessages: this.getSelectedFromProps(props) };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.state.hasSeenMessages) {
      if (this.getSelectedFromProps(nextProps)) {
        this.setState({ hasSeenMessages: true });
      }
    }
  }

  getSelectedFromProps = (props: Props) => {
    const { navigationItem, courseSlug, router, replaceCustomContent } = props;
    const { selected } = getDescription(navigationItem, courseSlug, router, replaceCustomContent);
    return selected;
  };

  render() {
    const {
      navigationItem,
      navigationItem: {
        definition: { notificationCount },
      },
      replaceCustomContent,
      courseSlug,
      router,
    } = this.props;
    const { title, subtitle, url, selected } = getDescription(navigationItem, courseSlug, router, replaceCustomContent);

    const adjustedNotificationCount = this.state.hasSeenMessages ? 0 : notificationCount;

    return (
      <div className="rc-InboxNavigationItem">
        <NavigationLink
          url={url}
          title={title}
          subtitle={subtitle}
          selected={selected}
          notificationCount={adjustedNotificationCount}
        />
      </div>
    );
  }
}

export default withCustomLabelsByUserAndCourse<InputProps>(InboxNavigationItem);
