import type Item from 'owa-service/lib/contract/Item';
import { getExtendedProperty } from './ExtendedProperty';

export const NORMALIZED_SUBJECT_PROPERTY_TAG = '0xe1d';

export default function getNormalizedSubject(item: Item): string {
    return getExtendedProperty(item, NORMALIZED_SUBJECT_PROPERTY_TAG);
}
