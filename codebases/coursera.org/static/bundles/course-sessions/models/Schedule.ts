import { SchedulePeriod } from 'bundles/ondemand/utils/courseScheduleApi';

import _ from 'lodash';

type WeekMap = {
  [weekNumber: number]: SchedulePeriod;
};

type ModuleMap = {
  [moduleId: string]: number;
};

type ScheduleMenuItems = Array<{
  type: string;
  id: number;
}>;

class Schedule {
  periods: Array<SchedulePeriod>;

  weekMap: WeekMap;

  moduleMap: ModuleMap;

  static createMaps(periods: SchedulePeriod[]) {
    let weekIndex = 1;
    const moduleMap = {} as { [id: string]: number };
    const weekMap = {} as { [id: string]: SchedulePeriod };
    _.forEach(periods, (period) => {
      const { numberOfWeeks } = period;

      _.range(numberOfWeeks).forEach((index) => {
        weekMap[weekIndex + index] = period;
      });

      period.moduleIds.forEach((moduleId) => {
        moduleMap[moduleId] = weekIndex;
      });

      weekIndex += numberOfWeeks;
    });

    return { moduleMap, weekMap };
  }

  constructor(periods: Array<SchedulePeriod> = []) {
    this.periods = periods;
    const { weekMap, moduleMap } = Schedule.createMaps(this.periods);
    this.weekMap = weekMap;
    this.moduleMap = moduleMap;
  }

  containsWeek(weekIndex: number) {
    return this.weekMap[weekIndex] !== undefined;
  }

  getModuleIdsForWeek(weekIndex: number) {
    const period = this.weekMap[weekIndex];
    return period ? period.moduleIds : [];
  }

  getWeekForModuleId(moduleId: string) {
    return this.moduleMap[moduleId];
  }

  getPeriods(): Array<SchedulePeriod> {
    return this.periods;
  }

  getMenuItems(): ScheduleMenuItems {
    const menuItems = _.map(this.weekMap, (period, weekIndex) => {
      return {
        type: 'week',
        id: parseInt(weekIndex, 10),
      };
    });

    return menuItems;
  }
}

export default Schedule;
