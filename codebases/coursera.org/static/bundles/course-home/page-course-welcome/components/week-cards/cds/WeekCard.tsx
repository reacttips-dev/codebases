import React from 'react';
import { Week } from 'bundles/course-v2/types/Week';
import { Theme } from '@coursera/cds-core';

import TrackedDiv from 'bundles/page/components/TrackedDiv';

import WeekCardBody from 'bundles/course-home/page-course-welcome/components/week-cards/cds/WeekCardBody';
import WeekCardHeader from 'bundles/course-home/page-course-welcome/components/week-cards/cds/WeekCardHeader';

import _t from 'i18n!nls/course-home';

import 'css!./../__styles__/WeekCard';

type Props = {
  weekNumber: number;
  week: Week;
  courseId: string;
  theme: Theme;
};

type State = {
  isCollapsed: boolean;
};

class WeekCard extends React.Component<Props, State> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      isCollapsed: props.week.weekStatus === 'COMPLETED',
    };
  }

  toggleCollapse = () => {
    this.setState((prevState) => ({ isCollapsed: !prevState.isCollapsed }));
  };

  render() {
    const { courseId, week, weekNumber, theme } = this.props;
    const { isCollapsed } = this.state;

    return (
      <TrackedDiv
        trackingName="home_week_card"
        withVisibilityTracking={true}
        className="rc-WeekCard card-rich-interaction"
        role="region"
        aria-label={_t('Week #{weekNumber} summary', { weekNumber })}
      >
        <WeekCardHeader
          courseId={courseId}
          week={week}
          weekNumber={weekNumber}
          isCollapsed={isCollapsed}
          onToggleCollapse={this.toggleCollapse}
          theme={theme}
        />

        {!isCollapsed && <WeekCardBody week={week} weekNumber={weekNumber} theme={theme} />}
      </TrackedDiv>
    );
  }
}

export default WeekCard;
