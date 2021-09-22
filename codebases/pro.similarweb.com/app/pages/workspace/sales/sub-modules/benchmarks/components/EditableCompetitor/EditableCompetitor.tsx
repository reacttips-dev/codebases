import React from "react";
import WebsiteDomain from "pages/workspace/sales/components/WebsiteDomain/WebsiteDomain";
import { IChosenItem } from "app/@types/chosenItems";
import { StyledCompetitorContainer } from "./styles";
import { AutocompleteWebsitesCompareItem } from "components/AutocompleteWebsites/AutocompleteWebsitesCompareItem";
import { useOnOutsideClick } from "pages/sales-intelligence/hooks/useOnOutsideClick";
import { OpportunityMode, SELECT_PLACEHOLDER_TEXT } from "../../constants";
import { SelectHeaderItem } from "pages/workspace/sales/components/SelectHeader/SelectHeader";
import { ConnectedProps } from "./EditableCompetitorContainer";
import { BenchmarkResultType, BenchmarkType } from "../../types/benchmarks";
import { BaseWebsiteType } from "../../types/common";
import { disableOnOpportunityChange } from "../../helpers";

type EditableCompetitorProps = {
    color?: string;
    closable: boolean;
    clickable: boolean;
    website: BaseWebsiteType & { value: number };
    similarWebsites: unknown[];
    searchExcludeList: unknown[];
    metric: BenchmarkType["metric"];
    country: BenchmarkResultType["country"];
    onClose(domain: BaseWebsiteType["domain"]): void;
    onChange(competitor: BaseWebsiteType, prevDomain: BaseWebsiteType["domain"]): void;
    greaterIsBetter: boolean;
    opportunityMode: string;
    metricFormatter?(item: number): string;
};

export const EditableCompetitor = ({
    color,
    onClose,
    onChange,
    closable,
    clickable,
    similarWebsites,
    searchExcludeList,
    website,
    country,
    metric,
    fetchSimilarWebsites,
    greaterIsBetter,
    opportunityMode,
    metricFormatter,
}: EditableCompetitorProps & ConnectedProps): JSX.Element => {
    const [searchShown, setSearchShown] = React.useState(false);

    const closeSearch = () => setSearchShown(false);
    const autocompleteProps = { placeholder: SELECT_PLACEHOLDER_TEXT };

    const renderResultsHead = () => {
        return (
            <SelectHeaderItem
                firstTitle={"autocomplete.websitesCompare.seperator.text.similarSites"}
                secondTitle={"workspace.sales.benchmarks.item.header.metric"}
            />
        );
    };

    const getWebsites = (input: string) => fetchSimilarWebsites(country, metric, input);

    const handleClick = () => {
        if (clickable) {
            setSearchShown(true);
        }
    };

    const handleClose = () => {
        onClose(website.domain);
    };

    const handleChange = (item: { name: string; icon: string; value: number }) => {
        closeSearch();
        onChange({ domain: item.name, favicon: item.icon }, website.domain);
    };

    useOnOutsideClick("competitor-autocomplete", () => {
        if (searchShown) {
            closeSearch();
        }
    });

    return (
        <StyledCompetitorContainer>
            <WebsiteDomain
                domain={website.domain}
                favicon={website.favicon}
                badgeColor={color}
                closable={closable}
                clickable={clickable}
                onClose={handleClose}
                onClick={handleClick}
            />
            {searchShown && (
                <AutocompleteWebsitesCompareItem
                    className="competitor-autocomplete"
                    onClick={handleChange}
                    similarSites={similarWebsites}
                    onCloseButtonClick={closeSearch}
                    autocompleteProps={autocompleteProps}
                    excludes={searchExcludeList as IChosenItem[]}
                    overrideGetWebsites={getWebsites}
                    renderSearchResultsHead={renderResultsHead}
                    renderSimilarSitesHead={renderResultsHead}
                    secondColumnName="metricValue"
                    customItemStructure={(item) => {
                        return {
                            name: item.name,
                            icon: item.image,
                            metricValue: item.metricValue,
                            disabled: item.disabled,
                        };
                    }}
                    secondColumnFormatter={metricFormatter}
                    modifySearchResult={(items) =>
                        disableOnOpportunityChange(
                            items,
                            opportunityMode as OpportunityMode,
                            greaterIsBetter,
                            website?.value,
                        )
                    }
                />
            )}
        </StyledCompetitorContainer>
    );
};
