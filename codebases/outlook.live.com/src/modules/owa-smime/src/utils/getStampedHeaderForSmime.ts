import { SMIME_INSTALLED_HEADER_KEY, SMIME_INSTALLED_HEADER_TRUE } from './constants';
import isSmimeAdapterUsable from 'owa-smime-adapter/lib/utils/isSmimeAdapterUsable';
import isSMIMEItem from './isSMIMEItem';
import type Item from 'owa-service/lib/contract/Item';
import { lazySmimeAdapter } from 'owa-smime-adapter';

/**
 * Stamps the installed header configuration web request if the S/MIME plugin is installed.
 * Without this header in the request, clear/opaque signed message gets decoded on the server
 * and thus we don't get p7m data package in the response.
 */
const getStampedHeaderForSmime = async (item: Item): Promise<Headers> => {
    const headers = new Headers();
    if (isSMIMEItem(item)) {
        await lazySmimeAdapter.import();

        if (isSmimeAdapterUsable()) {
            headers.set(SMIME_INSTALLED_HEADER_KEY, SMIME_INSTALLED_HEADER_TRUE);
        }
    }

    return headers;
};

export default getStampedHeaderForSmime;
