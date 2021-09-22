import AliceEvent from 'bundles/alice/models/AliceEvent';
import { ITEM_SUCCESS } from 'bundles/alice/constants/AliceEventTypes';

class AliceItemSuccessEvent extends AliceEvent {
  constructor({ courseBranchId, itemId }: $TSFixMe) {
    // @ts-ignore ts-migrate(2345) FIXME: Argument of type '{ type: "ITEM_SUCCESS"; courseBr... Remove this comment to see the full error message
    super({ type: ITEM_SUCCESS, courseBranchId });

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'itemId' does not exist on type 'AliceIte... Remove this comment to see the full error message
    this.itemId = itemId;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'AliceItemSuc... Remove this comment to see the full error message
    this.id = `${ITEM_SUCCESS}~${courseBranchId}~${itemId}`;
  }
}

export default AliceItemSuccessEvent;
