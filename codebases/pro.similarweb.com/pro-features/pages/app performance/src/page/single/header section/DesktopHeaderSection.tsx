import React from "react";
import { ItemIcon } from "@similarweb/ui-components/dist/item-icon";
import { PartialText } from "@similarweb/ui-components/dist/partial-text";
import * as _ from "lodash";
import dayjs from "dayjs";
import * as numeral from "numeral";
import BoxSubtitle from "../../../../../../components/BoxSubtitle/src/BoxSubtitle";
import { FlexRow } from "../../../../../../styled components/StyledFlex/src/StyledFlex";
import WithAllContexts from "../../../common components/WithAllContexts";
import { Type } from "../../StyledComponents";
import { getRating } from "./HeaderSection";
import Metric from "./Metric";
import RelatedWebsites from "./RelatedWebsites";
import Screenshots from "./Screenshots";
import {
    AppDescription,
    AppScreenshots,
    AppTitle,
    Desc,
    HeaderContainer,
    Metrices,
    StyledSubtitle,
    TitleLink,
} from "./StyledComponents";
import { isSalesIntelligenceAppsState } from "pages/sales-intelligence/helpers/helpers";

type DesktopHeaderSection = {
    websiteTooltipComponent: React.ComponentType;
    data: any;
};

const DesktopHeaderSection: React.FC<DesktopHeaderSection> = ({
    data,
    websiteTooltipComponent,
}) => (
    <WithAllContexts>
        {({ translate, track, getLink, filters, swNavigator }) => {
            const { author, price, downloads, rating, lastVersionDate, screenshots } = data;
            const description = JSON.stringify(data.description || "")
                .replace(/\\n/g, "<br/>")
                .replace(/\"/g, "");
            const storeLink =
                filters.store === "Google"
                    ? "https://play.google.com/store/apps/details?id=" + filters.appsInfo[0].id
                    : "https://itunes.apple.com/app/id" + filters.appsInfo[0].id;
            const logoClick = () => track("External link", "click", `${filters.store}/logo`);
            const titleClick = () => track("External link", "click", `${filters.store}/name`);
            const toggleText = (isCollapsed) =>
                track("Expand Collapse", isCollapsed ? "Collapse" : "Expand", "app description");
            const category = _.get(filters, "appsInfo.0.category", "")?.replace("/", ">");

            const state = isSalesIntelligenceAppsState(swNavigator)
                ? "salesIntelligence-appcategory-leaderboard"
                : "appcategory-leaderboard";

            const subtitleFilters = [
                {
                    filter: "text",
                    value: author,
                },
                {
                    filter: "store",
                    value: filters.store,
                },
                {
                    filter: "text",
                    value: category,
                    href: getLink(state, {
                        category,
                        country: filters.country,
                        store: _.capitalize(filters.store),
                        device:
                            filters.store.toLowerCase() === "google" ? "AndroidPhone" : "iPhone",
                        mode: "Top Free",
                    }),
                    onClick: () =>
                        track(
                            "internal link",
                            "click",
                            `Header/app category analysis/${filters.appsInfo[0].category}`,
                        ),
                },
                {
                    filter: "text",
                    value: price,
                },
            ];

            return (
                <HeaderContainer>
                    <FlexRow>
                        <AppDescription untrackText={translate("app.performance.header.untrack")}>
                            <FlexRow>
                                <TitleLink href={storeLink} target="_blank">
                                    <span onClick={logoClick}>
                                        <ItemIcon
                                            iconType={Type.App}
                                            iconName={filters.appsInfo[0].title}
                                            iconSrc={filters.appsInfo[0].icon}
                                        />
                                    </span>
                                    <AppTitle onClick={titleClick} data-automation-app-title={true}>
                                        {filters.appsInfo[0].title}
                                    </AppTitle>
                                </TitleLink>
                            </FlexRow>
                            <StyledSubtitle>
                                <BoxSubtitle filters={subtitleFilters} />
                            </StyledSubtitle>
                            <Desc>
                                <PartialText height={60} onToggle={toggleText}>
                                    <div dangerouslySetInnerHTML={{ __html: description }} />
                                </PartialText>
                            </Desc>
                            <RelatedWebsites
                                relatedWebsites={filters.appsInfo[0].relatedWebsites}
                                websiteTooltipComponent={websiteTooltipComponent}
                            />
                        </AppDescription>
                        <AppScreenshots>
                            <Screenshots images={screenshots} />
                        </AppScreenshots>
                    </FlexRow>
                    <Metrices>
                        <Metric
                            icon="app-downloads"
                            title={translate("app.performance.header.downloads")}
                        >
                            {numeral(downloads).format("0[.]0a").toUpperCase()}
                        </Metric>
                        <Metric
                            icon="app-rating"
                            title={translate("app.performance.header.rating")}
                        >
                            {getRating(rating)}
                        </Metric>
                        <Metric
                            icon="current-version"
                            title={translate("app.performance.header.version")}
                        >
                            {dayjs(lastVersionDate).format("LL")}
                        </Metric>
                    </Metrices>
                </HeaderContainer>
            );
        }}
    </WithAllContexts>
);
DesktopHeaderSection.displayName = "DesktopHeaderSection";
export default DesktopHeaderSection;
