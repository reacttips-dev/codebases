import PropTypes from "prop-types";
import React from "react";
import XRegExp from "xregexp";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { i18nFilter } from "filters/ngFilters";
import { highlightUrl } from "services/segments/SegmentUrlHighlights";
import { ISegmentUrl, ISegmentUrlListProps, ISegmentUrlListState } from "./SegmentUrlListTypes";
import { SegmentUrlListElementContainer } from "./SegmentUrlListStyles";
import { SegmentUrlListFilter } from "./SegmentUrlListFilter";
import { SegmentUrlListItem } from "./SegmentUrlListItem";
import {
    escapeRegexString,
    keywordsDelimiterRegexPatternEnd,
    keywordsDelimiterRegexPatternStart,
} from "services/segments/segmentsProcessor/segmentsKeywordsVariables";

export default class SegmentUrlList extends React.PureComponent<
    ISegmentUrlListProps,
    ISegmentUrlListState
> {
    state = {
        filterTerm: null,
    };

    public render() {
        const {
            addedScrollAreaStyles,
            urlsWordPredictions,
            appendFilterTo,
            segmentRules,
            shouldShowFilter,
        } = this.props;

        return (
            <>
                {shouldShowFilter && (
                    <SegmentUrlListElementContainer hasBottomMargin={true}>
                        <SegmentUrlListFilter
                            filterTerms={urlsWordPredictions ?? []}
                            filterButtonText={i18nFilter()(
                                "workspaces.segment.wizard.url_list_filter_button",
                            )}
                            segmentRules={segmentRules}
                            onFilterTermSelect={this.handleFilterTermSelect}
                            appendTo={appendFilterTo}
                        />
                    </SegmentUrlListElementContainer>
                )}

                <ScrollArea
                    style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        ...addedScrollAreaStyles,
                        // marginBottom: "17px",
                        padding: "0 24px",
                        height: "100%",
                    }}
                    verticalScrollbarStyle={{ borderRadius: 5 }}
                >
                    {this.renderUrlListItems(100)}
                </ScrollArea>
            </>
        );
    }

    /**
     * Renders the list of Urls that should be displayed, after filtering
     * them according to the selected filterTerm, if such exists
     */
    private renderUrlListItems = (takeAmount: number = 100) => {
        const { filterTerm } = this.state;
        const { selectedSite, wordHightlights, exactPhraseHighlights } = this.props;

        const filteredUrls = this.getUrls(filterTerm);

        // Check if a filter term was selected in the URLs list search
        // in case such term was selected by the user - we should highlight the words
        // according to the search filter. otherwise - we want to highlight words according
        // to chosen word predictions.
        const wordsToHighlight = filterTerm ? [filterTerm] : wordHightlights;

        const exactToHighlight = filterTerm ? [] : exactPhraseHighlights;

        // gather distinct urls for the segment url list preview
        const filteredUrlsMap = new Map<string, { highlighted: any; urls: ISegmentUrl[] }>();
        for (let i = 0; i < filteredUrls.length && filteredUrlsMap.size < takeAmount; ++i) {
            const urlSegment = filteredUrls[i];
            const [urlShort, urlHighlights] = highlightUrl(
                urlSegment.url,
                selectedSite,
                wordsToHighlight,
                exactToHighlight,
            );
            if (!filteredUrlsMap.has(urlShort)) {
                filteredUrlsMap.set(urlShort, {
                    highlighted: urlHighlights,
                    urls: [],
                });
            }
            const urlGroup = filteredUrlsMap.get(urlShort);
            urlGroup.urls.push(urlSegment);
        }

        return Array.from(filteredUrlsMap.entries()).map(([urlShort, { highlighted, urls }]) => {
            return <SegmentUrlListItem key={urlShort} urlHighlighted={highlighted} />;
        });
    };

    private handleFilterTermSelect = (filterTerm: string) => {
        this.setState({ filterTerm });
    };

    /**
     * Returns the list of urls, and filters out any urls that do not contain
     * the provided filterTerm (if such was provided)
     */
    private getUrls = (filterByTerm?: string): ISegmentUrl[] => {
        const { urls } = this.props;

        if (!filterByTerm) {
            return urls;
        }
        const filterRegex = XRegExp(
            `(?:${keywordsDelimiterRegexPatternStart})(${escapeRegexString(
                filterByTerm,
            )})(?=${keywordsDelimiterRegexPatternEnd})`,
            "ui",
        );

        return urls.filter((url) => url.url.match(filterRegex));
    };

    public static propTypes = {
        selectedSite: PropTypes.string,
        urls: PropTypes.arrayOf(
            PropTypes.exact({
                url: PropTypes.string.isRequired,
                text: PropTypes.string,
                target: PropTypes.string,
                onClick: PropTypes.func,
                highlights: PropTypes.arrayOf(PropTypes.string),
            }),
        ).isRequired,
        urlsWordPredictions: PropTypes.arrayOf(PropTypes.string),
        segmentRules: PropTypes.any,
        appendFilterTo: PropTypes.string,
        shouldShowFilter: PropTypes.bool,
    };

    public static defaultProps = {
        shouldShowFilter: true,
        urlsWordPredictions: [],
        segmentRules: [],
    };
}
