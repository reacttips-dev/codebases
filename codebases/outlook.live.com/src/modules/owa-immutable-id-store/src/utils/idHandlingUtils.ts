import { isImmutableId } from './isImmutableId';

export type IdAndIndex = {
    id: string;
    idx: number;
};

export function partitionImmutableAndEwsIds(
    inputIds?: (string | null | undefined)[]
): [IdAndIndex[], IdAndIndex[]] {
    const immutableIds: IdAndIndex[] = [];
    const ewsIds: IdAndIndex[] = [];
    inputIds?.forEach((id, i) => {
        if (typeof id === 'string') {
            // remove all nonstring IDs from the conversion pool
            // (e.g. null and undefined will be filtered out when
            // filtering)
            if (isImmutableId(id)) {
                immutableIds.push({
                    id: id,
                    idx: i,
                });
            } else {
                ewsIds.push({
                    id: id,
                    idx: i,
                });
            }
        }
    });

    return [immutableIds, ewsIds];
}
