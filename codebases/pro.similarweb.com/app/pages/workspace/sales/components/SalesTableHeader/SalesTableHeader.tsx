import React from "react";
import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import {
    ChipItemWrapper,
    ChipItemBasicWrapper,
    ChipItemText,
} from "@similarweb/ui-components/dist/chip/src/elements";

import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    QuotaAndUtilsContainer,
    QuotaAndUtilsLeftBox,
} from "pages/workspace/sales/SalesTableContainer/StyledTable";
import { EmailDigestContainer } from "pages/workspace/sales/EmaiDigest/EmailDigestContainer";
import { DownloadExcelContainer, SearchContainer } from "pages/workspace/StyledComponent";
import { IOpportunityListItem } from "pages/workspace/common/types";
import AddOpportunitiesButton, {
    AddOpportunitiesButtonOption,
} from "pages/workspace/common components/AddOpportunitiesButton/src/AddOpportunitiesButton";
import { hasMobileWeb } from "pages/workspace/common/workspacesUtils";
import { commonWebSources } from "components/filters-bar/utils";
import PredefinedViewsDropdown from "pages/workspace/sales/components/PredefinedViewsDropdown/PredefinedViewsDropdown";
import { CountryFilter } from "components/filters-bar/country-filter/CountryFilter";
import { useTrack } from "components/WithTrack/src/useTrack";
import {
    Container,
    ListTitle,
    Name,
    Subtitle,
    StyledDropdownsWrapper,
    StyledTableFiltersContainer,
    StyledSalesBoxTitleContainer,
    StyledFilterWrapper,
    StyledCountryDropdownButton,
} from "./Styled";
import SignalsContainer from "pages/workspace/sales/sub-modules/signals/components/SignalsContainer";
import { SWReactIcons } from "@similarweb/icons";

interface Props {
    updatingList: boolean;
    workspaceId: string;
    activeList: IOpportunityListItem;
    countries: any[];
    impersonateMode: boolean;
    isShowedUnsubscribe: boolean;
    lastSnapshotDate: Dayjs;
    link: string;
    predefinedViews: string[];
    selectedViewId: string;
    sizeOpportunityLeadsInList: number;
    tableSearchTerm: null | string;
    addOpportunitiesButtonOptions: AddOpportunitiesButtonOption[];
    isExcelAllowed: boolean;
    isFroUser: boolean;
    clickSubscribeBtnEmailDigest: (isSubscribe: boolean, typeOfTrackEvent: string) => Promise<void>;
    closeUnsubscribeEmailDigestModal: (typeOfEvent: string) => void;
    editOpportunityList: () => void;
    onCountryChange: ({ id: any }) => void;
    onExcelDownloadClick: (e: any) => void;
    onOpenDropdown: (isOpen: boolean) => Promise<void>;
    onSearch: (query: string) => void;
    onViewChange: ({ id: string }) => void;
    openColumnPicker: () => void;
    hasCustomView: boolean;
    metricsCount: Record<string, number>;
    tableLoading: boolean;
    onSignalChange(eventFilterType?: string, eventFilterSubType?: string): void;
}

