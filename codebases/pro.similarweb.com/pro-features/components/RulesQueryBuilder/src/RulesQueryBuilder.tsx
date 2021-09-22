import { RulesQueryBuilderContainer } from "components/Rule/src/styledComponents";
import {
    IRule,
    IRulesQueryBuilderProps,
    RuleModes,
    RuleTypes,
    RuleTypesDropdown,
} from "components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import noop from "lodash/noop";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import CompleteRuleMode from "../../Rule/src/RuleModes/CompleteRule/CompleteRuleMode";
import EditRuleMode from "../../Rule/src/RuleModes/EditRule/EditRuleMode";
import InitRuleMode from "../../Rule/src/RuleModes/InitRule/InitRuleMode";
import WithTrack from "../../WithTrack/src/WithTrack";
import WithTranslation from "../../WithTranslation/src/WithTranslation";
import rulesQueryHandler from "./handlers/rulesQueryHandler";
import {
    RowSeparator,
    RowSeparatorSubtitle,
    RowSeparatorTitle,
    RowSeparatorTitleContainer,
    RowSeparatorVerticalLine,
    RuleContainer,
} from "./RulesQueryBuilderStyles";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { useLoading } from "custom-hooks/loadingHook";

const RulesQueryBuilder: React.FunctionComponent<IRulesQueryBuilderProps> = ({
    updateSegmentRules,
    updateWordPredictions,
    updateShowWizardTips,
    getSegmentUrls,
    getWordPredictions,
    segmentsPreviewLoading,
    wordPredictionsLoading,
    segmentRules,
    selectedSite,
    hideUrlsPreview,
    hasExistingUrlsCompundStringNoRobots,
}) => {
    /**
     * Marks the currently active (open) rule. that is the rule that is currently in edit mode (EditRuleMode)
     * this is used to disable other rules while editing the current active rule.
     */
    const [activeIndex, setActiveIndex] = useState<number>(null);

    /**
     * Marks the currently active rule for fetching word predictions. we need to fetch word predictions up to the currently edited rule
     * As an example: if we're editing rule N, we want to fetch word predictions according to rules (1,2,... N).
     */
    const [activeWordPredictionIndex, setActiveWordPredictionIndex] = useState<number>(null);

    /**
     * Flag indicating whether we want to fetch word predictions that are considered words only, or all word predictions.
     * see SegmentsWordsFilter class for more details and definition of "words only". gets triggered within the EditRuleMode
     * by the wordsOnlyTrigger component.
     */
    const [shouldFetchWordsOnly, setShouldFetchWordsOnly] = useState<boolean>(false);

    /**
     * Top 10 word predictions for the rules query builder. (used within the InitRuleMode component
     * for displaying a preview of the word predictions)
     */
    const [wordPredictionsPreview, wordPredictionsPreviewOps] = useLoading<string[]>();

    /**
     * Initialize the segment rules when component mounts - make sure that
     * the segment rules are non-empty, and contain at least one empty rule
     */
    useEffect(() => {
        const rulesToUpdate = segmentRules ? [...segmentRules] : [];

        if (rulesToUpdate.length <= 0) {
            const newRule = rulesQueryHandler.createNewRule();
            rulesToUpdate.push(newRule);
            updateSegmentRules(rulesToUpdate);
        }

        if (activeIndex === null) {
            wordPredictionsPreviewOps.load(async () => {
                const predictions = await getWordPredictions(segmentRules ?? [], true, {
                    wordMinLength: 3,
                });
                return predictions.Data.slice(0, 7);
            });
        }
    }, [segmentRules]);

    const updateWordPredictionsIfNeeded = async (currentRuleIndex: number) => {
        if (currentRuleIndex !== activeWordPredictionIndex) {
            setActiveWordPredictionIndex(currentRuleIndex);
            await updateWordPredictions(shouldFetchWordsOnly, currentRuleIndex);
        }
    };

    const onWordsOnlyToggle = async () => {
        const toggledWordsOnly = !shouldFetchWordsOnly;
        setShouldFetchWordsOnly(toggledWordsOnly);
        await updateWordPredictions(toggledWordsOnly, activeWordPredictionIndex);
    };

    /**
     * Opens a new "Add Rule" box for choosing strings for building a new segment rule.
     * @param ruleIndex - The location of the rule on screen (first rule will be 0, second will be 1 etc.)
     */
    const onRuleAdd = async (ruleIndex: number) => {
        updateShowWizardTips(false);

        setActiveIndex(ruleIndex);
        await updateWordPredictionsIfNeeded(ruleIndex);
    };

    /**
     * Runs when the user presses X on the add rule box. closes the suggested strings box for
     * the given rule.
     */
    const onCloseRule = () => {
        // Clear any empty rules, and add a new empty rule at the end of the rules list
        // so that the user will always have a new empty rule at the bottom of the rules list
        let updatedRules = [...segmentRules];
        updatedRules = rulesQueryHandler.filterEmptyRules(updatedRules);

        const newRule = rulesQueryHandler.createNewRule();
        updatedRules.push(newRule);

        // Remove the currently edited index, so that all
        // rules will be active for editing
        setActiveIndex(null);

        // Update rules on the redux store, without segments data update
        updateSegmentRules(updatedRules);

        TrackWithGuidService.trackWithGuid("segment.wizard.addRule.done.button", "click", {
            newRule,
        });
    };

    /**
     * Change the type of the currently edited rule
     * (from "contains a string" to "does not contain a string")
     */
    const onRuleTypeChange = async (
        ruleIndex: number,
        selectionProps: { children: any; id: string },
    ) => {
        let updatedRules = [...segmentRules];
        updatedRules = rulesQueryHandler.setRuleType(updatedRules, ruleIndex, selectionProps);

        // Upon changing a rule type, we must update rules and the segmn
        updateSegmentRules(updatedRules);
    };

    /**
     * Adds a string to the currently edited rule.
     * @param ruleIndex - the currently edited rule index
     * @param word - the word to add for the rule
     */
    const onAddItems = async (
        ruleIndex: number,
        {
            words,
            exact,
            folders,
            exactURLS,
        }: {
            words: string[];
            exact: string[];
            folders: string[];
            exactURLS: string[];
        },
    ) => {
        let updatedRules = [...segmentRules];

        if (words) {
            updatedRules = rulesQueryHandler.setWordsForRule(updatedRules, ruleIndex, words);
        }
        if (exact) {
            updatedRules = rulesQueryHandler.setExactForRule(updatedRules, ruleIndex, exact);
        }
        if (folders) {
            updatedRules = rulesQueryHandler.setFoldersForRule(updatedRules, ruleIndex, folders);
        }
        if (exactURLS) {
            updatedRules = rulesQueryHandler.setExactURLSForRule(
                updatedRules,
                ruleIndex,
                exactURLS,
            );
        }

        // Clear any empty rules, and add a new empty rule at the end of the rules list
        // so that the user will always have a new empty rule at the bottom of the rules list
        updatedRules = rulesQueryHandler.filterEmptyRules(updatedRules);
        const newRule = rulesQueryHandler.createNewRule();
        updatedRules.push(newRule);

        // Update rules on the redux store
        updateSegmentRules(updatedRules);
    };

    /**
     * Removes a string from the currently edited rule
     * @param ruleIndex - The currently edited rule index
     * @param listType - The list type to remove the item from
     * @param items - The items to remove from the rule
     */
    const onRemoveItems = (ruleIndex: number, listType: string, items: string[]) => {
        let updatedRules = [...segmentRules];
        switch (listType) {
            case "words":
                updatedRules = rulesQueryHandler.removeWordsForRule(updatedRules, ruleIndex, items);
                break;
            case "exact":
                updatedRules = rulesQueryHandler.removeExactForRule(updatedRules, ruleIndex, items);
                break;
            case "folders":
                updatedRules = rulesQueryHandler.removeFoldersForRule(
                    updatedRules,
                    ruleIndex,
                    items,
                );
                break;
            case "exactURLS":
                updatedRules = rulesQueryHandler.removeExactURLSForRule(
                    updatedRules,
                    ruleIndex,
                    items,
                );
                break;
        }

        updatedRules = rulesQueryHandler.filterEmptyRules(updatedRules);
        const newRule = rulesQueryHandler.createNewRule();
        updatedRules.push(newRule);

        if (ruleIndex < activeWordPredictionIndex) {
            setActiveWordPredictionIndex(null);
        }
        updateSegmentRules(updatedRules);
    };

    const onUpdateItem = (ruleIndex: number, rule: IRule) => {
        let updatedRules = [...segmentRules];
        updatedRules = rulesQueryHandler.updateRule(updatedRules, ruleIndex, rule);
        updatedRules = rulesQueryHandler.filterEmptyRules(updatedRules);
        const newRule = rulesQueryHandler.createNewRule();
        updatedRules.push(newRule);

        if (ruleIndex < activeWordPredictionIndex) {
            setActiveWordPredictionIndex(null);
        }
        updateSegmentRules(updatedRules);
    };

    /**
     * Runs upon clicking the "+OR" button, turning a completed rule into edit rule
     * and open the words selection for editing the rule
     */
    const onEditCompletedRule = async (ruleIndex: number) => {
        setActiveIndex(ruleIndex);
        await updateWordPredictionsIfNeeded(ruleIndex);
    };

    const resolveRuleMode = (rule: IRule, isCurrentlyEdited: boolean) => {
        if (isCurrentlyEdited) {
            return RuleModes.edit;
        }
        const isNewRule =
            (!rule.words || rule.words.length <= 0) &&
            (!rule.exact || rule.exact.length <= 0) &&
            (!rule.folders || rule.folders.length <= 0) &&
            (!rule.exactURLS || rule.exactURLS.length <= 0);
        return isNewRule ? RuleModes.init : RuleModes.complete;
    };

    return (
        <RulesQueryBuilderContainer>
            <WithTrack>
                {() => (
                    <WithTranslation>
                        {(translate) => {
                            return <RuleContainer>{renderRules(translate)}</RuleContainer>;
                        }}
                    </WithTranslation>
                )}
            </WithTrack>
        </RulesQueryBuilderContainer>
    );

    function getTranslatedRuleTypes(ruleTypes: Array<{ id: number; text: string }>, translate) {
        return ruleTypes.map((ruleType) => ({
            ...ruleType,
            text: translate(ruleType.text),
        }));
    }

    function renderRules(translate): React.ReactElement {
        let rulesToRender = segmentRules ?? [];

        // if active rule is not last, but last rule is empty, then emit it from render
        if (
            activeIndex !== null &&
            activeIndex !== rulesToRender.length - 1 &&
            rulesToRender[rulesToRender.length - 1].words.length === 0 &&
            rulesToRender[rulesToRender.length - 1].exact.length === 0 &&
            rulesToRender[rulesToRender.length - 1].folders.length === 0
        ) {
            rulesToRender = rulesToRender.slice(0, rulesToRender.length - 1);
        }

        const ruleComponents = rulesToRender.map((rule, index) => {
            const isLastUserRule = index === rulesToRender.length - 2;
            const isLastRule = index === rulesToRender.length - 1;
            return (
                <div key={`${index}-rule-row`}>
                    {renderRule(rule, index, translate)}
                    {!isLastRule && renderSeparator(translate, isLastUserRule)}
                </div>
            );
        });

        return <>{ruleComponents}</>;
    }

    function renderRule(rule: IRule, index: number, translate): React.ReactElement {
        const isLoadingData = segmentsPreviewLoading || wordPredictionsLoading;
        const isCurrentlyEditedRule = index === activeIndex;
        const ruleMode = resolveRuleMode(rule, isCurrentlyEditedRule);
        const hasNoActiveIndex = activeIndex === null || activeIndex === undefined;
        const canEdit = hasNoActiveIndex || isCurrentlyEditedRule;
        const isMidTierUser = SegmentsUtils.isMidTierUser();

        switch (ruleMode) {
            case RuleModes.init:
                return (
                    <InitRuleMode
                        key={`init-rule-${index}`}
                        index={index}
                        ruleTypeOptions={getTranslatedRuleTypes(RuleTypesDropdown, translate)}
                        selectedRuleTypeIndex={rule.type}
                        onAddClick={onRuleAdd}
                        onRuleTypeSelectionChange={onRuleTypeChange.bind(this, index)}
                        isDisabled={isLoadingData || !canEdit}
                        wordPredictionsPreview={wordPredictionsPreview.data}
                        isMidTierUser={isMidTierUser}
                    />
                );

            case RuleModes.edit:
                return (
                    <EditRuleMode
                        index={index}
                        key={`edit-rule-${index}`}
                        rule={rule}
                        ruleTypeOptions={getTranslatedRuleTypes(RuleTypesDropdown, translate)}
                        selectedRuleTypeIndex={rule.type}
                        onRuleTypeSelectionChange={onRuleTypeChange.bind(this, index)}
                        searchInputPlaceholderText={translate(
                            "workspaces.segment.wizard.input_search.placeholder",
                        )}
                        onCloseButtonClick={onCloseRule.bind(this, index)}
                        onAddItems={onAddItems.bind(this, index)}
                        isLoadingData={wordPredictionsLoading}
                        shouldFetchWordsOnly={shouldFetchWordsOnly}
                        onWordsOnlyToggle={onWordsOnlyToggle}
                        onRemoveItems={onRemoveItems.bind(this, index)}
                        onUpdateItem={onUpdateItem.bind(this, index)}
                        selectedSite={selectedSite}
                        segmentRules={segmentRules}
                        getUrlsPreview={getSegmentUrls}
                        hasExistingUrlsCompundStringNoRobots={hasExistingUrlsCompundStringNoRobots}
                        hideUrlsPreview={hideUrlsPreview}
                        isMidTierUser={isMidTierUser}
                    />
                );

            case RuleModes.complete:
                return (
                    <CompleteRuleMode
                        index={index}
                        key={`complete-rule-${index}`}
                        rule={rule}
                        onAddClick={onEditCompletedRule.bind(this, index)}
                        canEdit={canEdit}
                        isLoadingData={isLoadingData}
                    />
                );
        }

        return <></>;
    }

    function renderSeparator(translate, shouldRenderSubtitle: boolean) {
        return (
            <RowSeparator>
                <RowSeparatorVerticalLine />
                <RowSeparatorTitleContainer>
                    <RowSeparatorTitle>
                        {translate("segmentsWizard.rulesDivider")}
                    </RowSeparatorTitle>
                    {shouldRenderSubtitle && (
                        <RowSeparatorSubtitle>{"(Optional)"}</RowSeparatorSubtitle>
                    )}
                </RowSeparatorTitleContainer>
                <RowSeparatorVerticalLine />
            </RowSeparator>
        );
    }
};

