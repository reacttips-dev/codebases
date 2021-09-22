import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { IconButton } from "@similarweb/ui-components/dist/button";
import * as propTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";
import { Carousel } from "../../../../components/Carousel/src/Carousel";
import I18n from "../../../../components/WithTranslation/src/I18n";
import { DashboardCreateLink } from "../../../../components/Workspace/DashboardLink/src/DashboardCreateLink";
import { DashboardLink } from "../../../../components/Workspace/DashboardLink/src/DashboardLink";
import { WorkspaceGrid } from "../../../../components/Workspace/WorkspaceGrid/src/WorkspaceGrid";
import { StyledDashboardLinksContainer } from "../../../../styled components/Workspace/src/StyledDashboardLinksContainer";
import {
    StyledBox,
    StyledBoxTitleContainer,
    StyledHeaderSubtitle,
    StyledTitle,
    StyledTitleIcon,
    TitleLeft,
    TitleRight,
} from "../../../../styled components/Workspace/src/StyledWorkspaceBox";

interface IDashboardMetaData {
    id: string;
    title: string;
    created: string;
    link: string;
    lastUpdated: string;
}

interface IDashboardPlaceholder {
    id?: number | string;
    title: string;
    description: string;
    onClick: (title: string) => () => void;
}

export interface IDashboardsComponentProps {
    dashboardsData?: {
        dashboards: IDashboardMetaData[];
        dashboardsPlaceholders: IDashboardPlaceholder[];
    };
    onAddDashboardClick: () => void;
}

export const DashboardsCarouselComponent: StatelessComponent<IDashboardsComponentProps> = (
    { dashboardsData, onAddDashboardClick },
    { track, translate },
) => {
    const i18n = translate;
    return (
        <WorkspaceGrid>
            <StyledBox
                data-sw-intercom-tour-workspaces-marketing-dashboards_carousel_component-styled_box-step-7
            >
                <StyledBoxTitleContainer>
                    <TitleLeft>
                        <StyledTitle>
                            <I18n>workspaces.marketing.dashboard.title</I18n>
                            <PlainTooltip tooltipContent={i18n("dashboardsData.tooltip")}>
                                <div>
                                    <StyledTitleIcon iconName="info" size="xs" />
                                </div>
                            </PlainTooltip>
                        </StyledTitle>
                        <StyledHeaderSubtitle>
                            {dashboardsData.dashboards.length > 0 ? (
                                <I18n>workspaces.marketing.dashboard.subtitle</I18n>
                            ) : (
                                <I18n>workspaces.marketing.dashboard.subtitle.nodashboard</I18n>
                            )}
                        </StyledHeaderSubtitle>
                    </TitleLeft>
                    <TitleRight>
                        <IconButton type="primary" iconName="wand" onClick={onAddDashboardClick}>
                            <I18n>workspaces.marketing.dashboard.new</I18n>
                        </IconButton>
                    </TitleRight>
                </StyledBoxTitleContainer>
                <StyledDashboardLinksContainer>
                    <Carousel margin={8} offset={24}>
                        {[
                            ...dashboardsData.dashboards.map((dashboard, index) => {
                                return (
                                    <DashboardLink
                                        key={`dashboardLink-${index}`}
                                        created={dashboard.created}
                                        lastUpdated={dashboard.lastUpdated}
                                        link={dashboard.link}
                                        title={dashboard.title}
                                        onClick={track(
                                            "Dashboard Templates Quick Links",
                                            "click",
                                            `${dashboard.title}/internal link`,
                                        )}
                                    />
                                );
                            }),
                            ...dashboardsData.dashboardsPlaceholders.map((placeholder, index) => {
                                return (
                                    <DashboardCreateLink
                                        key={`dashboardCreateLink-${index}`}
                                        title={placeholder.title}
                                        description={placeholder.description}
                                        onClick={placeholder.onClick(placeholder.title)}
                                    />
                                );
                            }),
                        ]}
                    </Carousel>
                </StyledDashboardLinksContainer>
            </StyledBox>
        </WorkspaceGrid>
    );
};

DashboardsCarouselComponent.contextTypes = {
    track: propTypes.func,
    translate: propTypes.func,
};
