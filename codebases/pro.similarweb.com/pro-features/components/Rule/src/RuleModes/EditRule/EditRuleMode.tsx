import { SWReactIcons } from "@similarweb/icons";
import noop from "lodash/noop";
import { array, arrayOf, bool, func, number, string } from "prop-types";
import React, { useState } from "react";
import { Tab, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import BorderlessDropdown, { IRuleTypeOption } from "./EditRuleComponents/BorderlessDropdown";
import { CompleteRuleChipItem, RuleIndex } from "../../styledComponents";
import { Button } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "filters/ngFilters";
import { colorsPalettes } from "@similarweb/styles";
import {
    CloseIconWrapper,
    ContentContainer,
    DoneButtonContainer,
    EditRuleContainer,
    EditRuleDivider,
    EditRuleFooter,
    LockIcon,
    PromptWrapper,
    RuleFooterDescription,
    TabListStyled,
    TabsContainer,
} from "components/Rule/src/RuleModes/EditRule/EditRuleModeStyles";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import StringTab from "components/Rule/src/RuleModes/Tabs/StringTab";
import CustomStringTab from "components/Rule/src/RuleModes/Tabs/CustomStringTab";
import FoldersTab from "components/Rule/src/RuleModes/Tabs/FoldersTab";
import { StyledPill } from "styled components/StyledPill/src/StyledPill";
import { IRule } from "components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import { ISegmentUrl } from "pages/segments/wizard/SegmentRulesStep/SegmentUrlList/SegmentUrlListTypes";
import { ISite } from "components/Workspace/Wizard/src/types";
import { RuleSummary } from "components/Rule/src/RuleModes/RuleSummary";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import ExactUrlsTab from "components/Rule/src/RuleModes/Tabs/ExactUrlsTab";

// The rule index is 0-based, therefore we increment it
// by one before showing the number in the ui
const DISPLAY_INDEX_OFFSET = 1;

export interface IEditRuleModeProps {
    /**
     * The current rule index in the user defined rules array
     */
    index: number;

    /**
     * The rule object.
     */
    rule: any;

    /**
     * Defines which rule type can be chosen in the type dropdown menu
     * (Include / Exclude rule)
     */
    ruleTypeOptions: IRuleTypeOption[];

    /**
     * The chosen rule type from the ruleTypeOptions
     */
    selectedRuleTypeIndex: number;

    /**
     * Placeholder text for the popular words search
     */
    searchInputPlaceholderText: string;

    /**
     * Flag indicating if any data is being loaded at the moment
     * used to block UI for avoiding race conditions and other fancy bugs
     */
    isLoadingData: boolean;

    /**
     * Flag indicating whether we want to filter out popular words according
     * to "words only", or all words. see WordsOnlyToggle component for more details
     */
    shouldFetchWordsOnly: boolean;

    /**
     * Handles picking a popular word from the popular words chips
     */
    onAddItems: (itemStrings: string[], isExactMatchPhrase: boolean) => void;

    /**
     * Handles changing the rule type from the ruleTypes dropdown (Include/Exclude types etc.)
     */
    onRuleTypeSelectionChange: (itemProps: any) => void;

    /**
     * Handles closing the currently edited rule
     */
    onCloseButtonClick: (event: React.MouseEvent<HTMLSpanElement>) => void;

    /**
     * Toggles the words only flag. see definition above.
     */
    onWordsOnlyToggle: (e) => void;

    /**
     * handle remove string ,
     * that allows the user to remove words he already choose
     * in current edit rule
     */
    onRemoveItems: () => void;

    onUpdateItem: (rule: IRule) => void;

    /**
     * user claim mid tier , user should only have limited access to segments module
     */
    isMidTierUser: boolean;

    selectedSite: ISite;
    segmentRules: IRule[];
    getUrlsPreview: (segmentRules: IRule[]) => Promise<ISegmentUrl[]>;
    hideUrlsPreview?: boolean;
    hasExistingUrlsCompundStringNoRobots: (segmentRules: IRule[]) => Promise<boolean>;
}

export const getTabNameForTracking = ({ selectedSegmentTab }) => {
    switch (selectedSegmentTab) {
        case "0":
            return "String";
        case "1":
            return "Custom String";
        case "2":
            return "Folders";
        default:
            return "String";
    }
};

const getTabObjects = ({ isMidTierUser, rule }) => {
    return [
        {
            tabName: "String",
            rulesKey: "words",
            midTierOrder: 2,
            defaultOrder: 1,
            isLocked: isMidTierUser,
            isNew: false,
            TabComponent: StringTab,
            selectedNum: rule.words.length,
            tooltipText: "segments.wizard.step2.string.tab.tooltip",
            midTierDescription: "segments.wizard.step2.string.miduser.description",
        },
        {
            tabName: "Custom String",
            rulesKey: "exact",
            midTierOrder: 3,
            defaultOrder: 2,
            isLocked: isMidTierUser,
            isNew: false,
            TabComponent: CustomStringTab,
            selectedNum: rule.exact.length,
            tooltipText: "segments.wizard.step2.custom.string.tab.tooltip",
            midTierDescription: "segments.wizard.step2.custom.string.miduser.description",
        },
        {
            tabName: "Folders",
            rulesKey: "folders",
            midTierOrder: 1,
            defaultOrder: 4,
            isLocked: false,
            isNew: true,
            TabComponent: FoldersTab,
            selectedNum: rule.folders.length,
            tooltipText: "segments.wizard.step2.folders.tab.tooltip",
        },
        {
            tabName: "Exact URL",
            rulesKey: "exactURLS",
            midTierOrder: 4,
            defaultOrder: 3,
            isLocked: isMidTierUser,
            isNew: true,
            TabComponent: ExactUrlsTab,
            selectedNum: rule.exactURLS.length,
            tooltipText: "segments.wizard.step2.exactURLS.tab.tooltip",
        },
    ].sort((a, b) =>
        isMidTierUser ? a.midTierOrder - b.midTierOrder : a.defaultOrder - b.defaultOrder,
    );
};

const EditRuleMode: React.FunctionComponent<IEditRuleModeProps> = ({
    index,
    rule,
    searchInputPlaceholderText,
    ruleTypeOptions,
    selectedRuleTypeIndex,
    onRuleTypeSelectionChange,
    onCloseButtonClick,
    onAddItems,
    isLoadingData,
    shouldFetchWordsOnly,
    onWordsOnlyToggle,
    onRemoveItems,
    onUpdateItem,
    selectedSite,
    segmentRules,
    getUrlsPreview,
    hideUrlsPreview,
    hasExistingUrlsCompundStringNoRobots,
    isMidTierUser,
}) => {
    const [selectedTab, setSelectedTab] = useState<number>(0);

    const onTabSelect = (index: any) => {
        setSelectedTab(index);
        TrackWithGuidService.trackWithGuid("segment.wizard.tab", "switch", {
            tabName: getTabNameForTracking({ selectedSegmentTab: index.toString() }),
        });
    };

    const orderedTabs = getTabObjects({ isMidTierUser, rule });
    const selectedTabObj = orderedTabs[selectedTab];
    const tabProps = {
        index,
        rule,
        searchInputPlaceholderText,
        shouldFetchWordsOnly,
        onWordsOnlyToggle,
        isLoadingData,
        onAddItems,
        onRemoveItems,
        onUpdateItem,
        selectedSite,
        segmentRules,
        getUrlsPreview,
        hideUrlsPreview,
        hasExistingUrlsCompundStringNoRobots,
        isMidTierUser,
    };
    return (
        <EditRuleContainer>
            <PromptWrapper>
                <FlexRow alignItems={"center"}>
                    <RuleIndex>{index + DISPLAY_INDEX_OFFSET}.</RuleIndex>
                    <BorderlessDropdown
                        id={index}
                        ruleTypeOptions={ruleTypeOptions}
                        selectedRuleTypeIndex={selectedRuleTypeIndex}
                        onRuleTypeSelectionChange={onRuleTypeSelectionChange}
                    />
                </FlexRow>
                <CloseIconWrapper onClick={isLoadingData ? noop : onCloseButtonClick}>
                    <SWReactIcons size="sm" iconName={"clear"} />
                </CloseIconWrapper>
            </PromptWrapper>
            <TabsContainer>
                <TabListStyled>
                    {orderedTabs.map((tab, index) => {
                        const isSelected = selectedTab === index;
                        return (
                            <Tab
                                key={`tab-${index}`}
                                onClick={() => onTabSelect(index)}
                                selected={isSelected}
                            >
                                {tab.isLocked && (
                                    <LockIcon
                                        selected={isSelected}
                                        size={"xs"}
                                        iconName={"locked"}
                                    />
                                )}
                                <PlainTooltip
                                    placement={"top"}
                                    tooltipContent={i18nFilter()(tab.tooltipText)}
                                >
                                    <span>
                                        {i18nFilter()(tab.tabName)}{" "}
                                        {tab.selectedNum ? ` (${tab.selectedNum})` : ""}
                                    </span>
                                </PlainTooltip>
                                {tab.isNew && (
                                    <StyledPill
                                        style={{
                                            backgroundColor: colorsPalettes.orange[400],
                                            marginLeft: "10px",
                                        }}
                                    >
                                        NEW
                                    </StyledPill>
                                )}
                            </Tab>
                        );
                    })}
                </TabListStyled>
            </TabsContainer>
            <ContentContainer>
                <Tabs onSelect={onTabSelect} selectedIndex={selectedTab} forceRenderTabPanel={true}>
                    {orderedTabs.map((tab, idx) => (
                        <TabPanel key={`tab-panel-${idx}`}>
                            {idx === selectedTab && <tab.TabComponent {...tabProps} />}
                        </TabPanel>
                    ))}
                </Tabs>
            </ContentContainer>

            <EditRuleDivider />

            <EditRuleFooter>
                {isMidTierUser && selectedTabObj.midTierDescription && (
                    <RuleFooterDescription>
                        {i18nFilter()(selectedTabObj.midTierDescription)}
                    </RuleFooterDescription>
                )}

                <DoneButtonContainer>
                    <Button type="flat" onClick={isLoadingData ? noop : onCloseButtonClick}>
                        {i18nFilter()("segmentWizard.editRule.done.button")}
                    </Button>
                    {selectedTabObj.isLocked && (
                        <Button type="upsell" onClick={SegmentsUtils.openMidTierUserUpsellModal}>
                            {i18nFilter()("segmentWizard.editRule.upgrade.button")}
                        </Button>
                    )}
                </DoneButtonContainer>
            </EditRuleFooter>
        </EditRuleContainer>
    );
};

EditRuleMode.propTypes = {
    index: number.isRequired,
    ruleTypeOptions: array.isRequired,
    selectedRuleTypeIndex: number,
    searchInputPlaceholderText: string,
    onRuleTypeSelectionChange: func.isRequired,
    onCloseButtonClick: func.isRequired,
    isLoadingData: bool,
    onAddItems: func.isRequired,
};

EditRuleMode.defaultProps = {
    isLoadingData: false,
    selectedRuleTypeIndex: 0,
    searchInputPlaceholderText: "Search for a string",
};

export default EditRuleMode;
