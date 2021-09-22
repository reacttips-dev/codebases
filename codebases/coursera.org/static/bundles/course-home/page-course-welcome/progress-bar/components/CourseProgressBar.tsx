/* eslint-disable react/no-string-refs, react/no-find-dom-node */

import React from 'react';
import ReactDOM from 'react-dom';

import { compose } from 'recompose';
import Naptime, { InjectedNaptime } from 'bundles/naptimejs';
import user from 'js/lib/user';
import waitFor from 'js/lib/waitFor';

import classNames from 'classnames';
import A11yScreenReaderOnly from 'bundles/a11y/components/A11yScreenReaderOnly';
import mapProps from 'js/lib/mapProps';
import connectToRouter from 'js/lib/connectToRouter';
import { stringKeyToTuple } from 'js/lib/stringKeyTuple';

import { Week } from 'bundles/course-v2/types/Week';
import { CoursePresentGrade } from 'bundles/course-v2/types/Course';

import WeekStatusIndicator from 'bundles/course-home/page-course-welcome/progress-bar/components/WeekStatusIndicator';
import WeekAssignmentIcons from 'bundles/course-home/page-course-welcome/progress-bar/components/WeekAssignmentIcons';

import CoursePercentageGrade from 'bundles/ondemand/components/common/CoursePercentageGrade';

import OnDemandCoursesPresentGradesV1 from 'bundles/naptimejs/resources/onDemandCoursePresentGrades.v1';
import GuidedCourseSessionProgressesV1 from 'bundles/naptimejs/resources/guidedCourseSessionProgresses.v1';
import LearnerCourseSchedulesV1 from 'bundles/naptimejs/resources/learnerCourseSchedules.v1';

import { color } from '@coursera/coursera-ui';
import { SvgChevronLeft, SvgChevronRight } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/course-home';

import 'css!./__styles__/CourseProgressBar';

type PropsFromCaller = {
  showAssignmentIcons?: boolean;
};

type PropsToRouter = {};

type PropsFromRouter = {
  courseSlug: string;
};

type PropsToNaptime = PropsFromRouter;

type PropsFromNaptime = {
  naptime: InjectedNaptime;
  guidedCourseSessionProgresses: Array<GuidedCourseSessionProgresses>;
  coursePresentGrade?: CoursePresentGrade;
  sessionsV2Enabled?: boolean;
};

type PropsToMapProps = Pick<PropsFromNaptime, 'guidedCourseSessionProgresses'>;

type PropsFromMapProps = GuidedCourseSessionProgresses;

// PropsFromRouter.courseSlug isn't used in the component
type PropsToComponent = PropsFromCaller & PropsFromNaptime & PropsFromMapProps;

type State = {
  enableMoveBackArrow: boolean;
  enableMoveForwardArrow: boolean;
};

type GuidedCourseSessionProgresses = {
  courseId: string;
  courseProgressState: string;
  currentWeekByUserProgress: number;
  endedAt: number;
  hasSessionModuleDeadlines: boolean;
  id: string;
  startedAt: number;
  weeks: Array<Week>;
};

class CourseProgressBar extends React.Component<PropsToComponent, State> {
  state = {
    enableMoveBackArrow: false,
    enableMoveForwardArrow: false,
  };

  componentDidMount() {
    const { naptime } = this.props;

    this.showHideArrows();
    this.setOnTransitionEnd();
    this.setStartPosition();

    naptime.refreshData({ resources: ['guidedCourseSessionProgresses.v1'] });
  }

