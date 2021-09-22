import type { ClientItem } from 'owa-mail-store';
import SmimeErrorStateEnum from 'owa-smime-adapter/lib/store/schema/SmimeErrorStateEnum';

/**
 * returns the error state of an Item
 */
const getSmimeErrorState = (item: ClientItem): SmimeErrorStateEnum =>
    item?.Smime?.ErrorState || SmimeErrorStateEnum.NoError;

export default getSmimeErrorState;
