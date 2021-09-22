import AliceEvent from 'bundles/alice/models/AliceEvent';
import { ITEM_FAIL } from 'bundles/alice/constants/AliceEventTypes';

class AliceItemFailEvent extends AliceEvent {
  constructor({ courseBranchId, itemId }: $TSFixMe) {
    // @ts-ignore ts-migrate(2345) FIXME: Argument of type '{ type: "ITEM_FAIL"; courseBranc... Remove this comment to see the full error message
    super({ type: ITEM_FAIL, courseBranchId });

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'itemId' does not exist on type 'AliceIte... Remove this comment to see the full error message
    this.itemId = itemId;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'AliceItemFai... Remove this comment to see the full error message
    this.id = `${ITEM_FAIL}~${courseBranchId}~${itemId}`;
  }
}

export default AliceItemFailEvent;
