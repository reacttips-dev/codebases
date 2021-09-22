import React from "react";
import {
    PageResultsContentWarning,
    PageResultsImage,
    PageResultsTitle,
    PageResultsWarningContainer,
    SegmentPageResultsContainer,
    SegmentPageResultsLoaderContainer,
    SegmentTipsIcon,
    SegmentTipsList,
} from "./SegmentResultsSectionStyles";
import { i18nFilter } from "filters/ngFilters";
import SegmentUrlList from "../SegmentUrlList/SegmentUrlList";
import {
    PageResultsTitleContainer,
    SegmentTipsUrl,
    SegmentTipsHighlight,
} from "pages/segments/wizard/SegmentRulesStep/SegmentResultsSection/SegmentResultsSectionStyles";
import { connect } from "react-redux";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SWReactIcons } from "@similarweb/icons";
import { ISegmentPageResultsProps } from "./SegmentResultsSectionTypes";
import { arrayOf, bool, exact, func, number, oneOf, shape, string } from "prop-types";
import { RuleTypes } from "components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import { ListContentLoader } from "@similarweb/ui-components/dist/content-loaders";
import { AssetsService } from "services/AssetsService";

const SegmentResultsSection: React.FunctionComponent<ISegmentPageResultsProps> = (props) => {
    const renderResultsUrlListTitle = () => {
        return (
            <PageResultsTitleContainer>
                <PageResultsTitle>
                    {i18nFilter()("workspaces.segment.wizard.url_list_title")}
                </PageResultsTitle>
                <PlainTooltip
                    tooltipContent={i18nFilter()("workspaces.segment.wizard.url_list_tooltip")}
                >
                    <div>
                        <SWReactIcons size="xs" iconName="info" />
                    </div>
                </PlainTooltip>
            </PageResultsTitleContainer>
        );
    };

    const renderLoader = () => {
        return (
            <>
                {renderResultsUrlListTitle()}
                <SegmentPageResultsLoaderContainer>
                    <ListContentLoader
                        loaderTitle={i18nFilter()(
                            "workspaces.segment.wizard.url_list_loader_title",
                        )}
                        loaderSubtitle={i18nFilter()(
                            "workspaces.segment.wizard.url_list_loader_subtitle",
                        )}
                    />
                </SegmentPageResultsLoaderContainer>
            </>
        );
    };

    const renderTipsTitle = () => {
        return (
            <PageResultsTitleContainer>
                <SegmentTipsIcon />
                <PageResultsTitle>Segment Creation Tips</PageResultsTitle>
            </PageResultsTitleContainer>
        );
    };

    const renderCreationTips = () => {
        const { selectedSite } = props;
        const siteName = selectedSite?.name ?? "";
        const siteUrl = selectedSite?.name ? `https://www.${selectedSite.name}` : "";

        return (
            <>
                {renderTipsTitle()}
                <SegmentTipsList>
                    <li>
                        {i18nFilter()("workspaces.segment.wizard.tips_first_tip_part_one")}
                        <SegmentTipsUrl url={siteUrl}>{` ${siteName} `}</SegmentTipsUrl>
                        {i18nFilter()("workspaces.segment.wizard.tips_first_tip_part_two")}
                    </li>

                    <li>{i18nFilter()("workspaces.segment.wizard.tips_second_tip")}</li>

                    <li>
                        {i18nFilter()("workspaces.segment.wizard.tips_third_tip_part_one")}
                        <br />

                        {i18nFilter()(
                            "workspaces.segment.wizard.tips_third_tip_example_url_prefix_one",
                        )}
                        <SegmentTipsHighlight>
                            {i18nFilter()(
                                "workspaces.segment.wizard.tips_third_tip_highlight_word",
                            )}
                        </SegmentTipsHighlight>
                        {i18nFilter()(
                            "workspaces.segment.wizard.tips_third_tip_example_url_suffix_one",
                        )}
                        <br />

                        {i18nFilter()(
                            "workspaces.segment.wizard.tips_third_tip_example_url_prefix_two",
                        )}
                        <SegmentTipsHighlight>
                            {i18nFilter()(
                                "workspaces.segment.wizard.tips_third_tip_highlight_word",
                            )}
                        </SegmentTipsHighlight>
                        {i18nFilter()(
                            "workspaces.segment.wizard.tips_third_tip_example_url_suffix_two",
                        )}
                        <br />

                        {i18nFilter()("workspaces.segment.wizard.tips_third_tip_part_two")}
                        <SegmentTipsHighlight>
                            {' "' +
                                i18nFilter()(
                                    "workspaces.segment.wizard.tips_third_tip_highlight_word",
                                ) +
                                '"'}
                        </SegmentTipsHighlight>
                    </li>
                </SegmentTipsList>
            </>
        );
    };

    const renderHideUrlsPreview = () => {
        return (
            <PageResultsWarningContainer>
                <PageResultsImage
                    width="160px"
                    height="100px"
                    imageUrl={AssetsService.assetUrl(
                        "/images/segments/segments-hide-urls-preview.svg",
                    )}
                />
                <PageResultsContentWarning>
                    <span>
                        {i18nFilter()("workspaces.segment.wizard.site_restricted_warning1")}
                    </span>
                    <span>
                        {i18nFilter()("workspaces.segment.wizard.site_restricted_warning2")}
                    </span>
                </PageResultsContentWarning>
            </PageResultsWarningContainer>
        );
    };

    const renderResultsUrlList = () => {
        const {
            selectedSite,
            segmentUrls,
            segmentRules,
            segmentUrlsWordPredictions,
            rulesHighlightWords,
            rulesExactMatchHighlights,
            hideUrlsPreview,
        } = props;

        return hideUrlsPreview ? (
            renderHideUrlsPreview()
        ) : (
            <>
                {renderResultsUrlListTitle()}
                <SegmentUrlList
                    selectedSite={selectedSite.name}
                    urls={segmentUrls}
                    urlsWordPredictions={segmentUrlsWordPredictions}
                    wordHightlights={rulesHighlightWords}
                    exactPhraseHighlights={rulesExactMatchHighlights}
                    segmentRules={segmentRules}
                    addedScrollAreaStyles={{ zIndex: 99, marginBottom: "17px" }}
                    shouldShowFilter={true}
                    appendFilterTo={".page-results-container"}
                />
            </>
        );
    };

    const renderComponentContent = () => {
        const { segmentsPreviewLoading, showWizardTips } = props;
        if (showWizardTips) {
            return renderCreationTips();
        }

        // In case the wizard is loading data from redux store, we should show
        // a loading spinner.
        return segmentsPreviewLoading ? renderLoader() : renderResultsUrlList();
    };

    return (
        <SegmentPageResultsContainer className={"page-results-container"}>
            {renderComponentContent()}
        </SegmentPageResultsContainer>
    );
};

