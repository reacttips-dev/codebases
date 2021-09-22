import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { compose } from 'recompose';
import Retracked from 'js/app/retracked';
import TrackedDiv from 'bundles/page/components/TrackedDiv';
import CourseraMetatags from 'bundles/seo/components/CourseraMetatags';
import EnrollBox from 'bundles/course-home/page-course-week/components/EnrollBox';
import ModuleSection from 'bundles/course-home/page-course-week/components/ModuleSection';
import EndOfCourseNpsModal from 'bundles/course-v2/components/nps/EndOfCourseNpsModal';
import DiscussionsCurrentWeekLoader from 'bundles/discussions/components/DiscussionsCurrentWeekLoader';
import shouldShowWeekDiscussionHeader from 'bundles/course-home/page-course-week/utils/shouldShowWeekDiscussionHeader';
import { getWeekUrl } from 'bundles/ondemand/utils/url';
import { setLastSeenWeek } from 'bundles/ondemand/utils/lastSeenWeek';
import { getProgress } from 'bundles/ondemand/actions/ProgressActions';
import { loadCourseMaterials } from 'bundles/ondemand/actions/CourseActions';
import { refreshCourseViewGrade } from 'bundles/ondemand/actions/CourseViewGradeActions';
import mapProps from 'js/lib/mapProps';
import connectToRouter from 'js/lib/connectToRouter';
import waitForStores from 'bundles/phoenix/lib/waitForStores';
import withAliceNotification from 'bundles/alice/lib/withAliceNotification';
import type Course from 'pages/open-course/common/models/course';
import AliceWeekStartEvent from 'bundles/alice/models/AliceWeekStartEvent';
import WeekNotifications from 'bundles/course-notifications-v2/components/WeekNotifications';
import TrackPageViewAction from 'bundles/ui-actions/components/TrackPageViewAction';
import { PAGE_VIEW_WEEK_PAGE } from 'bundles/ui-actions/constants/actionTypes';
import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';
import type CourseMaterials from 'pages/open-course/common/models/courseMaterials';
import type Module from 'pages/open-course/common/models/module';
import type { ReplaceCustomContent } from 'bundles/custom-labels/types/CustomLabels';
import _t from 'i18n!nls/course-home';
import 'css!./__styles__/PeriodPage';

// Fallback if we cannot find a week
const DEFAULT_WEEK = 1;

type PropsFromCaller = {
  isBranchPrivate: boolean;
  replaceCustomContent: ReplaceCustomContent;
};

type PropsFromRouter = {
  week: number;
};

type PropsFromCourseScheduleStore = {
  schedule: $TSFixMe; // TODO
};

type PropsFromCourseStore = {
  getModule?: (moduleId: string) => typeof Module;
  isPreEnrollEnabled?: boolean;
  course: typeof Course;
  courseId: string;
  courseSlug?: string;
  courseRootPath?: string;
  materials: typeof CourseMaterials;
};

type PropsFromSessionStore = {
  isPreviewMode: boolean;
};

type PropsFromSessionStoreOrCourseStore = {
  courseBranchId: string;
};

type PropsToMapProps = PropsFromRouter &
  PropsFromCourseScheduleStore &
  PropsFromCourseStore &
  PropsFromSessionStore &
  PropsFromSessionStoreOrCourseStore;

type PropsFromMapProps = {
  previousModuleIds: $TSFixMe; // TODO
  currentModuleIds: $TSFixMe; // TODO
};

type PropsFromProgressStore = {
  areAllPreviousModulesComplete: $TSFixMe; // TODO
  areCurrentWeekModulesComplete: $TSFixMe; // TODO
};

type PropsToWithAliceNotification = PropsFromRouter &
  PropsFromCourseScheduleStore &
  PropsFromCourseStore &
  PropsFromSessionStore &
  PropsFromSessionStoreOrCourseStore &
  PropsFromProgressStore;

type PropsToComponent = PropsFromCaller &
  PropsFromRouter &
  PropsFromCourseScheduleStore &
  PropsFromCourseStore &
  PropsFromSessionStore &
  PropsFromSessionStoreOrCourseStore &
  PropsFromProgressStore &
  PropsFromMapProps;

type State = {
  week: number;
  modules: Array<typeof Module>;
};

