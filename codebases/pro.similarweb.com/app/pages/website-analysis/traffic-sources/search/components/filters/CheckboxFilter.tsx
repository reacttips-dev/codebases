import React from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { i18nFilter } from "filters/ngFilters";
import { useWebsiteKeywordsPageTableTopContext } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageContext";

export const CheckboxFilter: React.FC<any> = (props) => {
    const { tooltip, onChange, text, isSelected, isDisabled } = props;
    return (
        <PlainTooltip placement="top" tooltipContent={tooltip}>
            <div>
                <Checkbox
                    onClick={onChange}
                    label={text}
                    selected={isSelected}
                    isDisabled={isDisabled}
                />
            </div>
        </PlainTooltip>
    );
};

export const IncludeNewKeywordsFilterView = ({ includeNewKeywords, onChangeNewlyDiscovered }) => {
    return (
        <CheckboxFilter
            isSelected={includeNewKeywords}
            onChange={() => onChangeNewlyDiscovered(!includeNewKeywords)}
            text={i18nFilter()("analysis.source.search.keywords.filters.new")}
            tooltip={i18nFilter()("analysis.source.search.keywords.filters.new.tooltip")}
        />
    );
};

export const IncludeNewKeywordsFilter: React.FC = () => {
    const context = useWebsiteKeywordsPageTableTopContext();
    const { onChangeNewlyDiscovered, tableFilters } = context;
    const { IncludeNewKeywords: includeNewKeywords } = tableFilters;
    return (
        <IncludeNewKeywordsFilterView
            includeNewKeywords={includeNewKeywords}
            onChangeNewlyDiscovered={onChangeNewlyDiscovered}
        />
    );
};

export const IncludeTrendingKeywordsFilterView = ({
    includeTrendingKeywords,
    onChangeTrending,
}) => {
    return (
        <CheckboxFilter
            isSelected={includeTrendingKeywords}
            onChange={() => onChangeTrending(!includeTrendingKeywords)}
            text={i18nFilter()("analysis.source.search.keywords.filters.trending")}
            tooltip={i18nFilter()("analysis.source.search.keywords.filters.trending.tooltip")}
        />
    );
};

export const IncludeTrendingKeywordsFilter: React.FC = () => {
    const context = useWebsiteKeywordsPageTableTopContext();
    const { tableFilters, onChangeTrending } = context;
    const { IncludeTrendingKeywords: includeTrendingKeywords } = tableFilters;
    return (
        <IncludeTrendingKeywordsFilterView
            includeTrendingKeywords={includeTrendingKeywords}
            onChangeTrending={onChangeTrending}
        />
    );
};

export const IncludeQuestionKeywordsFilter: React.FC = () => {
    const context = useWebsiteKeywordsPageTableTopContext();
    return (
        <CheckboxFilter
            isSelected={context.tableFilters.IncludeQuestions}
            onChange={() => context.onChangeQuestions(!context.tableFilters.IncludeQuestions)}
            text={i18nFilter()("analysis.source.search.keywords.filters.questions")}
            tooltip={i18nFilter()("analysis.source.search.keywords.filters.questions.tooltip")}
        />
    );
};
