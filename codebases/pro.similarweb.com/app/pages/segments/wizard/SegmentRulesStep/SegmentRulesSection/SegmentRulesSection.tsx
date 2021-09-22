import React from "react";
import { i18nFilter } from "filters/ngFilters";
import RulesQueryBuilder from "components/RulesQueryBuilder/src/RulesQueryBuilder";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { connect } from "react-redux";
import { ISegmentRulesSectionProps, ISegmentRulesSectionState } from "./SegmentRulesSectionTypes";
import {
    InternalTitleWrapper,
    LoaderContainer,
    SegmentRulesScrollAreaContainer,
    SegmentRulesSectionContainer,
    TitleContainer,
} from "pages/segments/wizard/SegmentRulesStep/SegmentRulesSection/SegmentRulesSectionStyles";
import { ListContentLoader } from "@similarweb/ui-components/dist/content-loaders";

class SegmentRulesSection extends React.Component<
    ISegmentRulesSectionProps,
    ISegmentRulesSectionState
> {
    /**
     * Holds a reference the rules scroll area. this is used to force
     * scroll to bottom when performing certain actions on the rules query builder.
     */
    private scrollAreaElement = React.createRef<ScrollArea>();

    constructor(props: ISegmentRulesSectionProps) {
        super(props);

        this.state = {
            windowWidth: window.innerWidth,
        };
    }

    public async componentDidMount() {
        // Add a resize listener. this is used to measure screen size and
        // optionaly render the layout differently (side-by-side mode or top-under)
        // we need to change the components we render, since the rules builder need to be
        // wrapped in a scroll area when in side-by-side mode.
        window.addEventListener("resize", this.updateWindowWidth, { capture: true });
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowWidth, { capture: true });
    }

    public render() {
        const { segmentsReady } = this.props;

        const contentComponent = !segmentsReady
            ? this.renderDataLoader()
            : this.renderRulesQueryBuilderContent();

        return <SegmentRulesSectionContainer>{contentComponent}</SegmentRulesSectionContainer>;
    }

    private updateWindowWidth = () => {
        this.setState({ windowWidth: window.innerWidth });
    };

    private renderTitle = () => {
        const { selectedSite, segmentName } = this.props;
        return (
            <TitleContainer>
                <InternalTitleWrapper>
                    <b>{`\"${segmentName}\" `}</b>
                    {i18nFilter()("workspaces.segment.wizard.segment_rules_title_includes_url")}
                    <a
                        href={`https://www.${selectedSite?.name ?? ""}`}
                        target={"_blank"}
                        rel="noreferrer"
                    >
                        {` ${selectedSite?.name ?? ""} `}
                    </a>
                    {i18nFilter()("workspaces.segment.wizard.segment_rules_title_that")}
                </InternalTitleWrapper>
            </TitleContainer>
        );
    };

    private renderRulesQueryBuilder = () => {
        const { windowWidth } = this.state;

        const {
            selectedSite,
            updateSegmentRules,
            updateShowWizardTips,
            getSegmentUrls,
            updateSegmentUrlsData,
            updateWordPredictions,
            getWordPredictions,
            hideUrlsPreview,
            hasExistingUrlsCompundStringNoRobots,
        } = this.props;

        const queryBuilderContent = (
            <RulesQueryBuilder
                selectedSite={selectedSite}
                updateSegmentRules={updateSegmentRules}
                updateShowWizardTips={updateShowWizardTips}
                updateSegmentUrlsData={updateSegmentUrlsData}
                getSegmentUrls={getSegmentUrls}
                updateWordPredictions={updateWordPredictions}
                getWordPredictions={getWordPredictions}
                hideUrlsPreview={hideUrlsPreview}
                hasExistingUrlsCompundStringNoRobots={hasExistingUrlsCompundStringNoRobots}
            />
        );

        // We want to render the query builder inside a scrollable box
        // only in cases where the screen is wide enough to display
        // the page results and the query rules side-by-side.
        // otherwise - we want to render the rules as they are, not
        // within a constrained scroll area
        const shouldRenderScrollable = windowWidth > 1440;
        return shouldRenderScrollable ? (
            <SegmentRulesScrollAreaContainer>
                <ScrollArea
                    ref={this.scrollAreaElement}
                    verticalScrollbarStyle={{ borderRadius: 5 }}
                >
                    {queryBuilderContent}
                </ScrollArea>
            </SegmentRulesScrollAreaContainer>
        ) : (
            queryBuilderContent
        );
    };

    private renderRulesQueryBuilderContent = () => {
        return (
            <>
                {this.renderTitle()}
                {this.renderRulesQueryBuilder()}
            </>
        );
    };

    private renderDataLoader = () => {
        const { selectedSite } = this.props;
        return (
            <LoaderContainer>
                <ListContentLoader
                    loaderTitle={i18nFilter()(
                        "workspaces.segment.wizard.segment_rules_loader_title",
                        { website: selectedSite?.name ?? "" },
                    )}
                    loaderSubtitle={i18nFilter()(
                        "workspaces.segment.wizard.segment_rules_loader_subtitle",
                    )}
                />
            </LoaderContainer>
        );
    };
}

function mapStateToProps({
    segmentsWizardModule: { segmentRules, segmentsReady, showWizardTips },
}) {
    return {
        segmentRules,
        segmentsReady,
        showWizardTips,
    };
}

export default connect(mapStateToProps)(SegmentRulesSection);
