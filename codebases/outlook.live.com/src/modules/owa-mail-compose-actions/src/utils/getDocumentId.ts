import type Item from 'owa-service/lib/contract/Item';
import getExtendedPropertyValue from 'owa-mail-store/lib/utils/getExtendedPropertyValue';

const DOCUMENT_ID_TAG = '0x6815';

export default function getDocumentId(item: Item): number {
    const value = getExtendedPropertyValue(item, DOCUMENT_ID_TAG);
    return typeof value === 'string' ? parseInt(value) : 0;
}