function mapStateToProps({
    segmentsWizardModule: {
        wordPredictionsLoading,
        segmentsPreviewLoading,
        segmentRules,
        folderPredictions,
    },
}) {
    return {
        wordPredictionsLoading,
        segmentsPreviewLoading,
        folderPredictions,
        segmentRules,
    };
}

RulesQueryBuilder.propTypes = {
    segmentRules: PropTypes.arrayOf(
        PropTypes.exact({
            type: PropTypes.oneOf([RuleTypes.include, RuleTypes.exclude]),
            words: PropTypes.arrayOf(PropTypes.string),
            exact: PropTypes.arrayOf(PropTypes.string),
            folders: PropTypes.arrayOf(PropTypes.string),
            exactURLS: PropTypes.arrayOf(PropTypes.string),
        }),
    ),
    wordPredictionsLoading: PropTypes.bool.isRequired,
    segmentsPreviewLoading: PropTypes.bool.isRequired,
    folderPredictions: PropTypes.any,
    updateSegmentRules: PropTypes.func,
    getSegmentUrls: PropTypes.func,
    hasExistingUrlsCompundStringNoRobots: PropTypes.func,
};

RulesQueryBuilder.defaultProps = {
    updateSegmentRules: noop,
};

export default connect(mapStateToProps)(RulesQueryBuilder);
