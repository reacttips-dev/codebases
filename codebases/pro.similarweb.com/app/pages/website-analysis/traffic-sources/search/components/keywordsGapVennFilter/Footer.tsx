import { SWReactIcons } from "@similarweb/icons";
import I18n from "components/WithTranslation/src/I18n";
import { abbrNumberFilter, i18nFilter } from "filters/ngFilters";
import { filtersConfig } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/constants";
import {
    Circle,
    FiltersFooterContainer,
    FiltersFooterSubtitle,
    FiltersFooterTitle,
} from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/StyledComponents";
import {
    calculateVisitsAmount,
    setsAreEqual,
} from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/utilityFunctions";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { EFiltersTypes } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";

const footerTooltipTextKey = "website.keywords.table.gap.venn.footer.tooltip";

const Site = ({ siteName, siteColor }) => (
    <>
        <Circle color={siteColor} />
        <span>{siteName}</span>
    </>
);

const FiltersFooterInner = ({ titleKey, subtitle, i18nReplacementObject = undefined }) => {
    return (
        <FiltersFooterContainer>
            <FiltersFooterTitle>
                <I18n dangerouslySetInnerHTML={true} dataObj={i18nReplacementObject}>
                    {titleKey}
                </I18n>
            </FiltersFooterTitle>
            <FiltersFooterSubtitle>{subtitle}</FiltersFooterSubtitle>
            <PlainTooltip tooltipContent={i18nFilter()(footerTooltipTextKey)}>
                <div className={"venn-footer--SWReactIconsWrapper"}>
                    <SWReactIcons iconName={"info"} size={"xs"} />
                </div>
            </PlainTooltip>
        </FiltersFooterContainer>
    );
};

export const FiltersFooter = (props) => {
    const {
        selectedIntersectionSets,
        selectedFilter,
        chosenItems,
        vennData,
        filterEnrichedData,
    } = props;
    const { footerKeys } = filtersConfig;
    const { name: chosenSite } = chosenItems[0];
    const chosenItemsColors = chosenItems.reduce(
        (tempObject, { name, color }) => ({ [name]: color, ...tempObject }),
        {},
    );
    const i18nReplacementObject = {
        website: ReactDOMServer.renderToString(
            <Site siteColor={chosenItemsColors[chosenSite]} siteName={chosenSite} />,
        ),
    };
    if (selectedIntersectionSets) {
        const selectedIntersectionSetsData = Object.entries(vennData).find((entry) =>
            setsAreEqual(entry[0], selectedIntersectionSets),
        );
        const { Value: trafficShareValue = undefined } = (selectedIntersectionSetsData
            ? selectedIntersectionSetsData[1]
            : {}) as { Value: number };
        const subtitle = i18nFilter()(footerKeys.SUBTITLE, {
            visitsAmount: abbrNumberFilter()(trafficShareValue),
        });
        const SITE_SEPARATOR = ",";
        const selectedIntersectionSetsArray = selectedIntersectionSets.split(SITE_SEPARATOR);
        const i18nReplacementObject = selectedIntersectionSetsArray.reduce(
            (tempObject, siteName, index) => {
                return {
                    [`website${index}`]: ReactDOMServer.renderToString(
                        <Site
                            siteColor={chosenItemsColors[selectedIntersectionSetsArray[index]]}
                            siteName={selectedIntersectionSetsArray[index]}
                        />,
                    ),
                    ...tempObject,
                };
            },
            {},
        );
        if (selectedIntersectionSetsArray.length === chosenItems.length) {
            return (
                <FiltersFooterInner
                    titleKey={footerKeys[EFiltersTypes.CORE_KEYWORDS]}
                    subtitle={subtitle}
                />
            );
        }
        return (
            <FiltersFooterInner
                i18nReplacementObject={i18nReplacementObject}
                titleKey={
                    footerKeys[`INTERSECTION_WITH_${selectedIntersectionSetsArray.length}_SITES`]
                }
                subtitle={subtitle}
            />
        );
    }
    const visitsAmount = calculateVisitsAmount(
        selectedFilter,
        vennData,
        chosenItems,
        filterEnrichedData,
    );
    const replacementObject = { visitsAmount: abbrNumberFilter()(visitsAmount) };
    const subtitle = i18nFilter()(footerKeys.SUBTITLE, replacementObject);
    return (
        <FiltersFooterInner
            titleKey={footerKeys[selectedFilter]}
            subtitle={subtitle}
            i18nReplacementObject={i18nReplacementObject}
        />
    );
};
