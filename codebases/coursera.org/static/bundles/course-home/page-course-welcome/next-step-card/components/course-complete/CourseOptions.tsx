import React from 'react';
import user from 'js/lib/user';

import Dropdown from 'bundles/phoenix/components/Dropdown';
import SessionSwitchModal from 'bundles/ondemand/components/sessions/SessionSwitchModal';

import CourseInfoOption from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CourseInfoOption';
import CourseSessionOption from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CourseSessionOption';
import CourseUnenrollModal from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CourseUnenrollModal';
import CourseUnenrollOption from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CourseUnenrollOption';

type Props = {
  course: {
    id: string;
    slug: string;
    name: string;
    courseType: 'v2.ondemand' | 'v2.capstone' | 'v1.session' | 'v1.capstone';
  };

  canUnenroll: boolean;
  canSwitchSession: boolean;
};

type State = {
  showSessionModal: boolean;
  showUnenrollModal: boolean;
};

class CourseOptions extends React.Component<Props, State> {
  state = {
    showSessionModal: false,
    showUnenrollModal: false,
  };

  render() {
    const { showSessionModal, showUnenrollModal } = this.state;
    const {
      course,
      course: { id, slug },
      canUnenroll,
      canSwitchSession,
    } = this.props;

    const items = [
      <CourseInfoOption slug={slug} />,

      <CourseSessionOption
        canSwitchSession={canSwitchSession}
        onClick={() => this.setState({ showSessionModal: true })}
      />,
    ];

    if (canUnenroll) {
      items.push(<CourseUnenrollOption onClick={() => this.setState({ showUnenrollModal: true })} />);
    }

    return (
      <div className="rc-CourseOptions">
        <Dropdown
          listItems={items}
          iconClassName="ellipsis-h"
          toggleClassName="arrow-icon"
          dropdownId={`dropdown-${id}`}
        />

        {showUnenrollModal && (
          <CourseUnenrollModal course={course} onClose={() => this.setState({ showUnenrollModal: false })} />
        )}

        {showSessionModal && (
          <SessionSwitchModal courseId={id} onClose={() => this.setState({ showSessionModal: false })} />
        )}
      </div>
    );
  }
}

export default CourseOptions;