const SalesTableHeader = ({
    tableLoading,
    activeList,
    workspaceId,
    addOpportunitiesButtonOptions,
    impersonateMode,
    lastSnapshotDate,
    link,
    predefinedViews,
    sizeOpportunityLeadsInList,
    tableSearchTerm,
    selectedViewId,
    isShowedUnsubscribe,
    countries,
    isExcelAllowed,
    isFroUser,
    clickSubscribeBtnEmailDigest,
    closeUnsubscribeEmailDigestModal,
    editOpportunityList,
    onCountryChange,
    onExcelDownloadClick,
    onOpenDropdown,
    onSearch,
    onViewChange,
    hasCustomView,
    openColumnPicker,
    metricsCount,
    onSignalChange,
    updatingList,
}: Props) => {
    const [selectedCountryId, selectCountryId] = React.useState(getInitialSelectedCountryId());
    const t = useTranslation();
    const [track] = useTrack();
    const { country: countryIdFromList, friendlyName } = activeList;
    const country = countries.some(({ id }) => id === countryIdFromList)
        ? countryIdFromList
        : countries[0].id;
    const { [hasMobileWeb(country) ? "total" : "desktop"]: webSourceFn } = commonWebSources;
    const { text } = webSourceFn();
    const handleDropdownToggle = (isOpen) => {
        track("Drop down", isOpen ? "Open" : "Close", "Header/Country Filter");
    };
    const handleCountryChange = (country) => {
        track("Drop down", "Click", `Header/Country Filter/${country?.children || ""}`);
        selectCountryId(country.id);
        onCountryChange(country);
    };
    const handlePredefinedViewToggle = (isOpen) => {
        if (isOpen) track("Drop down", "Open", "Header/Open Predefined View");
    };

    const renderCountryDropdownButton = React.useCallback(
        (selectedCountry: { id: number; text: string }) => {
            return (
                <StyledCountryDropdownButton key={selectedCountry.id}>
                    <ChipItemWrapper>
                        <i
                            className={classNames(
                                "chipsItemCountry",
                                `country-icon-${selectedCountry.id}`,
                            )}
                        />
                        <ChipItemBasicWrapper text={selectedCountry.text}>
                            <ChipItemText className="ChipItemText">
                                {selectedCountry.text}
                            </ChipItemText>
                        </ChipItemBasicWrapper>
                        <SWReactIcons iconName="arrow" />
                    </ChipItemWrapper>
                </StyledCountryDropdownButton>
            );
        },
        [],
    );

    function getInitialSelectedCountryId(): number {
        const countryObject = countries.find(({ id }) => id === activeList.country);

        if (!countryObject) {
            return countries[0].id;
        }

        return countryObject.id;
    }

    return (
        <>
            <StyledSalesBoxTitleContainer alignItems="start">
                <Container>
                    <ListTitle>
                        <Name>{friendlyName}</Name>
                        <IconButton
                            onClick={editOpportunityList}
                            type="flat"
                            iconName="settings"
                            dataAutomation="list-header-settings-button"
                        />
                    </ListTitle>
                    <Subtitle indent={10} opacity={0.6}>
                        {`${dayjs.utc(lastSnapshotDate).format("MMMM YYYY")}, ${text}`}
                    </Subtitle>
                </Container>
                <QuotaAndUtilsContainer>
                    <QuotaAndUtilsLeftBox>
                        {!isFroUser && (
                            <EmailDigestContainer
                                isImpersonateMode={impersonateMode}
                                isSubscriptionActive={activeList.isSubscriptionActive}
                                isShowUnsubscribeFromUrl={isShowedUnsubscribe}
                                onSubscribeEmailDigest={clickSubscribeBtnEmailDigest}
                                onCloseUnsubscribeEmailDigestModal={
                                    closeUnsubscribeEmailDigestModal
                                }
                                sizeCurrentLeads={sizeOpportunityLeadsInList}
                            />
                        )}
                    </QuotaAndUtilsLeftBox>
                    <AddOpportunitiesButton
                        options={addOpportunitiesButtonOptions}
                        buttonLabel={t("workspace.sales.add.websites")}
                        onDropdownToggle={onOpenDropdown}
                        width={240}
                    />
                </QuotaAndUtilsContainer>
            </StyledSalesBoxTitleContainer>
            <StyledTableFiltersContainer>
                <StyledDropdownsWrapper>
                    <StyledFilterWrapper>
                        <CountryFilter
                            width={215}
                            height={40}
                            availableCountries={countries}
                            changeCountry={handleCountryChange}
                            onToggle={handleDropdownToggle}
                            selectedCountryIds={{
                                [selectedCountryId]: true,
                            }}
                            dropdownPopupPlacement="ontop-left"
                            renderButtonComponent={renderCountryDropdownButton}
                        />
                    </StyledFilterWrapper>
                    <SignalsContainer
                        disabled={tableLoading}
                        workspaceId={workspaceId}
                        onChange={onSignalChange}
                        updatingList={updatingList}
                        countryCode={selectedCountryId}
                        opportunitiesListId={activeList.opportunityListId}
                    />
                </StyledDropdownsWrapper>
                <StyledDropdownsWrapper>
                    <StyledFilterWrapper>
                        <PredefinedViewsDropdown
                            width={215}
                            height={40}
                            dropdownPopupPlacement="ontop-left"
                            options={predefinedViews}
                            onChange={onViewChange}
                            selectedViewId={selectedViewId}
                            openColumnPicker={openColumnPicker}
                            hasCustomView={hasCustomView}
                            metricsCount={metricsCount}
                            onToggle={handlePredefinedViewToggle}
                        />
                    </StyledFilterWrapper>
                </StyledDropdownsWrapper>
            </StyledTableFiltersContainer>
            <SearchContainer>
                <SearchInput
                    debounce={1000}
                    onChange={onSearch}
                    defaultValue={tableSearchTerm}
                    placeholder={t("workspaces.investors.table.search.placeholder")}
                />
                <PlainTooltip tooltipContent={t("workspace.sales.download.excel")}>
                    <DownloadExcelContainer href={link} onClick={onExcelDownloadClick}>
                        <IconButton
                            iconName={isExcelAllowed ? "excel" : "excel-locked"}
                            type="flat"
                            dataAutomation="list-header-download-excel-button"
                        />
                    </DownloadExcelContainer>
                </PlainTooltip>
            </SearchContainer>
        </>
    );
};

export default SalesTableHeader;
