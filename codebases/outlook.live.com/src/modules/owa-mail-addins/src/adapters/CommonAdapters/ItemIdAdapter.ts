import type { ComposeViewState } from 'owa-mail-compose-store';
import { convertIdsToTargetFormat, ConvertIdSource } from 'owa-immutable-id';
import { getUserMailboxInfo } from 'owa-client-ids';
import type Item from 'owa-service/lib/contract/Item';
import { isFeatureEnabled } from 'owa-feature-flags';
import { ConvertableIdFormat } from 'owa-immutable-id-store';

export const getComposeItemId = (viewState: ComposeViewState) => async (): Promise<string> => {
    return viewState.itemId
        ? // Addins consumers always expect EWS ids, so here we ensure
          // that we are converting any immutableIDs on the item
          // to ews IDs.
          isFeatureEnabled('fwk-immutable-ids')
            ? (
                  await convertIdsToTargetFormat(
                      [viewState.itemId.Id],
                      ConvertableIdFormat.EwsId,
                      getUserMailboxInfo().userIdentity,
                      ConvertIdSource.Addins
                  )
              )?.[0]
            : viewState.itemId.Id
        : null;
};

export const getReadItemId = (item: Item) => async (): Promise<string> => {
    // As with the above, ensure we are always returning EWS ids.
    return isFeatureEnabled('fwk-immutable-ids')
        ? (
              await convertIdsToTargetFormat(
                  [item.ItemId.Id],
                  ConvertableIdFormat.EwsId,
                  getUserMailboxInfo().userIdentity,
                  ConvertIdSource.Addins
              )
          )?.[0]
        : item.ItemId.Id;
};
