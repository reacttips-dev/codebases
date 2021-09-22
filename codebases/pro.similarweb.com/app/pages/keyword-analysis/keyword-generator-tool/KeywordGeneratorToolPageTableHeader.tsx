import {
    createCpcFilter,
    createVolumeFilter,
    getRangeFilterQueryParamValue,
} from "components/filtersPanel/src/RangeFilterUtilityFunctions";
import { MAIN_PROPS } from "pages/keyword-analysis/keyword-generator-tool/Constants";
import { booleanSearchToObject } from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import * as React from "react";
import { connect } from "react-redux";
import { KeywordsGroupUtilities } from "UtilitiesAndConstants/UtilityFunctions/KeywordsGroupUtilities";
import { i18nFilter } from "../../../filters/ngFilters";
import { IDurationData } from "../../../services/DurationService";

interface IKeywordGeneratorToolPageTableHeaderProps {
    onFilterChange: (filters: any, updateUrlOnChange: boolean) => void;
    country: number;
    seedKeyword: string;
    duration: string;
    getDurationApiParams: (duration: string) => IDurationData;
}

class KeywordGeneratorToolPageTableHeader extends React.Component<
    IKeywordGeneratorToolPageTableHeaderProps,
    {}
> {
    private i18n;
    private timeoutId;

    constructor(props, context) {
        super(props, context);
        this.i18n = i18nFilter();
    }

    public componentDidUpdate(prevProps) {
        MAIN_PROPS.forEach((prop) => {
            if (this.props[prop] !== prevProps[prop]) {
                this.changeFilterDebounce(this.props);
            }
        });
    }

    public render() {
        return <div>{this.props.children}</div>;
    }

    private changeFilterDebounce(props) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(() => {
            const {
                country,
                duration,
                seedKeyword,
                webSource,
                booleanSearchTerms,
                isGroupContext,
                volumeFromValue,
                volumeToValue,
                cpcFromValue,
                cpcToValue,
            } = props;
            const durationObject = this.props.getDurationApiParams(duration);
            const filter: { [key: string]: string | boolean } = {
                from: durationObject.forAPI.from, // 2018|08|01
                to: durationObject.forAPI.to, // 2018|11|30
                isWindow: durationObject.forAPI.isWindow,
            };

            filter.rangeFilter = getRangeFilterQueryParamValue([
                createVolumeFilter(volumeFromValue, volumeToValue, "volume"),
                createCpcFilter(cpcFromValue, cpcToValue, "cpc"),
            ]);
            if (booleanSearchTerms) {
                const { IncludeTerms, ExcludeTerms } = booleanSearchToObject(booleanSearchTerms);
                filter.ExcludeTerms = ExcludeTerms;
                filter.IncludeTerms = IncludeTerms;
            } else {
                filter.ExcludeTerms = null;
                filter.IncludeTerms = null;
            }
            if (isGroupContext) {
                const keywordsGroup =
                    KeywordsGroupUtilities.getGroupById(seedKeyword) ||
                    KeywordsGroupUtilities.getGroupByName(seedKeyword);
                filter.GroupHash = keywordsGroup.GroupHash;
                filter.keyword = keywordsGroup.Id;
            }
            this.props.onFilterChange(
                { country, keyword: seedKeyword, websource: webSource, ...filter },
                false,
            );
            this.timeoutId = null;
        }, 50);
    }
}

const mapStateToProps = (props) => {
    const { keywordGeneratorTool } = props;
    const {
        seedKeyword = String(),
        country,
        duration,
        webSource,
        booleanSearchTerms,
    } = keywordGeneratorTool;
    const isSeedKeywordStartsWithGroupPrefix = seedKeyword?.startsWith("*");
    const isGroupContext =
        keywordGeneratorTool.isGroupContext || isSeedKeywordStartsWithGroupPrefix;
    const { volumeFromValue, volumeToValue, cpcFromValue, cpcToValue } = props.routing.params;
    return {
        seedKeyword: isSeedKeywordStartsWithGroupPrefix
            ? KeywordsGroupUtilities.getGroupNameById(seedKeyword.substring(1))
            : seedKeyword,
        country,
        duration,
        webSource,
        booleanSearchTerms,
        isGroupContext,
        volumeFromValue,
        volumeToValue,
        cpcFromValue,
        cpcToValue,
    };
};

export default connect(mapStateToProps)(KeywordGeneratorToolPageTableHeader);