function mapStateToProps({
    segmentsWizardModule: {
        wordPredictionsLoading,
        showWizardTips,
        wordPredictions,
        segmentRules,
        segmentsPreviewLoading,
    },
}) {
    return {
        wordPredictionsLoading,
        wordPredictions,
        segmentRules,
        segmentsPreviewLoading,
        showWizardTips,
    };
}

SegmentResultsSection.propTypes = {
    segmentUrls: arrayOf(
        exact({
            url: string.isRequired,
            text: string,
            target: string,
            onClick: func,
        }),
    ),
    rulesHighlightWords: arrayOf(string),
    rulesExactMatchHighlights: arrayOf(string),
    wordPredictionsLoading: bool,
    wordPredictions: exact({
        Data: arrayOf(string),
        TotalCount: number.isRequired,
        Header: exact({
            MainSite: string.isRequired,
        }),
    }),
    segmentRules: arrayOf(
        exact({
            type: oneOf([RuleTypes.include, RuleTypes.exclude]),
            words: arrayOf(string),
            exact: arrayOf(string),
            folders: arrayOf(string),
            exactURLS: arrayOf(string), //Folder as page.
        }),
    ),
    showWizardTips: bool,
    segmentsPreviewLoading: bool,
    hideUrlsPreview: bool,
};

const ConnectedSegmentResultsSection = connect(mapStateToProps)(SegmentResultsSection);
export default ConnectedSegmentResultsSection;
