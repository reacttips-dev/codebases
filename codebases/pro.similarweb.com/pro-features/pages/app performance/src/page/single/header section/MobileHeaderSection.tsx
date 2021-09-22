import { SWReactIcons } from "@similarweb/icons";
import { ItemIcon } from "@similarweb/ui-components/dist/item-icon";
import { PartialText } from "@similarweb/ui-components/dist/partial-text";
import dayjs from "dayjs";
import * as numeral from "numeral";
import React from "react";
import { PureComponent } from "react";
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
    AppInfoBtn,
    AppScreenshots,
    Desc,
    HeaderContainer,
    Metrices,
    MobileAppTitle,
    StyledSubtitle,
    TitleLink,
} from "./StyledComponents";

export default class MobileHeaderSection extends PureComponent<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
        };
    }

    public render() {
        return (
            <WithAllContexts>
                {({ translate, track, filters }) => {
                    const { data } = this.props;
                    const { description, downloads, rating, lastVersionDate, screenshots } = data;
                    const storeLink =
                        filters.store === "Google"
                            ? "https://play.google.com/store/apps/details?id=" +
                              filters.appsInfo[0].id
                            : "https://itunes.apple.com/app/id" + filters.appsInfo[0].id;
                    const toggleText = (isCollapsed) =>
                        track(
                            "Expand Collapse",
                            isCollapsed ? "Collapse" : "Expand",
                            "app description",
                        );
                    const subtitleFilters = [
                        {
                            filter: "date",
                            value: {
                                from: filters.lastScrapingDate,
                            },
                        },
                    ];
                    return (
                        <HeaderContainer>
                            <FlexRow>
                                <AppDescription
                                    untrackText={translate("app.performance.header.untrack")}
                                >
                                    <FlexRow>
                                        <TitleLink href={storeLink} target="_blank">
                                            <ItemIcon
                                                iconType={Type.App}
                                                iconName={filters.appsInfo[0].title}
                                                iconSrc={filters.appsInfo[0].icon}
                                            />
                                            <MobileAppTitle data-automation-app-title={true}>
                                                {filters.appsInfo[0].title}
                                            </MobileAppTitle>
                                        </TitleLink>
                                    </FlexRow>
                                    <StyledSubtitle>
                                        <BoxSubtitle filters={subtitleFilters} />
                                    </StyledSubtitle>
                                    <Desc>
                                        <PartialText height={60} onToggle={toggleText}>
                                            {description}
                                        </PartialText>
                                    </Desc>
                                    <RelatedWebsites
                                        relatedWebsites={filters.appsInfo[0].relatedWebsites}
                                        websiteTooltipComponent={this.props.websiteTooltipComponent}
                                    />
                                </AppDescription>
                                <AppScreenshots>
                                    <Screenshots images={screenshots} />
                                </AppScreenshots>
                            </FlexRow>
                            <AppInfoBtn onClick={this.toggleAppInfo}>
                                <span>{translate("app.performance.header.appsInfo")}</span>
                                <SWReactIcons
                                    iconName={this.state.collapsed ? "chev-down" : "chev-up"}
                                />
                            </AppInfoBtn>
                            {this.state.collapsed ? null : (
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
                            )}
                        </HeaderContainer>
                    );
                }}
            </WithAllContexts>
        );
    }

    public toggleAppInfo = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
}
