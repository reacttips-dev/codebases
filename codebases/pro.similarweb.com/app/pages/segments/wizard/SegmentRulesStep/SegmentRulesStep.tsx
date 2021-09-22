import React from "react";

import _ from "lodash";
import autobind from "autobind-decorator";
import PropTypes, { bool, arrayOf, oneOf, shape } from "prop-types";
import { IRule } from "../../../../../.pro-features/components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import { contextTypes } from "../../../../../.pro-features/components/Workspace/Wizard/src/WithContext";
import {
    SegmentRulesStepColumnContainer,
    SegmentRulesStepContainer,
    SegmentRulesStepTopContainer,
} from "./SegmentRulesStepStyles";
import { ISegmentRulesStepProps, ISegmentRulesStepState } from "./SegmentRulesStepTypes";
import { func, string, exact } from "prop-types";
import { connect } from "react-redux";
import { RuleTypes } from "components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import { ISegmentUrl } from "./SegmentUrlList/SegmentUrlListTypes";
import SegmentResultsSection from "./SegmentResultsSection/SegmentResultsSection";
import SegmentRulesSection from "./SegmentRulesSection/SegmentRulesSection";
import SegmentsVerifySection from "./SegmentsVerifySection/SegmentsVerifySection";
import rulesQueryHandler from "components/RulesQueryBuilder/src/handlers/rulesQueryHandler";

class SegmentRulesStep extends React.Component<ISegmentRulesStepProps, ISegmentRulesStepState> {
    public static contextTypes = {
        ...contextTypes,
        goToStep: PropTypes.func.isRequired,
    };

