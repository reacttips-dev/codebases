import AliceEvent from 'bundles/alice/models/AliceEvent';
import { PAGEVIEW } from 'bundles/alice/constants/AliceEventTypes';

class AlicePageviewEvent extends AliceEvent {
  constructor({ contextType, courseBranchId }: $TSFixMe) {
    super({ type: PAGEVIEW, contextType, courseBranchId });
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'AlicePagevie... Remove this comment to see the full error message
    this.id = `${PAGEVIEW}~${contextType || courseBranchId}`;
  }
}

export default AlicePageviewEvent;
