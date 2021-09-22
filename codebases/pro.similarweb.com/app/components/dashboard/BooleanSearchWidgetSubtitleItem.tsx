import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, mixins } from "@similarweb/styles";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import styled from "styled-components";

const BooleanSearchWidgetSubtitleItemWrapper = styled.li`
    display: flex;
    align-items: center;
    padding: 0 8px;
    border-left: solid 1px ${colorsPalettes.carbon["50"]};
    ${mixins.setFont({ $size: 12 })};
    overflow: hidden;
    .SWReactIcons {
        flex: 0 0 16px;
    }
`;
const BooleanSearchWidgetSubtitleItemText = styled.span`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
const i18n = i18nFilter();
const wrapInQuotation = (terms) =>
    terms &&
    terms
        .split(",")
        .map((x) => `"${x}"`)
        .join(", ");
const getOutput = (label, value) => (value ? `${label}: ${value}` : "");
const BooleanSearchWidgetSubtitleItem = ({
    ExcludeTerms,
    IncludeTerms,
    ExcludeUrls,
    IncludeUrls,
}) => {
    const excludeTerms = wrapInQuotation(ExcludeTerms);
    const includeTerms = wrapInQuotation(IncludeTerms);
    const excludeUrls = wrapInQuotation(ExcludeUrls);
    const includeUrls = wrapInQuotation(IncludeUrls);
    const excludeTermsOutput = getOutput(
        i18n(`dashboard.widget.subtitle.boolean-search.exclude.keyword`),
        excludeTerms,
    );
    const includeTermsOutput = getOutput(
        i18n(`dashboard.widget.subtitle.boolean-search.include.keyword`),
        includeTerms,
    );
    const excludeUrlsOutput = getOutput(
        i18n(`dashboard.widget.subtitle.boolean-search.exclude.url`),
        excludeUrls,
    );
    const includeUrlsOutput = getOutput(
        i18n(`dashboard.widget.subtitle.boolean-search.include.url`),
        includeUrls,
    );
    const TermsOutput =
        excludeTermsOutput && includeTermsOutput
            ? `${excludeTermsOutput}. ${includeTermsOutput}`
            : `${excludeTermsOutput} ${includeTermsOutput}`;
    const UrlsOutput =
        excludeUrlsOutput && includeUrlsOutput
            ? `${excludeUrlsOutput}. ${includeUrlsOutput}`
            : `${excludeUrlsOutput} ${includeUrlsOutput}`;
    const content =
        TermsOutput && UrlsOutput
            ? `${TermsOutput}. ${UrlsOutput}`
            : `${TermsOutput} ${UrlsOutput}`;

    return (
        <BooleanSearchWidgetSubtitleItemWrapper>
            <SWReactIcons iconName="search" size="xs" />
            <PopupHoverContainer
                content={() => <span>{content}</span>}
                config={{ placement: "top" }}
            >
                <BooleanSearchWidgetSubtitleItemText>{content}</BooleanSearchWidgetSubtitleItemText>
            </PopupHoverContainer>
        </BooleanSearchWidgetSubtitleItemWrapper>
    );
};
export default SWReactRootComponent(
    BooleanSearchWidgetSubtitleItem,
    "BooleanSearchWidgetSubtitleItem",
);