  showHideArrows() {
    //  progressBarContainer:
    //     this contains the progressSection and restricts the width. Anything
    //     exceeding the width will overflow and only be visible when arrows are clicked.

    //  progressSection:
    //     The one that holds the progress bar. this is the one that moves
    //     when the arrow is clicked.

    //  fullProgressBar:
    //     this is actual progress bar which takes as much width as needed and bleeds.
    const progressSection = ReactDOM.findDOMNode(this.refs.progressSection) as Element;

    const displayedWidthForProgressBar = (ReactDOM.findDOMNode(
      this.refs.progressBarContainer
    ) as Element).getBoundingClientRect().width;

    const progressSectionLeftPos = progressSection.scrollLeft;

    const fullProgressBarWidth = (ReactDOM.findDOMNode(this.refs.weeksStatus) as Element).getBoundingClientRect().width;

    this.setState({
      enableMoveForwardArrow: progressSectionLeftPos + displayedWidthForProgressBar < fullProgressBarWidth,
      enableMoveBackArrow: progressSectionLeftPos > 0,
    });
  }

  // There is a transition set on the progress bar in CSS. Transition End is a cleaner
  // way of handling when the transition is complete. Once the transition is complete,
  // decide whether to show the forward arrow and back arrow based on the movement.
  setOnTransitionEnd() {
    (ReactDOM.findDOMNode(this) as Element).addEventListener('transitionend', () => {
      this.showHideArrows();
    });
  }

  move = (addition: number) => {
    const progressSection = ReactDOM.findDOMNode(this.refs.progressSection) as Element;

    const progressContainerLeft = progressSection.scrollLeft;

    const progressNewLeftPos = progressContainerLeft + addition;

    // IE compatibility: https://caniuse.com/element-scroll-methods
    if (progressSection.scrollTo) {
      progressSection.scrollTo({
        left: progressNewLeftPos,
        behavior: 'smooth',
      });
    } else {
      progressSection.scrollLeft = progressNewLeftPos;
    }
  };

  setStartPosition() {
    const { weeks, currentWeekByUserProgress, hasSessionModuleDeadlines } = this.props;

    if (hasSessionModuleDeadlines) {
      const fullProgressBarWidth = (ReactDOM.findDOMNode(this.refs.weeksStatus) as Element).getBoundingClientRect()
        .width;
      const roomAtEnd = 40;
      const realProgressBarWidth = fullProgressBarWidth - roomAtEnd;
      const weekWidth = realProgressBarWidth / (weeks.length + 1);

      const addition = weekWidth * (currentWeekByUserProgress - 1);

      this.move(addition);
    }
  }

  moveDirection = (direction: 'forward' | 'backward') => {
    const movement = (ReactDOM.findDOMNode(this.refs.progressBarContainer) as Element).getBoundingClientRect().width;

    let addition = movement;
    if (direction === 'backward') {
      addition *= -1;
    }

    this.move(addition);
  };

  moveForward = () => {
    this.moveDirection('forward');
  };

  moveBack = () => {
    this.moveDirection('backward');
  };

