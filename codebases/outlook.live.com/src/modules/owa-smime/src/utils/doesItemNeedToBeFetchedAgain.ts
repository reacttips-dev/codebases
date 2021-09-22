import getSmimeAttachmentType from './getSmimeAttachmentType';
import isSmimeDecoded from './isSmimeDecoded';
import isSMIMEItem from './isSMIMEItem';
import type { ClientItem } from 'owa-mail-store';
import isAdapterInErrorState from 'owa-smime-adapter/lib/utils/isAdapterInErrorState';

/**
 * The item needs to be fetched again in case of an S/MIME message if it is clear signed and the p7m info is not present.
 * The item need not be fetched again if the S/MIME adapter is in an erroneous condition.
 * If the S/MIME item is already decoded, it does not need to be loaded again.
 */
const doesItemNeedToBeFetchedAgain = (item: ClientItem) =>
    !isSmimeDecoded(item) &&
    !isAdapterInErrorState() &&
    isSMIMEItem(item) &&
    !getSmimeAttachmentType(item);

export default doesItemNeedToBeFetchedAgain;
