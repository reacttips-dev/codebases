import type { SchedulePeriod } from 'bundles/ondemand/utils/courseScheduleApi';
// TODO: Migrate off of Backbone
// eslint-disable-next-line no-restricted-imports
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';

import _ from 'lodash';
import moment from 'moment-timezone';

import PropTypes from 'prop-types';

import Schedule from 'bundles/course-sessions/models/Schedule';
import deadlineFormatter from 'bundles/ondemand/utils/deadlineFormatter';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
import keysToConstants from 'js/lib/keysToConstants';

type DeadlineStatus =
  | 'DEADLINES_ENABLED'
  | 'DEADLINES_DISABLED'
  | 'INELIGIBLE_FOR_DEADLINES'
  | 'ITEM_DEADLINES_ENABLED';

const deadlinesStatus = {
  DEADLINES_ENABLED: 'DEADLINES_ENABLED',
  DEADLINES_DISABLED: 'DEADLINES_DISABLED',
  INELIGIBLE_FOR_DEADLINES: 'INELIGIBLE_FOR_DEADLINES',
  ITEM_DEADLINES_ENABLED: 'ITEM_DEADLINES_ENABLED',
};

const deadlineKeys = ['COMPLETE', 'UPCOMING', 'OVERDUE'];
const deadlineProgress = keysToConstants(deadlineKeys);

export type ModuleDeadline = {
  moduleId: string;
  deadline: number;
};

type ItemDeadlines = {
  [key: string]: { deadline: number };
};

type CourseScheduleStore$DehydratedState = {
  loaded: boolean;
  rawSchedule: Array<SchedulePeriod>;
  deadlinesStatus: DeadlineStatus;
  moduleDeadlines: Array<ModuleDeadline>;
  itemDeadlines: ItemDeadlines;
};

export class CourseScheduleStore extends BaseStore {
  loaded = false;

  schedule: Schedule = new Schedule();

  rawSchedule: Array<SchedulePeriod> | null = null;

  deadlinesStatus: DeadlineStatus = deadlinesStatus.INELIGIBLE_FOR_DEADLINES as DeadlineStatus;

  // moduleDeadlines contains deadlines of every module.
  moduleDeadlines: Array<ModuleDeadline> = [];

  // itemDeadlines contains deadines of gradable items in the current session.
  itemDeadlines: ItemDeadlines = {};

  static storeName: 'CourseScheduleStore' = 'CourseScheduleStore';

  static handlers = {
    LOAD_COURSE_SCHEDULE: 'onLoadCourseSchedule',
    LOAD_COURSE_DEADLINES: 'onLoadCourseDeadlines',
    DISABLE_DEADLINES: 'onDisableDeadlines',
  };

  onLoadCourseSchedule(rawScheduleData: Array<SchedulePeriod>) {
    this.rawSchedule = rawScheduleData;
    this.schedule = new Schedule(rawScheduleData);
    this.loaded = true;
    this.emitChange();
  }

  onLoadCourseDeadlines({
    moduleDeadlines,
    itemDeadlines,
  }: {
    moduleDeadlines: Array<ModuleDeadline>;
    itemDeadlines: ItemDeadlines;
  }) {
    this.moduleDeadlines = moduleDeadlines;
    this.itemDeadlines = itemDeadlines;
    this.deadlinesStatus = (itemDeadlines
      ? deadlinesStatus.ITEM_DEADLINES_ENABLED
      : deadlinesStatus.DEADLINES_ENABLED) as DeadlineStatus;

    this.emitChange();
  }

  onDisableDeadlines() {
    this.deadlinesStatus = deadlinesStatus.DEADLINES_DISABLED as DeadlineStatus;
    this.moduleDeadlines = [];
    this.itemDeadlines = {};
    this.emitChange();
  }

  static deadlineProgress = deadlineProgress;

  static deadlineKeys = deadlineKeys;

  static shapes = {
    moduleDeadlines: PropTypes.arrayOf(
      PropTypes.shape({
        moduleIds: PropTypes.arrayOf(PropTypes.string),
        deadline: PropTypes.number,
      })
    ),

    itemDeadlines: PropTypes.objectOf(
      PropTypes.shape({
        deadline: PropTypes.number,
      })
    ),
  };

  static SERIALIZE_PROPS: Array<keyof CourseScheduleStore$DehydratedState> = [
    'loaded',
    'rawSchedule',
    'deadlinesStatus',
    'moduleDeadlines',
    'itemDeadlines',
  ];

  dehydrate(): CourseScheduleStore$DehydratedState {
    // @ts-expect-error UNDERSCORE-MIGRATION
    return _.pick(this, CourseScheduleStore.SERIALIZE_PROPS);
  }

  rehydrate(state: CourseScheduleStore$DehydratedState) {
    Object.assign(this, {
      ..._.pick(state, CourseScheduleStore.SERIALIZE_PROPS),
      schedule: new Schedule(state.rawSchedule),
    });
  }

  hasLoaded(): boolean {
    return this.loaded;
  }

  getSchedule(): Schedule {
    return this.schedule;
  }

  getNumberOfWeeks(): number {
    const weeks = Object.keys(this.getSchedule().weekMap);
    return weeks.length;
  }

  /*
   * Input: week number
   * Return: list of module ids for the week
   */
  getModuleIdsForWeek(week: number): Array<string> {
    return this.getSchedule().getModuleIdsForWeek(week);
  }

  getModuleDeadlineForWeek(week: number, moduleDeadlinesParam?: Array<ModuleDeadline>): moment.Moment | null {
    if (!week) {
      throw new Error(`getModuleDeadlineForWeek requires a \`week\` but was passed ${week}`);
    }

    let moduleDeadlines = moduleDeadlinesParam;
    if (!moduleDeadlines) {
      moduleDeadlines = this.moduleDeadlines;
    }

    const moduleIds = this.getSchedule().getModuleIdsForWeek(week);

    const deadlines: Array<moment.Moment> = moduleIds
      .map((moduleId) => {
        if (Array.isArray(moduleDeadlines)) {
          const deadlineObj = _.find(moduleDeadlines, { moduleId });
          if (deadlineObj !== undefined && deadlineObj !== null) {
            return deadlineObj;
          } else {
            return {};
          }
        } else {
          return {};
        }
      })
      .filter((deadlineObj) => !_.isEmpty(deadlineObj))
      // @ts-expect-error TSMIGRATION
      .map((deadlineObj) => moment(deadlineObj.deadline));

    if (deadlines.length > 0) {
      return deadlineFormatter.toTimezone(moment.max(...deadlines));
    }

    return null;
  }

  getWeekForItem(itemMetadata: ItemMetadata): number {
    return this.getSchedule().getWeekForModuleId(itemMetadata.get('lesson.module.id'));
  }

  getWeekForModuleId(moduleId: string): number {
    return this.getSchedule().getWeekForModuleId(moduleId);
  }

  areDeadlinesEnabled(): boolean {
    return (
      this.deadlinesStatus === deadlinesStatus.DEADLINES_ENABLED ||
      this.deadlinesStatus === deadlinesStatus.ITEM_DEADLINES_ENABLED
    );
  }

  areDeadlinesDisabled(): boolean {
    return this.deadlinesStatus === deadlinesStatus.DEADLINES_DISABLED;
  }
}

export default CourseScheduleStore;
