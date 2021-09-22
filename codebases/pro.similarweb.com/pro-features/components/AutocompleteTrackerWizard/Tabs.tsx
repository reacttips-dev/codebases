import { getIconColor, Icon, DotsLoaderContainer, CustomTab, CustomTabList } from "./styled";
import { ScrollAreaWrap } from "components/AutocompleteWebCategories/utils";
import React from "react";
import { Section } from "./Section";
import { TabPanel, Tabs as TabsView } from "@similarweb/ui-components/dist/tabs";
import { colorsPalettes } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";
import { NoSegments } from "components/AutocompleteTrackerWizard/NoSegments";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { ETrackerAssetType } from "services/competitiveTracker/types";
import { assetsIcon } from "pages/competitive-tracking/wizard/CompetitiveTrackingWizardTypes";
import { hasSegmentsClaim } from "pages/segments/config/segmentsConfigHelpers";
import UnlockModal from "components/React/UnlockModalProvider/UnlockModalProvider";
import UnlockModalConfig from "components/Modals/src/UnlockModal/unlockModalConfig";
import { isLocked } from "common/services/pageClaims";
import { swSettings } from "common/services/swSettings";

const { Website, Company, Segment } = ETrackerAssetType;
const DROPDOWN_AMOUNT_TO_DISPLAY = 100;
const SCROLL_STYLE = { maxHeight: 400, minHeight: 0 };

const getTabList = (listItems, trackerAssetType) => {
    return listItems.filter(({ type }) => type === trackerAssetType);
};

export const Tabs = ({
    listItems,
    createListItem,
    hasQuery,
    segmentsLoading,
    hasSegments,
    selectedAsset,
    websiteResults,
}) => {
    const [selectedIndex, setSelectedIndex] = React.useState<ETrackerAssetType>(Website - 1);
    const [isSegmentHookModalOpen, setIsSegmentHookModalOpen] = React.useState<boolean>(false);
    const onTabSelected = (index: ETrackerAssetType) => {
        setSelectedIndex(index);
    };
    const segmentsTabList = getTabList(listItems, Segment);
    const websitesTabList = getTabList(listItems, Website);
    const mySegments = segmentsTabList.filter(({ isAccount }) => !isAccount);
    const accountSegments = segmentsTabList.filter(({ isAccount }) => isAccount);
    const isSegmentsLocked = isLocked(swSettings.components.CustomSegments);
    const i18n = i18nFilter();
    const updateIsSegmentHookModalOpen = (value) => () => setIsSegmentHookModalOpen(value);
    const openSegmentsHookModal = updateIsSegmentHookModalOpen(true);
    const closeSegmentsHookModal = updateIsSegmentHookModalOpen(false);
    return (
        <div className={listItems.length > 0 ? "ListItemsContainer" : ""}>
            <UnlockModal
                isOpen={isSegmentHookModalOpen}
                onCloseClick={closeSegmentsHookModal}
                location="Hook PRO/CompetitiveTracker"
                {...UnlockModalConfig().segments}
            />
            {listItems.length > 0 && (
                <TabsView selectedIndex={selectedIndex} onSelect={onTabSelected}>
                    <CustomTabList>
                        <CustomTab>
                            <Icon
                                iconName={assetsIcon[Website]}
                                color={getIconColor(selectedIndex, Website)}
                            />
                            {i18n("si.common.websites")}
                        </CustomTab>
                        <CustomTab
                            disabled={segmentsLoading}
                            onClick={() => !hasSegmentsClaim() && openSegmentsHookModal()}
                        >
                            {segmentsLoading && hasSegmentsClaim() ? (
                                <DotsLoaderContainer>
                                    <DotsLoader />
                                </DotsLoaderContainer>
                            ) : (
                                <>
                                    <Icon
                                        iconName={assetsIcon[Segment]}
                                        color={getIconColor(selectedIndex, Segment)}
                                    />
                                    {i18n("competitive.tracker.auto.complete.segments", {
                                        amount: segmentsTabList.length,
                                    })}
                                    {isSegmentsLocked && (
                                        <Icon iconName="locked" color={colorsPalettes.green.s100} />
                                    )}
                                </>
                            )}
                        </CustomTab>
                        {/*                        <CustomTab>
                            <Icon
                                iconName={assetsIcon[Company]}
                                color={getIconColor(selectedIndex, Company - 1)}
                            />
                            {i18n("competitive.tracker.auto.complete.companies")}
                        </CustomTab>*/}
                    </CustomTabList>
                    <TabPanel>
                        <ScrollAreaWrap style={SCROLL_STYLE}>
                            <Section
                                header={i18n(
                                    hasQuery
                                        ? "common.suggested.websites"
                                        : selectedAsset && websiteResults.length
                                        ? "autocomplete.websitesCompare.seperator.text.similarSites"
                                        : "home.page.recents",
                                )}
                                content={websitesTabList.map(createListItem)}
                            />
                        </ScrollAreaWrap>
                    </TabPanel>
                    <TabPanel>
                        {hasSegments ? (
                            <ScrollAreaWrap style={SCROLL_STYLE}>
                                <Section
                                    content={mySegments
                                        .slice(0, DROPDOWN_AMOUNT_TO_DISPLAY)
                                        .map(createListItem)}
                                    header={i18n("common.segments.my", {
                                        amount: mySegments.length,
                                    })}
                                />
                                <Section
                                    content={accountSegments
                                        .slice(0, DROPDOWN_AMOUNT_TO_DISPLAY)
                                        .map(createListItem)}
                                    header={i18n("common.segments.account", {
                                        amount: accountSegments.length,
                                    })}
                                />
                            </ScrollAreaWrap>
                        ) : (
                            <NoSegments />
                        )}
                    </TabPanel>
                    <TabPanel>
                        {/*
                        <ScrollAreaWrap>{tabList.companies.map(createListItem)}</ScrollAreaWrap>
*/}
                    </TabPanel>
                </TabsView>
            )}
        </div>
    );
};
