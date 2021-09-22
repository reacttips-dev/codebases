import { ConvertableIdFormat } from '../schema';
import { partitionImmutableAndEwsIds } from './idHandlingUtils';
import { getTargetFormat } from './getTargetFormat';

export function isConversionNeeded(ids: (string | null | undefined)[], userIdentity: string) {
    const [immutableIds, ewsIds] = partitionImmutableAndEwsIds(ids);
    const targetFormat = getTargetFormat(userIdentity);

    return (
        (targetFormat === ConvertableIdFormat.EwsImmutableId && ewsIds.length > 0) ||
        (targetFormat === ConvertableIdFormat.EwsId && immutableIds.length > 0)
    );
}
