import {
    IPredictionFolder,
    IUrlShareSegments,
    IPredictionKeyword,
    IPredictionItem,
} from "../segmentsWizardServiceTypes";

export function extractWordsFromUrls(
    allUrlsData: IUrlShareSegments[],
    filteredUrlsData: IUrlShareSegments[],
    excludeKeywords?: Iterable<string>,
): IPredictionKeyword[] {
    const excludeKeywordsSet = new Set(excludeKeywords || []);
    const totalUrlsShare = allUrlsData.reduce((acc, url) => acc + url.Share, 0);

    // Extract all segments from all urls
    const derivedKeywordsMap = filteredUrlsData.reduce<
        Map<string, { share: number; count: number }>
    >((acc, url) => {
        url.Segments.forEach((segment: string) => {
            const isExcludedSegment = excludeKeywordsSet.has(segment);
            if (!isExcludedSegment) {
                const segmentMeasures = acc.get(segment) || { share: 0, count: 0 };
                segmentMeasures.share += url.Share;
                segmentMeasures.count += 1;
                acc.set(segment, segmentMeasures);
            }
        });
        return acc;
    }, new Map());

    const results = Array<IPredictionKeyword>();
    derivedKeywordsMap.forEach(({ share, count }, segmentWord) => {
        results.push({
            keyword: segmentWord,
            totalShare: share / totalUrlsShare,
            totalCount: count,
        });
    });

    return results;
}

export function extractFoldersFromUrls(
    allUrlsData: IUrlShareSegments[],
    filteredUrlsData: IUrlShareSegments[],
    maxDepth?: number,
): IPredictionFolder[] {
    const totalUrlsShare = allUrlsData.reduce((acc, url) => acc + url.Share, 0);

    // Extract all folders from all urls
    const derivedFoldersMap = filteredUrlsData.reduce<
        Map<string, { share: number; count: number; depth: number }>
    >((acc, url) => {
        Array.from(url.FolderParts)
            .slice(0, maxDepth)
            .reduce((folder, folderPart, idx) => {
                folder += `${folder ? "/" : ""}${folderPart}`;
                const folderMeasure = acc.get(folder) || { share: 0, count: 0, depth: idx };
                folderMeasure.share += url.Share;
                folderMeasure.count += 1;
                acc.set(folder, folderMeasure);
                return folder;
            }, "");
        return acc;
    }, new Map());

    const results = Array<IPredictionFolder>();
    derivedFoldersMap.forEach(({ share, count, depth }, folder) => {
        results.push({
            folder,
            depth,
            totalShare: share / totalUrlsShare,
            totalCount: count,
        });
    });

    return results;
}

export function sortPredictionsByShare<T extends IPredictionItem>(
    wordPredictionsCopy: T[],
    valueKey: string,
): T[] {
    wordPredictionsCopy.sort((thisSegment, otherSegment) => {
        if (thisSegment.totalShare > otherSegment.totalShare) {
            return -1;
        }
        if (thisSegment.totalShare < otherSegment.totalShare) {
            return 1;
        }
        return thisSegment[valueKey] >= otherSegment[valueKey] ? -1 : 1;
    });
    return wordPredictionsCopy;
}
