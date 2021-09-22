import { Button } from "@similarweb/ui-components/dist/button";
import { ItemIcon } from "@similarweb/ui-components/dist/item-icon";
import { ShareBar } from "@similarweb/ui-components/dist/share-bar";
import * as React from "react";
import { StatelessComponent } from "react";
import { AppTooltip } from "../../../../../../components/tooltips/src/AppTooltip/AppTooltip";
import WithTranslation from "../../../../../../components/WithTranslation/src/WithTranslation";
import { FlexColumn } from "../../../../../../styled components/StyledFlex/src/StyledFlex";
import WithAllContexts from "../../../common components/WithAllContexts";
import { Type } from "../../StyledComponents";
import {
    AudienceShareBar,
    Category,
    CategoryRow,
    Link,
    TitleCategory,
    TitlesRow,
    TopApps,
} from "./StyledComponents";
import { isSalesIntelligenceAppsState } from "pages/sales-intelligence/helpers/helpers";

export const CategoriesList: StatelessComponent<any> = ({ data }) => (
    <WithTranslation>
        {(translate) => (
            <FlexColumn>
                <TitlesRow>
                    <TitleCategory data-automation-audience-title="category">
                        {translate("app.performance.audience.titles.1")}
                    </TitleCategory>
                    <AudienceShareBar data-automation-audience-title="share-bar">
                        {translate("app.performance.audience.titles.2")}
                    </AudienceShareBar>
                    <TopApps data-automation-audience-title="top-apps">
                        {translate("app.performance.audience.titles.3")}
                    </TopApps>
                    <Link />
                </TitlesRow>
                {data.map((item, idx) => (
                    <CategoryItem key={"r" + idx} data={item} />
                ))}
            </FlexColumn>
        )}
    </WithTranslation>
);
CategoriesList.displayName = "CategoriesList";

export const CategoryItem: StatelessComponent<any> = ({ data }) => (
    <WithAllContexts>
        {({ translate, track, getLink, getAssetsUrl, filters, swNavigator }) => {
            const moreAppsClick = () =>
                track(
                    "internal link",
                    "click",
                    "audience interests/app audience interests/more apps",
                );
            const appClick = () =>
                track(
                    "internal link",
                    "click",
                    "audience interests/app performance overview/top apps",
                );

            let statePerformance = "apps-performance";
            let stateInterest = "apps-appaudienceinterests";

            if (isSalesIntelligenceAppsState(swNavigator)) {
                statePerformance = "salesIntelligence-apps-performance";
                stateInterest = "salesIntelligence-apps-appaudienceinterests";
            }

            const diff = data.totalCount - data.topApps.length;
            const moreAppsTranslation = translate("app.performance.audience.moreapps");
            const moreAppsText = diff > 0 ? `${diff} ${moreAppsTranslation}` : moreAppsTranslation;

            return (
                <CategoryRow data-automation-audience-row={true}>
                    <Category title={data.category}>{data.category}</Category>
                    <AudienceShareBar>
                        <ShareBar value={data.affinity} hideChangeValue={true} />
                    </AudienceShareBar>
                    <TopApps>
                        {data.topApps.map((item, idx) => {
                            return (
                                <AppTooltip
                                    key={"i" + idx}
                                    app={item}
                                    appId={item.appId}
                                    store={
                                        item.store === 0 || item.store === "0"
                                            ? "Google"
                                            : item.store === 1 || item.store === "1"
                                            ? "Apple"
                                            : item.store || ""
                                    }
                                    placement="top"
                                    getAssetsUrl={getAssetsUrl}
                                >
                                    <a
                                        href={getLink(statePerformance, {
                                            appId: "0_" + item.appId,
                                            country: filters.country,
                                        })}
                                        onClick={appClick}
                                    >
                                        <ItemIcon
                                            iconType={Type.App}
                                            iconName={item.title}
                                            iconSrc={item.icon}
                                        />
                                    </a>
                                </AppTooltip>
                            );
                        })}
                    </TopApps>
                    <Link
                        href={getLink(stateInterest, {
                            appId: "0_" + filters.appsInfo[0].id,
                            filter: `{"MainCategoryID":"${data.category}"}`,
                            country: filters.country,
                            duration: "1m",
                        }).replace(/(MainCategoryID%22)(%3A)/, "$1:")}
                    >
                        <Button type="flat" onClick={moreAppsClick}>
                            {moreAppsText}
                        </Button>
                    </Link>
                </CategoryRow>
            );
        }}
    </WithAllContexts>
);

CategoryItem.displayName = "CategoryItem";
