import AliceEvent from 'bundles/alice/models/AliceEvent';
import { WEEK_START } from 'bundles/alice/constants/AliceEventTypes';

class AliceWeekStartEvent extends AliceEvent {
  constructor({ courseBranchId, week }: $TSFixMe) {
    // @ts-ignore ts-migrate(2345) FIXME: Argument of type '{ type: "WEEK_START"; courseBran... Remove this comment to see the full error message
    super({ type: WEEK_START, courseBranchId });

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'week' does not exist on type 'AliceWeekS... Remove this comment to see the full error message
    this.week = week;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'AliceWeekSta... Remove this comment to see the full error message
    this.id = `${WEEK_START}~${courseBranchId}~${week}`;
  }
}

export default AliceWeekStartEvent;
