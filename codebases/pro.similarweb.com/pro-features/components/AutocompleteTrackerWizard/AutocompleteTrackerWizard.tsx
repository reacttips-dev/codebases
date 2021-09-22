import React from "react";
import { useAutoCompleteClick } from "components/AutocompleteWebCategories/utils";
import { i18nFilter } from "filters/ngFilters";
import { getListItems, hasQuery, IListItem } from "./handlers";
import { getWebsiteResults } from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { connect } from "react-redux";
import { Tabs } from "./Tabs";
import { AutocompleteStyled, FakeInputContainerStyled } from "./styled";
import { DotsLoader, FakeInput } from "@similarweb/ui-components/dist/search-input";
import { ListItemSegment } from "pages/segments/components/ListItems";
import { ITrackerAsset } from "components/SecondaryBar/NavBars/MarketResearch/NavBarSections/CompetitiveTracking/CompetitiveTrackingTypes";
import { EMPTY_CUSTOM_SEGMENTS } from "services/segments/segmentsApiService";
import { sitesResourceService } from "services/sitesResource/sitesResourceService";
import { ETrackerAssetType } from "services/competitiveTracker/types";

export interface IAutocompleteTrackerWizardProps {
    selectedValue?: ITrackerAsset;
    onSelect: (selectedValue: ITrackerAsset) => void;
    excludeItems?: ITrackerAsset[];
    isOpenCallback?: (isOpen: boolean) => void;
    selectedAsset?: ITrackerAsset;
}

interface IAutocompleteTrackerWizardInnerProps extends IAutocompleteTrackerWizardProps {
    customSegmentsMeta: any;
    segmentsLoading: boolean;
}

const AutocompleteTrackerWizardInner: React.FunctionComponent<IAutocompleteTrackerWizardInnerProps> = ({
    selectedValue,
    onSelect,
    customSegmentsMeta = {},
    excludeItems = [],
    segmentsLoading,
    isOpenCallback,
    selectedAsset,
}) => {
    const autocompleteRef = React.useRef(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [listItems, setListItems] = React.useState([]);
    const [websiteResults, setWebsiteResults] = React.useState([]);
    useAutoCompleteClick(autocompleteRef);

    const onClearSearch = () => {
        onSelect(undefined);
    };

    const renderItemsClick = (item) => () => {
        autocompleteRef.current.truncateResults(true);
        onSelect(item);
        autocompleteRef.current.textFieldRef.clearValue();
    };

    const i18n = i18nFilter();

    const createListItem = (item: IListItem, index) => {
        const { displayText, image, name, id } = item;
        return (
            <ListItemSegment
                key={id + index}
                domain={displayText}
                name={name}
                img={image}
                onClick={renderItemsClick(item)}
            />
        );
    };
    const renderItems = ({ listItems, query }) => {
        setListItems(listItems);
        const {
            Segments: segments = [],
            AccountSegments: accountSegments = [],
        } = customSegmentsMeta;
        const hasSegments = Boolean(segments.length + accountSegments.length);
        return (
            <Tabs
                listItems={listItems}
                createListItem={createListItem}
                hasQuery={hasQuery(query)}
                segmentsLoading={segmentsLoading}
                hasSegments={hasSegments}
                selectedAsset={selectedAsset}
                websiteResults={websiteResults}
            />
        );
    };
    const getListItemsWrapper = async (query: string) => {
        let websiteResults = [];
        if (hasQuery(query)) {
            try {
                setIsLoading(true);
                websiteResults = await getWebsiteResults(query);
            } finally {
                setIsLoading(false);
            }
        } else if (selectedAsset) {
            try {
                setIsLoading(true);
                const similarInfo = await sitesResourceService.getSimilarInfo(
                    selectedAsset.type === ETrackerAssetType.Segment
                        ? selectedAsset.displayText
                        : selectedAsset.id,
                );
                websiteResults = similarInfo.map(({ Domain, Favicon }) => ({
                    name: Domain,
                    image: Favicon,
                }));
            } finally {
                setIsLoading(false);
            }
        }
        setWebsiteResults(websiteResults);
        return getListItems(
            selectedValue,
            onClearSearch,
            renderItemsClick,
            query,
            customSegmentsMeta,
            excludeItems,
            websiteResults,
        );
    };
    isOpenCallback?.(listItems.length && !selectedValue);
    if (selectedValue) {
        const { image, displayText, name } = selectedValue;
        return (
            <FakeInputContainerStyled isValid={true}>
                <FakeInput onClear={() => onSelect(undefined)}>
                    <ListItemSegment domain={displayText} img={image} name={name} />
                </FakeInput>
            </FakeInputContainerStyled>
        );
    }
    return (
        <AutocompleteStyled
            className={"AutocompleteWithTabs"}
            getListItems={getListItemsWrapper}
            renderItems={renderItems}
            preventTruncateUnlessForced={true}
            ref={autocompleteRef}
            loadingComponent={<DotsLoader />}
            shouldRefresh={Object.keys(customSegmentsMeta).length ? true : false}
            floating={true}
            debounce={250}
            isLoading={isLoading}
            placeholder={i18n("competitive.tracker.autocomplete.placeholder")}
            selectedValue={selectedValue?.displayText}
        />
    );
};

const mapStateToProps = (state) => {
    const { segmentsModule } = state;
    const { segmentsLoading, customSegmentsMeta = EMPTY_CUSTOM_SEGMENTS } = segmentsModule;
    return {
        customSegmentsMeta,
        segmentsLoading,
    };
};

export const AutocompleteTrackerWizard: React.FunctionComponent<IAutocompleteTrackerWizardProps> = connect(
    mapStateToProps,
)(AutocompleteTrackerWizardInner);