class PeriodPage extends React.Component<PropsToComponent, State> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    week: PropTypes.number,
  };

  getChildContext() {
    const { week } = this.state;
    return { week };
  }

  constructor(props, context) {
    super(props, context);

    const { week, modules } = this.getWeekAndModules(props, context);
    this.state = { week, modules };
  }

  componentDidMount() {
    const { courseId, courseSlug } = this.props;
    const { executeAction } = this.context;
    executeAction(refreshCourseViewGrade, { courseId });
    executeAction(getProgress, { courseId, refreshProgress: true });
    executeAction(loadCourseMaterials, { courseSlug, refetch: true });
  }

  componentWillReceiveProps(nextProps) {
    const { week, modules } = this.getWeekAndModules(nextProps, this.context);
    this.setState({ week, modules });
  }

  getWeekAndModules(props, context) {
    const { router } = context;
    const { schedule, courseId, courseSlug, courseRootPath, isPreEnrollEnabled } = props;

    // Later we assume a schedule exists, so check for pre-enroll first
    if (isPreEnrollEnabled) {
      router.push({
        name: 'info',

        params: {
          courseSlug,
        },
      });
    }

    let week = parseInt(router.params.week, 10);
    if (week) {
      setLastSeenWeek(courseId, week);
    }

    const module = router.params.moduleId;

    // TODO (david) move to willTransitionTo and handle in routing lifecycle
    // Validate after the schedule is loaded
    if (schedule.getPeriods().length > 0) {
      if (week) {
        if (!schedule.containsWeek(week)) {
          router.push(getWeekUrl(courseRootPath, DEFAULT_WEEK));
        }
      } else {
        // we must have module ID if we don't have week
        const weekForModule = schedule.getWeekForModuleId(module);
        if (weekForModule) {
          router.push(getWeekUrl(courseRootPath, weekForModule));
        }

        router.push(getWeekUrl(courseRootPath, DEFAULT_WEEK));
      }
    }

    // TODO(jon): use `getModulesForWeek` from the CourseScheduleStore
    const moduleIds = schedule.getModuleIdsForWeek(week);

    const modules = _.compact(_.map(moduleIds, (moduleId) => props.getModule(moduleId)));

    if (!week || Number.isNaN(week)) {
      week = DEFAULT_WEEK;
    }

    return { week, modules };
  }

  render() {
    const { replaceCustomContent, course, courseId, isPreviewMode, materials } = this.props;
    const { week, modules } = this.state;
    const weekMaterials = materials.getRequiredModules().at(week - 1);
    const courseName = course.get('name');
    const moduleTitle = weekMaterials ? weekMaterials.get('name') : 'Module';
    const metatagTitle = _t('#{courseName} - #{moduleTitle}', { courseName, moduleTitle });
    const weekHeader = replaceCustomContent(_t('#{capitalizedWeekWithNumber}'), {
      weekNumber: week,
      returnsString: true,
    });

    return (
      <TrackPageViewAction key={week} name={PAGE_VIEW_WEEK_PAGE} courseId={courseId} weekNumber={week}>
        <TrackedDiv trackClicks={false} trackingName="week" requireFullyVisible={false} withVisibilityTracking={true}>
          <CourseraMetatags
            disableCrawlerIndexing={true}
            title={metatagTitle}
            imageHref={course.get('promoPhoto')}
            description={weekMaterials.get('description')}
          />

          <div className="rc-PeriodPage">
            <WeekNotifications key={week} />

            <div className="week-description">
              <h1 className="week-number" aria-label={weekHeader}>
                {weekHeader}
              </h1>

              <div className="course-title">
                <span>{courseName}</span>
              </div>
            </div>

            {shouldShowWeekDiscussionHeader(courseId, isPreviewMode) && (
              <DiscussionsCurrentWeekLoader weekNumber={week} />
            )}

            <div className="horizontal-box wrap">
              <div className="flex-1">
                {modules.map((module, index) => {
                  return <ModuleSection key={module.get('id')} module={module} moduleIndex={index} week={week} />;
                })}
              </div>

              {isPreviewMode && (
                <div className="right-rail">
                  <EnrollBox />
                </div>
              )}
            </div>

            <EndOfCourseNpsModal />
          </div>
        </TrackedDiv>
      </TrackPageViewAction>
    );
  }
}

const TrackedPeriodPage = Retracked.createTrackedContainer<PropsToComponent>((props) => {
  return {
    namespace: {
      page: 'period_page',
    },
    course_id: props.course.id,
  };
})(PeriodPage);

export default compose<PropsToComponent, PropsFromCaller>(
  // Grab the week number from the router.
  connectToRouter(({ params: { week } }) => ({
    week: parseInt(week, 10),
  })),
  // Get raw course information (schedule, materials, etc).
  waitForStores(
    ['CourseScheduleStore', 'CourseStore', 'SessionStore'],
    ({ CourseScheduleStore, CourseStore, SessionStore }) => {
      return {
        schedule: CourseScheduleStore.getSchedule(),
        getModule: CourseStore.getModule,
        isPreEnrollEnabled: CourseStore.isPreEnrollEnabledForUser(),
        course: CourseStore.getMetadata(),
        courseId: CourseStore.getCourseId(),
        courseBranchId: SessionStore.getBranchId() || CourseStore.getCourseId(),
        courseSlug: CourseStore.getCourseSlug(),
        materials: CourseStore.getMaterials(),
        courseRootPath: CourseStore.getCourseRootPath(),
        isPreviewMode: SessionStore.isPreviewMode(),
      };
    }
  ),
  // Grab all the module ids from previous weeks.
  mapProps<PropsFromMapProps, PropsToMapProps>(({ week, schedule }) => {
    const previousWeekNumbers = Array.from(new Array(week - 1)).map((w, index) => index + 1);

    return {
      previousModuleIds: _.flattenDeep(
        _.map(previousWeekNumbers, (weekNumber) => schedule.getModuleIdsForWeek(weekNumber))
      ),
      currentModuleIds: schedule.getModuleIdsForWeek(week),
    };
  }),
  // Ask the progress store if all of the modules from previous weeks are complete.
  waitForStores(['ProgressStore'], ({ ProgressStore }, { previousModuleIds, currentModuleIds }) => ({
    areAllPreviousModulesComplete: ProgressStore.areModuleIdsComplete(previousModuleIds),
    areCurrentWeekModulesComplete: ProgressStore.areModuleIdsComplete(currentModuleIds),
  })),
  withAliceNotification<PropsToWithAliceNotification>(
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ courseBranchId, week, areAllP... Remove this comment to see the full error message
    ({ courseBranchId, week, areAllPreviousModulesComplete, areCurrentWeekModulesComplete }) => {
      if (!areAllPreviousModulesComplete || areCurrentWeekModulesComplete) {
        return null;
      }

      return new AliceWeekStartEvent({ courseBranchId, week });
    },
    ({ courseId }) => ({ course_id: courseId })
  ),
  withCustomLabelsByUserAndCourse
)(TrackedPeriodPage);

export const BaseComp = PeriodPage;
