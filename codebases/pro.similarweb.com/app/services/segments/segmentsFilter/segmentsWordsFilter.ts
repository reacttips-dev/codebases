import { IPredictionKeyword, IWordsFilterConfig } from "../segmentsWizardServiceTypes";
import SegmentsBlackList from "./segmentsBlackList";

export default class SegmentsWordsFilter {
    private noDigitsRegex = /^\D+$/;
    // private noDigitsRegex = /^(?:\D(?=\B|$))+$/; // also matches no word-boundary (for english only)
    private segments: IPredictionKeyword[];
    private filterConfig: IWordsFilterConfig;

    constructor(segments: IPredictionKeyword[], wordsFilterConfig?: IWordsFilterConfig) {
        this.segments = segments;
        this.filterConfig = { ...wordsFilterConfig };
    }

    public getFilteredResults = (): IPredictionKeyword[] => {
        const filterConfigMethods = [];
        if (this.filterConfig.wordMaxShare !== undefined) {
            filterConfigMethods.push(this.isBelowMaxShare);
        }
        if (this.filterConfig.wordMinShareByCount !== undefined) {
            // get the minimum share of all keywords that are contained more than the amount of wordMinShareByCount,
            // and filter all keywords that has less then that share.
            // Note: All keywords with that count and above are not filtered.
            const minShareByCount = this.segments.reduce(
                (acc, seg) =>
                    seg.totalCount >= this.filterConfig.wordMinShareByCount &&
                    (acc === 0 || seg.totalShare < acc)
                        ? seg.totalShare
                        : acc,
                0,
            );
            filterConfigMethods.push(this.makeIsAboveMinShareByCount(minShareByCount));
        }
        if (this.filterConfig.wordMinCount !== undefined) {
            filterConfigMethods.push(this.isAboveMinCount);
        }
        if (this.filterConfig.wordMinLength !== undefined) {
            filterConfigMethods.push(this.isLongerThanMinLength);
        }
        if (this.filterConfig.allowDigits === false) {
            // defaults true
            filterConfigMethods.push(this.hasNoDigits);
        }
        if (this.filterConfig.allowBlacklisted === false) {
            // defaults true
            filterConfigMethods.push(this.isNotBlacklisted);
        }

        return filterConfigMethods.length > 0
            ? this.segments.filter((segment) =>
                  filterConfigMethods.every((filterMethod) => filterMethod(segment)),
              )
            : this.segments;
    };

    private isBelowMaxShare = (segment: IPredictionKeyword) => {
        return segment.totalShare <= this.filterConfig.wordMaxShare;
    };

    private isAboveMinCount = (segment: IPredictionKeyword) => {
        return segment.totalCount >= this.filterConfig.wordMinCount;
    };

    private isLongerThanMinLength = (segment: IPredictionKeyword) => {
        return segment.keyword.length >= this.filterConfig.wordMinLength;
    };

    private hasNoDigits = (segment: IPredictionKeyword) => {
        return this.noDigitsRegex.test(segment.keyword);
    };

    private isNotBlacklisted = (segment: IPredictionKeyword) => {
        return !SegmentsBlackList.has(segment.keyword);
    };

    private makeIsAboveMinShareByCount = (minShareByCount: number) => (
        segment: IPredictionKeyword,
    ) => {
        return segment.totalShare >= minShareByCount;
    };
}
