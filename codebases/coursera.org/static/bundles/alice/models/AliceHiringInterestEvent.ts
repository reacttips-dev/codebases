import AliceEvent from 'bundles/alice/models/AliceEvent';
import { HIRING_INTEREST } from 'bundles/alice/constants/AliceEventTypes';

class AliceHiringInterestEvent extends AliceEvent {
  constructor({ courseBranchId }: $TSFixMe) {
    // @ts-ignore ts-migrate(2345) FIXME: Argument of type '{ type: "HIRING_INTEREST"; cours... Remove this comment to see the full error message
    super({ type: HIRING_INTEREST, courseBranchId });
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'AliceHiringI... Remove this comment to see the full error message
    this.id = `${HIRING_INTEREST}~${courseBranchId}`;
  }
}

export default AliceHiringInterestEvent;