    public static propTypes = {
        getSegmentsPreview: func.isRequired,
        updateWordPredictions: func.isRequired,
        getWordPredictions: func.isRequired,
        getFolderPredictions: func.isRequired,
        onCreateOrUpdateCustomSegments: func.isRequired,
        onSegmentRulesUpdate: func.isRequired,
        onSetShowWizardTips: func.isRequired,
        segmentName: string.isRequired,
        selectedSite: shape({
            name: string,
            image: string,
        }),
        showWizardTips: bool.isRequired,
        rulesHighlightWords: arrayOf(string),
        rulesExactMatchHighlights: arrayOf(string),
        segmentRules: arrayOf(
            exact({
                type: oneOf([RuleTypes.include, RuleTypes.exclude]),
                words: arrayOf(string),
                exact: arrayOf(string),
                folders: arrayOf(string),
                exactURLS: arrayOf(string), //Folder as page.
            }),
        ),
        hideUrlsPreview: bool.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            segmentUrls: [],
            segmentUrlsWordPredictions: null,
        };
    }

    public async componentDidMount() {
        // Initialize word predictions and segment urls data in case these were not yet populated.
        const { segmentsReady } = this.props;
        const { segmentUrls } = this.state;
        if (segmentsReady && segmentUrls.length <= 0) {
            await this.updateSegmentUrlsData();
        }
    }

    public async componentDidUpdate(prevProps) {
        if (
            this.props.segmentsReady &&
            (this.props.segmentsReady !== prevProps.segmentsReady ||
                !_.isEqual(this.props.segmentRules, prevProps.segmentRules))
        ) {
            await this.updateSegmentUrlsData();
        }
    }

    public render() {
        const {
            selectedSite,
            rulesHighlightWords,
            rulesExactMatchHighlights,
            getWordPredictions,
            getFolderPredictions,
            onSetShowWizardTips,
            segmentName,
            hideUrlsPreview,
            hasExistingUrlsCompundStringNoRobots,
        } = this.props;

        const { segmentUrls, segmentUrlsWordPredictions } = this.state;

        return (
            <SegmentRulesStepContainer>
                <SegmentRulesStepTopContainer>
                    <SegmentRulesSection
                        segmentName={segmentName}
                        selectedSite={selectedSite}
                        getWordPredictions={getWordPredictions}
                        getFolderPredictions={getFolderPredictions}
                        updateShowWizardTips={onSetShowWizardTips}
                        updateSegmentRules={this.handleRulesUpdate}
                        getSegmentUrls={this.getSegmentUrls}
                        updateSegmentUrlsData={this.updateSegmentUrlsData}
                        updateWordPredictions={this.updateRulesWordPredictions}
                        hideUrlsPreview={hideUrlsPreview}
                        hasExistingUrlsCompundStringNoRobots={hasExistingUrlsCompundStringNoRobots}
                    />
                    <SegmentRulesStepColumnContainer>
                        <SegmentsVerifySection
                            domain={selectedSite.name}
                            onCreateOrUpdateCustomSegments={this.createCustomSegment}
                        />
                        <SegmentResultsSection
                            selectedSite={selectedSite}
                            segmentUrls={segmentUrls}
                            rulesHighlightWords={rulesHighlightWords}
                            rulesExactMatchHighlights={rulesExactMatchHighlights}
                            segmentUrlsWordPredictions={segmentUrlsWordPredictions}
                            hideUrlsPreview={hideUrlsPreview}
                        />
                    </SegmentRulesStepColumnContainer>
                </SegmentRulesStepTopContainer>
            </SegmentRulesStepContainer>
        );
    }

    @autobind
    public createCustomSegment() {
        this.props.onCreateOrUpdateCustomSegments(this.props.segmentRules);
    }

    private handleRulesUpdate = (rules: IRule[]) => {
        const { onSegmentRulesUpdate } = this.props;

        if (onSegmentRulesUpdate) {
            onSegmentRulesUpdate(rules);
        }
    };

    @autobind
    private async updateSegmentUrlsData(): Promise<void> {
        await Promise.all([this.updateSegmentUrls(), this.updateSegmentUrlsWordPredictions()]);
    }

    @autobind
    private async updateSegmentUrls(): Promise<void> {
        const { segmentRules } = this.props;
        const updatedUrls = await this.getSegmentUrls(segmentRules);
        this.setState({ segmentUrls: updatedUrls });
    }

    @autobind
    private async getSegmentUrls(segmentRules: IRule[]): Promise<ISegmentUrl[]> {
        const rulesWithContent = rulesQueryHandler.filterEmptyRules(segmentRules ?? []);
        return await this.fetchAndTransformSegmentPreview(rulesWithContent);
    }

    @autobind
    private async fetchAndTransformSegmentPreview(rules: IRule[]) {
        const results = await this.props.getSegmentsPreview(rules ?? []);
        return this.transformSegmentPreview(results.Data);
    }

    private transformSegmentPreview(data): ISegmentUrl[] {
        return data.map((item) => {
            return {
                url: `https://${item.Page.URL}`,
                text: item.Page.URL,
                target: "_blank",
            };
        });
    }

    @autobind
    private async updateRulesWordPredictions(
        shouldFetchWordsOnly: boolean = false,
        ruleIndex?: number,
    ): Promise<void> {
        const { segmentRules, updateWordPredictions } = this.props;

        await updateWordPredictions(segmentRules ?? [], shouldFetchWordsOnly, undefined, ruleIndex);
    }

    @autobind
    private async updateSegmentUrlsWordPredictions() {
        const { getWordPredictions, segmentRules } = this.props;

        // Fetch all word predictions for the given segment rules
        const wordPredictionsData = await getWordPredictions(segmentRules ?? [], false);
        const wordPredictions = wordPredictionsData.Data ?? [];

        // Add all user selected words from any "include" rule.
        // unlike regular word predictions, we want them here since
        // we want to show the user selected words in the urls list filter
        const userSelectedWords = segmentRules
            ?.filter((x) => x.type === RuleTypes.include)
            .map((x) => x.words)
            .flat();

        const urlsWordPredictions = [...userSelectedWords, ...wordPredictions];

        this.setState({ segmentUrlsWordPredictions: urlsWordPredictions });
    }
}

function mapStateToProps({
    segmentsWizardModule: { segmentsReady, showWizardTips, segmentRules },
}) {
    return {
        segmentsReady,
        segmentRules,
        showWizardTips,
    };
}

export default connect(mapStateToProps)(SegmentRulesStep);
