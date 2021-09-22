import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { IChosenItem } from "app/@types/chosenItems";
import { StyledAddWebsiteButton } from "./styles";
import { BENCHMARK_ITEM_KEY, OpportunityMode } from "../../constants";
import { useOnOutsideClick } from "pages/sales-intelligence/hooks/useOnOutsideClick";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { AutocompleteWebsitesCompareItem } from "components/AutocompleteWebsites/AutocompleteWebsitesCompareItem";
import { BenchmarkResultType, BenchmarkType } from "../../types/benchmarks";
import { BaseWebsiteType } from "../../types/common";
import { SelectHeaderItem } from "pages/workspace/sales/components/SelectHeader/SelectHeader";
import { ConnectedProps } from "./AddCompetitorContainer";
import { disableOnOpportunityChange } from "../../helpers";

export type AddCompetitorContainerProps = {
    similarWebsites: unknown[];
    searchExcludeList: unknown[];
    updating?: boolean;
    country: BenchmarkResultType["country"];
    metric: BenchmarkType["metric"];
    onAddCompetitor(competitor: BaseWebsiteType): void;
    greaterIsBetter: boolean;
    opportunityMode: string;
    selectedWebsite?: BaseWebsiteType & { value: number };
    metricFormatter?(value: number): string;
};

export const AddCompetitor = ({
    similarWebsites,
    searchExcludeList,
    onAddCompetitor,
    updating = false,
    metric,
    country,
    fetchSimilarWebsites,
    greaterIsBetter,
    opportunityMode,
    selectedWebsite,
    metricFormatter,
}: AddCompetitorContainerProps & ConnectedProps) => {
    const [searchShown, setSearchShown] = React.useState(false);
    const translate = useTranslation();

    const closeSearch = () => setSearchShown(false);

    const handleChange = (website: { name: string; icon: string }) => {
        closeSearch();
        onAddCompetitor({
            domain: website.name,
            favicon: website.icon,
        });
    };

    const renderResultsHead = () => {
        return (
            <SelectHeaderItem
                firstTitle={"autocomplete.websitesCompare.seperator.text.similarSites"}
                secondTitle={"workspace.sales.benchmarks.item.header.metric"}
            />
        );
    };

    const getWebsites = (inputQuery: string) => fetchSimilarWebsites(country, metric, inputQuery);

    useOnOutsideClick("competitor-autocomplete", () => {
        if (searchShown) {
            setSearchShown(false);
        }
    });

    return (
        <StyledAddWebsiteButton>
            <IconButton
                type="flat"
                height={32}
                iconSize="xs"
                iconName="add"
                isDisabled={updating}
                onClick={() => setSearchShown(true)}
            >
                {translate(`${BENCHMARK_ITEM_KEY}.add_website_button`)}
            </IconButton>
            {searchShown && (
                <AutocompleteWebsitesCompareItem
                    className="competitor-autocomplete"
                    onClick={handleChange}
                    similarSites={similarWebsites}
                    onCloseButtonClick={closeSearch}
                    autocompleteProps={{
                        placeholder: "",
                    }}
                    excludes={searchExcludeList as IChosenItem[]}
                    overrideGetWebsites={getWebsites}
                    renderSimilarSitesHead={renderResultsHead}
                    renderSearchResultsHead={renderResultsHead}
                    secondColumnName={"metricValue"}
                    secondColumnFormatter={metricFormatter}
                    customItemStructure={(item) => {
                        return {
                            name: item.name,
                            icon: item.image,
                            metricValue: item.metricValue,
                            disabled: item.disabled,
                        };
                    }}
                    modifySearchResult={(items) =>
                        disableOnOpportunityChange(
                            items,
                            opportunityMode as OpportunityMode,
                            greaterIsBetter,
                            selectedWebsite?.value,
                        )
                    }
                />
            )}
        </StyledAddWebsiteButton>
    );
};
