import AliceEvent from 'bundles/alice/models/AliceEvent';
import { JUST_ENROLL } from 'bundles/alice/constants/AliceEventTypes';

class AliceJustEnrollEvent extends AliceEvent {
  constructor({ courseBranchId }: $TSFixMe) {
    // @ts-ignore ts-migrate(2345) FIXME: Argument of type '{ type: "JUST_ENROLL"; courseBra... Remove this comment to see the full error message
    super({ type: JUST_ENROLL, courseBranchId });
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'AliceJustEnr... Remove this comment to see the full error message
    this.id = `${JUST_ENROLL}~${courseBranchId}`;
  }
}

export default AliceJustEnrollEvent;
