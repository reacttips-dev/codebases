import React, { ReactElement } from "react";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import {
    Footer,
    Row,
    SerpFeatureItemContentWrapper,
    Title,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/serp-features/StyledComponents";
import I18n from "components/WithTranslation/src/I18n";
import { SWReactIcons } from "@similarweb/icons";
import { i18nFilter } from "filters/ngFilters";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import { Box, SerpCount, SerpName } from "pages/keyword-analysis/serp-snapshot/StyledComponents";

const i18n = i18nFilter();

const MAX_VISIBLE_ITEMS = 5;

interface ISerpFeatureKeywordProps {
    name: string;
    iconName: string;
}

interface ISerpFeatureKeywordItemProps extends ISerpFeatureKeywordProps {
    linkedDomainsToRender?: ReactElement[];
    linkedDomainsLength?: number;
}

interface ISerpFeatureKeywordListItemProps extends ISerpFeatureKeywordProps {
    topLinkedKeywords: string[];
    linkedKeywordsLength: number;
}

const SerpFeatureTooltipContent: React.FC<any> = ({ tooltipProps }) => {
    const replacementObject = {
        featureName: `<strong>${tooltipProps.feature}</strong>`,
    };
    return (
        <FlexColumn className="serp-feature-item--tooltip-content">
            <Title>
                <I18n dangerouslySetInnerHTML={true} dataObj={replacementObject}>
                    {tooltipProps.headerTextString}
                </I18n>
            </Title>
            {tooltipProps.rowItems.map((rowItem) => (
                <Row key={rowItem}>{rowItem}</Row>
            ))}
            {tooltipProps.footerText && <Footer>{tooltipProps.footerText}</Footer>}
        </FlexColumn>
    );
};

const SerpFeatureItem: React.FC<any> = ({ title, subtitle, iconName, tooltipProps }) => {
    const wrapperClassName = `serp-feature-item--${title.replace(/\s/g, "")}`;
    const popupConfig = {
        enabled: tooltipProps.isEnabled,
        width: 279,
        minHeight: tooltipProps.minHeight,
        placement: "right",
        appendTo: `.${wrapperClassName}`,
    };

    return (
        <SerpFeatureItemContentWrapper className={wrapperClassName} alignItems={"center"}>
            <PopupHoverContainer
                config={popupConfig}
                appendTo={`.${wrapperClassName}`}
                content={() => <SerpFeatureTooltipContent tooltipProps={tooltipProps} />}
            >
                <Box>
                    <SWReactIcons iconName={iconName} size={"xs"} />
                    <div style={{ paddingLeft: "24px" }}>
                        <SerpName>{title}</SerpName>
                        <SerpCount>{subtitle}</SerpCount>
                    </div>
                </Box>
            </PopupHoverContainer>
        </SerpFeatureItemContentWrapper>
    );
};

export const SerpFeaturesKeywordItem: React.FC<ISerpFeatureKeywordItemProps> = ({
    name,
    iconName,
    linkedDomainsToRender = [],
    linkedDomainsLength = 0,
}) => {
    let subtitle = undefined;
    const hasLinkedDomains = linkedDomainsLength > 0;
    const tooltipShouldUseSingularLanguage = linkedDomainsLength === MAX_VISIBLE_ITEMS + 1;
    if (hasLinkedDomains) {
        const subtitleShouldUseSingularLanguage = linkedDomainsLength === 1;
        const subtitleTextKey = subtitleShouldUseSingularLanguage
            ? "keyword.analysis.widgets.serp.features.feature.keyword.subtitle.text.singular"
            : "keyword.analysis.widgets.serp.features.feature.keyword.subtitle.text.plural";
        subtitle = i18n(subtitleTextKey, { linkedDomainsCount: linkedDomainsLength });
    }
    const tooltipProps = {
        feature: name,
        rowItems: linkedDomainsToRender,
        headerTextString: "keyword.analysis.widgets.serp.features.feature.keyword.tooltip.header",
        footerText:
            linkedDomainsLength <= MAX_VISIBLE_ITEMS
                ? undefined
                : tooltipShouldUseSingularLanguage
                ? i18n(
                      "keyword.analysis.widgets.serp.features.feature.keyword.tooltip.footer.text.singular",
                  )
                : i18n(
                      "keyword.analysis.widgets.serp.features.feature.keyword.tooltip.footer.text.plural",
                      { otherDomainsCount: linkedDomainsLength - MAX_VISIBLE_ITEMS },
                  ),
        isEnabled: hasLinkedDomains,
    };
    return (
        <SerpFeatureItem
            title={name}
            subtitle={subtitle}
            iconName={iconName}
            tooltipProps={tooltipProps}
        />
    );
};

export const SerpFeaturesKeywordListItem: React.FC<ISerpFeatureKeywordListItemProps> = ({
    name,
    iconName,
    topLinkedKeywords,
    linkedKeywordsLength,
}) => {
    const shouldUseSingularLanguage = linkedKeywordsLength === 1;
    const tooltipShouldUseSingularLanguage = linkedKeywordsLength === MAX_VISIBLE_ITEMS + 1;
    const hasLinkedKeywords = linkedKeywordsLength > 0;
    const subtitleTextKey = shouldUseSingularLanguage
        ? "keyword.analysis.widgets.serp.features.feature.keywordList.subtitle.text.singular"
        : "keyword.analysis.widgets.serp.features.feature.keywordList.subtitle.text.plural";
    const tooltipProps = {
        feature: name,
        rowItems: topLinkedKeywords,
        headerTextString:
            "keyword.analysis.widgets.serp.features.feature.keywordList.tooltip.header",
        footerText:
            linkedKeywordsLength <= MAX_VISIBLE_ITEMS
                ? undefined
                : tooltipShouldUseSingularLanguage
                ? i18n(
                      "keyword.analysis.widgets.serp.features.feature.keywordList.tooltip.footer.text.singular",
                  )
                : i18n(
                      "keyword.analysis.widgets.serp.features.feature.keywordList.tooltip.footer.text.plural",
                      { otherKeywordsCount: linkedKeywordsLength - MAX_VISIBLE_ITEMS },
                  ),
        isEnabled: hasLinkedKeywords,
    };
    return (
        <SerpFeatureItem
            title={name}
            subtitle={i18n(subtitleTextKey, { linkedKeywordsLength })}
            iconName={iconName}
            tooltipProps={tooltipProps}
        />
    );
};
