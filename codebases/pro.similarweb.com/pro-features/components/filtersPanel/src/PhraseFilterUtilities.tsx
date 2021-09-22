import {
    ProgressBarSingleContentContainer,
    ProgressBarSingleTextContainer,
    SearchInput,
    Text,
} from "components/filtersPanel/src/filterPanelStyled";
import { AdvancedFilterButton } from "components/filtersPanel/src/filtersPanel";
import { Pill } from "components/Pill/Pill";
import { ProgressBar } from "components/React/ProgressBar";
import I18n from "components/WithTranslation/src/I18n";
import React from "react";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { IChosenItem } from "../../../../app/@types/chosenItems";
import { percentageFilter } from "filters/ngFilters";
import { DefaultFetchService } from "services/fetchService";
import { SimpleChipItemWrap } from "@similarweb/ui-components/dist/dropdown/src/chipdown/ChipdownStyles";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

export const getPhraseFilterData = (phraseFilterDataEndpoint) => async (filters) => {
    const fetchService = DefaultFetchService.getInstance();
    try {
        const data = await fetchService.get<any>(phraseFilterDataEndpoint, filters);
        const phraseFilterData = data.map((dataItem) => {
            const { SearchTerm: searchTerm, Share: share, SiteOrigins: siteOrigins } = dataItem;
            return { searchTerm, share, siteOrigins };
        });
        return phraseFilterData;
    } catch (e) {
        return Array();
    }
};

export const ButtonWithPill = (props) => {
    const { selectedText, placeholder, onCloseItem, disabled } = props;
    const onClose = (event) => {
        event.stopPropagation();
        onCloseItem(event);
    };
    return selectedText ? (
        <SimpleChipItemWrap text={selectedText} onCloseItem={onClose} />
    ) : (
        <AdvancedFilterButton disabled={disabled}>
            <I18n>{placeholder}</I18n>
            <Pill text="NEW" />
        </AdvancedFilterButton>
    );
};

export const onKeyDown = (closeChipDown) => (event) => {
    const { keyCode } = event;
    const ESC_KEY_CODE = 27;
    if (keyCode === ESC_KEY_CODE) {
        closeChipDown();
    }
};

export interface IPhraseFilterProps {
    filterData: IFilterData[];
    onClickCallback: (IFilterData) => void;
    chosenItems: IChosenItem[];
    searchPlaceholder?: string;
    trafficShareProgressBarTooltipHeader?: string;
    tableHeadersCompare?: string[];
    tableHeadersSingle?: string[];
}

export interface ISiteOrigins {
    [key: string]: string;
}

export interface IFilterData {
    searchTerm: string;
    share: string;
    siteOrigins: ISiteOrigins;
}

export const filterBySearchValue = (query) => ({ searchTerm }) => searchTerm.includes(query);

export const shareFilter = (share) => {
    const PERCENTAGE_FILTER_FRACTION_LENGTH = 2;
    const DEFAULT_PERCENTAGE_SIGN = "%";
    const shareValuePercents =
        percentageFilter()(share, PERCENTAGE_FILTER_FRACTION_LENGTH) + DEFAULT_PERCENTAGE_SIGN;
    return shareValuePercents;
};

export const ProgressBarSingle = ({ share, hideData = false }) => {
    const NA = "NA";
    const shareValuePercents = shareFilter(share);
    const progressBarWidth = share ? share * 100 : Number();
    return (
        !hideData && (
            <FlexRow>
                <ProgressBarSingleTextContainer>
                    <Text fontSize={14}>{shareValuePercents}</Text>
                </ProgressBarSingleTextContainer>
                <ProgressBarSingleContentContainer>
                    {shareValuePercents !== NA && <ProgressBar width={progressBarWidth} />}
                </ProgressBarSingleContentContainer>
            </FlexRow>
        )
    );
};

export const createTableHeader = (header) => {
    const HEADER_TEXT_OPACITY = 0.7;
    return <Text opacity={HEADER_TEXT_OPACITY}>{header}</Text>;
};

export const SearchInputWrapper = ({ searchPlaceholder, onChange }) => {
    const SEARCH_INPUT_DEFAULT_ICON = "search";
    const onFocus = () => {
        TrackWithGuidService.trackWithGuid("website.keywords.table.filters.phrase", "open");
    };
    return (
        <SearchInput
            onFocus={onFocus}
            inputFocusParameters={{ preventScroll: true }}
            isFocused={true}
            hideBorder={true}
            iconName={SEARCH_INPUT_DEFAULT_ICON}
            placeholder={searchPlaceholder}
            onChange={onChange}
        />
    );
};
