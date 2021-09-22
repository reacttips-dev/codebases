import Naptime from 'bundles/naptimejs';
import _ from 'underscore';
import OnDemandCourseForumsV1 from 'bundles/naptimejs/resources/onDemandCourseForums.v1';
import OnDemandMentorForumsV1 from 'bundles/naptimejs/resources/onDemandMentorForums.v1';
import GroupForumsV1 from 'bundles/naptimejs/resources/groupForums.v1';
import GroupForumStatisticsV1 from 'bundles/naptimejs/resources/groupForumStatistics.v1';
import OnDemandCourseForumStatisticsV1 from 'bundles/naptimejs/resources/onDemandCourseForumStatistics.v1';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import { tupleToStringKey, stringKeyToTuple } from 'js/lib/stringKeyTuple';
import { isOutsourcing } from 'bundles/outsourcing/utils';
import user from 'js/lib/user';

/**
 * Provides the following props:
 * {
 *   courseForums: React.PropTypes.arrayOf(React.PropTypes.instanceOf(OnDemandCourseForumsV1)),
 *   mentorForums: React.PropTypes.arrayOf(React.PropTypes.instanceOf(OnDemandMentorForumsV1)),
 *   groupForums: React.PropTypes.arrayOf(React.PropTypes.instanceOf(GroupForumsv1)),
 *   courseId: React.PropTypes.string,
 *   hasModerationRole: React.PropTypes.bool,
 *   courseSlug: React.PropTypes.string,
 *   userId: React.PropTypes.number,
 *   overrideBranchId: React.PropTypes.string,
 *   courseForumStatistics: React.PropTypes.arrayOf(React.PropTypes.instanceOf(OnDemandCourseForumStatisticsesV1)),
 *   groupForumStatistics: React.PropTypes.arrayOf(React.PropTypes.instanceOf(GroupForumStatisticsV1)),
 * }
 */
export default ({ fields, subcomponents } = {}) =>
  _.compose(
    connectToStores(
      ['CourseStore', 'CourseMembershipStore', 'ApplicationStore', 'SessionFilterStore'],
      ({ CourseStore, CourseMembershipStore, ApplicationStore, SessionFilterStore }) => ({
        courseId: CourseStore.getCourseId(),
        courseSlug: CourseStore.getCourseSlug(),
        hasModerationRole:
          CourseMembershipStore.hasModerationRole() || ApplicationStore.isSuperuser() || isOutsourcing(user),
        overrideBranchId: SessionFilterStore.overrideBranchId,
        selectedSession: SessionFilterStore.selectedSession,
        filterQueryString: SessionFilterStore.activeFilterQueryString,
        userId: ApplicationStore.getUserData().id,
      })
    ),
    Naptime.createContainer((props) => {
      // if hasModerationRole is undefined, we are in the naptime connector - and we want to enable mentor forums so that
      // fields are processed correctly
      const hasModerationRole = props.hasModerationRole !== false;

      return {
        courseForums: OnDemandCourseForumsV1.course({
          params: {
            courseId: props.courseId,
            overrideBranchId: props.overrideBranchId,
          },
          fields: ['title', 'description', 'parentForumId'],
        }),
        mentorForums: !hasModerationRole
          ? []
          : OnDemandMentorForumsV1.course({
              params: {
                courseId: props.courseId,
              },
              fields: ['title', 'description', 'parentForumId'],
            }),
        groupForums: props.selectedSession
          ? GroupForumsV1.courseAndSession({
              params: {
                courseId: props.courseId,
                sessionId: props.selectedSession,
                userId: props.userId,
              },
              fields: ['title', 'description', 'parentForumId'],
            })
          : GroupForumsV1.course({
              params: {
                courseId: props.courseId,
                userId: props.userId,
              },
              fields: ['title', 'description', 'parentForumId'],
            }),
      };
    }),
    // Gets statistics for courseForums and groupForums. This loads lazily because this is a relatively slow API.
    Naptime.createContainer((props) => {
      let courseForumStatistics = [];
      let groupForumStatistics = [];

      // Gets statistics for courseForums
      if (props.courseForums && props.courseForums.length > 0 && (props.filterQueryString || props.isCourseWeekPage)) {
        const rootForum = props.courseForums.find((forum) => !forum.parentForumId);
        const filterQuery = props.isCourseWeekPage ? 'all' : props.filterQueryString;
        const topLevelCourseForums = props.courseForums.filter((forum) => forum.parentForumId === rootForum.id);
        const topLevelCourseForumIds = topLevelCourseForums.map((forum) => tupleToStringKey([forum.id, filterQuery]));

        courseForumStatistics = OnDemandCourseForumStatisticsV1.multiGet(
          topLevelCourseForumIds,
          {
            fields: ['forumQuestionCount', 'lastAnsweredAt'],
            required: false,
          },
          // data processor: strip off the filterQueryString for the courseForumId
          (statistics) =>
            statistics.map((statistic) => {
              if (statistic.courseForumId) {
                return statistic;
              }

              const courseForumId = stringKeyToTuple(statistic.id)[0];
              return Object.assign(statistic, { courseForumId });
            })
        );
      }

      // Gets statistics for groupForums
      if (props.groupForums && props.groupForums.length > 0) {
        const groupForumIds = props.groupForums.map((forum) => forum.id);

        groupForumStatistics = GroupForumStatisticsV1.multiGet(groupForumIds, {
          fields: ['forumQuestionCount', 'lastAnsweredAt'],
          required: false,
        });
      }

      return {
        courseForumStatistics,
        groupForumStatistics,
      };
    })
  );