  render() {
    const {
      courseId,
      coursePresentGrade,
      weeks,
      startedAt,
      endedAt,
      showAssignmentIcons,
      sessionsV2Enabled,
      currentWeekByUserProgress,
    } = this.props;
    const { enableMoveBackArrow, enableMoveForwardArrow } = this.state;

    const classes = classNames('rc-CourseProgressBar', {
      'detailed-view': showAssignmentIcons,
      'simple-view': !showAssignmentIcons,
    });

    return (
      <div className="progress-grades-container align-items-vertical-center horizontal-box">
        <A11yScreenReaderOnly tagName="h2">{_t('Progress')}</A11yScreenReaderOnly>
        <div className={classes} ref="progressBarContainer">
          <button
            className="nostyle move-back"
            type="button"
            aria-label={_t('Previous')}
            onClick={this.moveBack}
            disabled={!enableMoveBackArrow}
          >
            <SvgChevronLeft
              suppressTitle={true}
              size={18}
              color={enableMoveBackArrow ? color.secondaryText : color.gray}
              hoverColor={enableMoveBackArrow ? color.black : color.gray}
            />
          </button>

          <div className="progress-section" ref="progressSection">
            <div className="progress" ref="progress">
              <div className="nostyle">
                {/* <ProgressBar ref="progressBar" courseId={courseId} numWeeks={weeks.length} weeks={weeks} /> */}
              </div>

              <div className="nostyle">
                <div
                  className="horizontal-box weeks-status-section"
                  aria-label={_t('Course Progress: Week #{currentWeekByUserProgress}', { currentWeekByUserProgress })}
                  ref="weeksStatus"
                >
                  <div className="start-week-section week-section">
                    <WeekStatusIndicator
                      key={0}
                      weekNumber={0}
                      courseId={courseId}
                      weekDeadline={startedAt || ''}
                      sessionsV2Enabled={sessionsV2Enabled}
                    />
                  </div>

                  {weeks.map((week, idx) => {
                    const weekIndex = parseInt(stringKeyToTuple(week.learnerMaterialWeekNumber)[2], 10);

                    return (
                      <div className="week-section" key={weekIndex}>
                        {showAssignmentIcons && (
                          <WeekAssignmentIcons week={week} weekNumber={weekIndex} courseId={courseId} />
                        )}
                        {!showAssignmentIcons && (
                          <WeekStatusIndicator key={weekIndex} weekNumber={idx + 1} courseId={courseId} week={week} />
                        )}
                      </div>
                    );
                  })}

                  <div className="end-week-section week-section" key={weeks.length}>
                    <WeekStatusIndicator
                      key={-1}
                      weekNumber={-1}
                      week={weeks[weeks.length - 1]}
                      courseId={courseId}
                      weekDeadline={endedAt || ''}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            aria-label={_t('Next')}
            className="nostyle move-forward"
            type="button"
            onClick={this.moveForward}
            disabled={!enableMoveForwardArrow}
          >
            <SvgChevronRight
              suppressTitle={true}
              size={18}
              color={enableMoveForwardArrow ? color.secondaryText : color.gray}
              hoverColor={enableMoveForwardArrow ? color.black : color.gray}
            />
          </button>
        </div>

        {coursePresentGrade && coursePresentGrade.isCumulativeGraded && (
          <CoursePercentageGrade
            smallVersion={!showAssignmentIcons}
            isPassing={coursePresentGrade.isPassing}
            grade={Math.round(coursePresentGrade.grade * 1000) / 10}
            label={showAssignmentIcons ? _t('Current Course Grade') : _t('Current Grade')}
          />
        )}
      </div>
    );
  }
}

export default compose<PropsToComponent, PropsFromCaller>(
  connectToRouter<PropsFromRouter, PropsToRouter>((router) => ({
    courseSlug: router.params.courseSlug,
  })),
  Naptime.createContainer<PropsFromNaptime, PropsToNaptime>(({ courseSlug }) => ({
    guidedCourseSessionProgresses: GuidedCourseSessionProgressesV1.multiGet([`${user.get().id}~${courseSlug}`], {
      fields: [
        'id',
        'courseId',
        'courseProgressState',
        'weeks',
        'currentWeekByUserProgress',
        'startedAt',
        'endedAt',
        'hasSessionModuleDeadlines',
      ],
    }),

    coursePresentGrade: OnDemandCoursesPresentGradesV1.getById(`${user.get().id}~${courseSlug}`, {
      fields: ['grade', 'relevantItems', 'passingStateForecast'],
    }),

    sessionsV2Enabled: LearnerCourseSchedulesV1.getSessionsV2EnabledBySlug(courseSlug),
  })),
  waitFor(({ guidedCourseSessionProgresses }: PropsFromNaptime) => guidedCourseSessionProgresses.length !== 0),
  mapProps<PropsFromMapProps, PropsToMapProps>(({ guidedCourseSessionProgresses }) => {
    return {
      ...guidedCourseSessionProgresses[0],
    };
  }),
  waitFor(({ courseProgressState }: GuidedCourseSessionProgresses) => courseProgressState !== 'Completed')
)(CourseProgressBar);
