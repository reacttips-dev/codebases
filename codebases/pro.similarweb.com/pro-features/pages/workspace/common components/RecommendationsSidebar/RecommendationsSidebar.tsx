import { SWReactCountryIcons, SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { Dropdown, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SimpleLegend } from "@similarweb/ui-components/dist/simple-legend";
import * as React from "react";
import styled from "styled-components";
import { CircularLoader } from "../../../../../app/components/React/CircularLoader";
import I18n from "../../../../../app/components/React/Filters/I18n";
import {
    minVisitsAbbrFilter,
    percentageSignFilter,
    prettifyCategoryFilter,
} from "../../../../../app/filters/ngFilters";
import { BetaLabel } from "../../../../components/BetaLabel/BetaLabel";
import WithTrack from "../../../../components/WithTrack/src/WithTrack";
import WithTranslation from "../../../../components/WithTranslation/src/WithTranslation";
import { FlexColumn, FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";
import { WorkspaceContext, workspaceContextType } from "../WorkspaceContext";
import { RecommendationsEmptyState } from "./RecommendationsEmptyState";
import {
    BottomTitle,
    ButtonsWrapper,
    LinkIcon,
    RecommendationsEmptyStateImageAndText,
    RecommendationsSidebarContentWrapper,
    RecommendationsSidebarDotsWrapper,
    RecommendationsSidebarEmptyStateBoldTitle,
    RecommendationsSidebarEmptyStateButtonReloadContainer,
    RecommendationsSidebarEmptyStateTitle,
    RecommendationsSidebarEmptyStateWrapper,
    RecommendationsSidebarHeader,
    RecommendationsSidebarInfo,
    RecommendationsSidebarSubtitle,
    RecommendationsSidebarTileBottomFragment,
    RecommendationsSidebarTileTopFragment,
    RecommendationsSidebarTileWebsite,
    RecommendationsSidebarTileWebsiteContainer,
    RecommendationsSidebarTitle,
    RecommendationsSidebarTitleWrapper,
    RecommendationsSidebarTopSection,
    RecommendedWebsiteWrapper,
    Separator,
    Subtitle,
} from "./StyledComponents";

export interface IRecommendationTile {
    Domain: string;
    FavIcon: string;
    Removed?: boolean;
    Category: string;
    TopCountry: number;
    TopCountryName: string;
    Visits: number;
    Change: number;
    Description: string;
}

export interface IRecommendationsSidebarProps {
    isLoading: boolean;
    onAddRecommendations: (domainsArr) => void;
    onDismissRecommendation: (domain) => void;
    onLinkRecommendation: (domain) => void;
    recommendations: IRecommendationTile[];
}

export interface IRecommendationTileProps extends IRecommendationTile {
    onAddRecommendations: (domainsArr, holdRightBarOpen?) => void;
    onDismissRecommendation: (domain) => void;
    onLinkRecommendation: (domain) => void;
    translate: (key, obj?) => string;
    track: (category?, action?, name?, value?) => void;
}

const RecommendationsSidebarLoadingState = ({ translate }) => (
    <RecommendationsSidebarEmptyStateWrapper>
        <CircularLoader
            options={{
                svg: {
                    stroke: "#dedede",
                    strokeWidth: "4",
                    r: 21,
                    cx: "50%",
                    cy: "50%",
                },
                style: {
                    width: 46,
                    height: 46,
                },
            }}
        />
        <RecommendationsSidebarEmptyStateTitle>
            {translate("workspace.recommendation_sidebar.loading_state")}
        </RecommendationsSidebarEmptyStateTitle>
    </RecommendationsSidebarEmptyStateWrapper>
);

const RecommendationsSidebarEmptyState = ({ translate }) => (
    <WorkspaceContext.Consumer>
        {({ activeOpportunitiesList, onFetchRecommendations }: workspaceContextType) => (
            <RecommendationsSidebarEmptyStateWrapper>
                {activeOpportunitiesList.opportunities.length > 0 && (
                    <RecommendationsSidebarEmptyStateButtonReloadContainer>
                        <Button
                            type="flat"
                            onClick={onFetchRecommendations}
                            dataAutomation="recommendations-sidebar-reload"
                        >
                            {translate("workspace.recommendation_sidebar.refresh")}
                        </Button>
                    </RecommendationsSidebarEmptyStateButtonReloadContainer>
                )}
                <RecommendationsEmptyStateImageAndText>
                    {RecommendationsEmptyState}
                    <RecommendationsSidebarEmptyStateBoldTitle>
                        {translate("workspace.recommendation_sidebar.empty_state.title")}
                    </RecommendationsSidebarEmptyStateBoldTitle>
                    <RecommendationsSidebarEmptyStateTitle>
                        {translate("workspace.recommendation_sidebar.empty_state")}
                    </RecommendationsSidebarEmptyStateTitle>
                </RecommendationsEmptyStateImageAndText>
            </RecommendationsSidebarEmptyStateWrapper>
        )}
    </WorkspaceContext.Consumer>
);

export const RecommendationsTopTitle = ({ recommendations, country, translate }) => {
    return (
        <RecommendationsSidebarSubtitle>
            {translate("workspace.recommendation_sidebar.results.title", {
                results: recommendations.filter((r) => !r.Removed).length.toString(),
                country,
            })}
        </RecommendationsSidebarSubtitle>
    );
};

export const RecommendationsSidebarContent = React.memo<any>(
    ({ track, translate, onAddRecommendations, recommendations, websiteActions }) => {
        const onClickAddAll = () => {
            const recommendationsToAdd = recommendations
                .filter((r) => !r.Removed)
                .map(({ Domain }) => ({ Domain }));
            onAddRecommendations(recommendationsToAdd, true);
            track(
                "Recommendation model",
                "click",
                `add all websites/${recommendationsToAdd.length}`,
            );
        };
        return (
            <WorkspaceContext.Consumer>
                {({
                    activeOpportunitiesList,
                    getCountryById,
                    onFetchRecommendations,
                }: workspaceContextType) => (
                    <>
                        <RecommendationsTopTitle
                            recommendations={recommendations}
                            translate={translate}
                            country={getCountryById(activeOpportunitiesList.country).text}
                        />

                        <ButtonsWrapper>
                            <Button
                                type="flat"
                                onClick={onClickAddAll}
                                dataAutomation="recommendations-sidebar-add-all"
                            >
                                {translate("workspace.recommendation_sidebar.button")}
                            </Button>
                            <Button
                                type="flat"
                                onClick={onFetchRecommendations}
                                dataAutomation="recommendations-sidebar-reload"
                            >
                                {translate("workspace.recommendation_sidebar.refresh")}
                            </Button>
                        </ButtonsWrapper>
                        {recommendations.map((crrWebsite) => (
                            <RecommendationTile
                                key={crrWebsite.Domain}
                                onAddRecommendations={onAddRecommendations}
                                {...crrWebsite}
                                {...websiteActions}
                                translate={translate}
                                track={track}
                            />
                        ))}
                    </>
                )}
            </WorkspaceContext.Consumer>
        );
    },
);

RecommendationsSidebarContent.displayName = "RecommendationsSidebarContent";

const LegendAndLinkContainer = styled(FlexRow)`
    align-items: center;
    height: 24px;
`;

const GranularCategory = styled(Subtitle)`
    position: relative;
    top: 2px;
`;

const Description = styled(Subtitle)`
    opacity: 0.8;
    text-overflow: ellipsis;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 18px;
    margin: -12px 0 0 31px;
    max-width: 302px;
`;

export const RecommendedWebsite = ({ domain, icon, category, description }) => {
    const granularCategory =
        typeof category === "string" &&
        prettifyCategoryFilter()(category, null, null).match(/[^/]+$/)[0]; // we extract the string after the last "/"
    return (
        <RecommendedWebsiteWrapper>
            <LegendAndLinkContainer>
                <SimpleLegend items={[{ icon, name: domain }]} />
                <LinkIcon
                    href={`http://${domain}`}
                    target={"_blank"}
                    data-automation="recommendation-tile-link-out"
                >
                    <IconButton iconName="link-out" type="flat" iconSize="xs" />
                </LinkIcon>
            </LegendAndLinkContainer>
            {granularCategory && <GranularCategory>{granularCategory}</GranularCategory>}
        </RecommendedWebsiteWrapper>
    );
};
export const CountryIconWithText = styled.span`
    margin-left: 4px;
    max-width: 120px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export const NewsBadgeText = styled.span`
    margin-left: 4px;
    max-width: 208px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export const NewsBadgeCategory = styled(NewsBadgeText)`
    text-transform: capitalize;
`;

const MetricColumn = styled(FlexColumn)`
    box-sizing: border-box;
    justify-content: space-between;
    height: 40px;
`;

const CountryColumn = styled(MetricColumn)`
    flex-basis: 152px;
    padding-left: 12px;
`;

const ChangeColumn = styled(MetricColumn)`
    flex-basis: 89px;
    padding-right: 7px;
    border-right: 1px solid ${rgba(colorsPalettes.carbon[500], 0.08)};
`;

const GlobalVisitsColumn = styled(MetricColumn)`
    flex-basis: 97px;
    padding-right: 12px;
`;

const BottomSubtitle = styled(Subtitle)`
    opacity: 0.8;
`;

export const CollectedMetrics = ({ country, countryName, change, Visits }) => (
    <WithTranslation>
        {(translate) => (
            <>
                <GlobalVisitsColumn>
                    <BottomSubtitle>{translate("global.visits")}</BottomSubtitle>
                    <BottomTitle>
                        <SWReactCountryIcons countryCode={999} size={"xs"} />
                        <CountryIconWithText>{minVisitsAbbrFilter()(Visits)}</CountryIconWithText>
                    </BottomTitle>
                </GlobalVisitsColumn>
                <ChangeColumn>
                    <BottomSubtitle>{translate("global.change.mom")}</BottomSubtitle>
                    <BottomTitle
                        color={
                            change > 0
                                ? colorsPalettes.green.s100
                                : change < 0
                                ? colorsPalettes.red.s100
                                : null
                        }
                    >
                        {(change > 0 ? "+" : "") + percentageSignFilter()(change, 2)}
                    </BottomTitle>
                </ChangeColumn>
                <CountryColumn>
                    <BottomSubtitle>
                        {translate("workspace.recommendations.top_country")}
                    </BottomSubtitle>
                    <BottomTitle>
                        <SWReactCountryIcons countryCode={country} size={"xs"} />
                        <CountryIconWithText>{countryName}</CountryIconWithText>
                    </BottomTitle>
                </CountryColumn>
            </>
        )}
    </WithTranslation>
);

const AlignRight = styled.div`
    display: flex;
    align-self: flex-end;
    flex-grow: 1;
`;

export const RecommendationTile = React.memo(
    ({
        Domain,
        FavIcon,
        Category,
        TopCountry,
        TopCountryName,
        Visits,
        Change,
        Removed,
        onAddRecommendations,
        onDismissRecommendation,
        onLinkRecommendation,
        translate,
        track,
        Description: description,
    }: IRecommendationTileProps) => {
        const dropdownOptions = [
            {
                label: translate("workspace.recommendation_sidebar.dismiss"),
                action: (domain) => {
                    onDismissRecommendation(domain);
                    track(
                        "Recommendation model",
                        "click",
                        `Settings/Dismiss recommendation/${domain}`,
                    );
                },
            },
            {
                label: translate("workspace.recommendation_sidebar.website_analysis"),
                action: (domain) => {
                    onLinkRecommendation(domain);
                    track(
                        "Recommendation model",
                        "click",
                        `Settings/see website analysis/${domain}`,
                    );
                },
            },
        ];
        const onDropdownComponentClick = ({ id }) => dropdownOptions[id].action(Domain);
        const onDropdownToggle = (isOpen) => {
            if (isOpen) {
                track("Recommendation model", "open", "Settings");
            }
        };
        const onClickAddDomain = () => {
            onAddRecommendations([{ Domain }], true);
            track("Recommendation model", "click", `Add recommendation/${Domain}`);
        };
        return (
            <RecommendationsSidebarTileWebsiteContainer
                isRemoved={!!Removed}
                data-automation="recommendations-sidebar-tile-container"
            >
                <RecommendationsSidebarTileWebsite
                    isRemoved={!!Removed}
                    data-automation="recommendations-sidebar-tile"
                >
                    <RecommendationsSidebarTileTopFragment>
                        <RecommendedWebsite
                            icon={FavIcon}
                            domain={Domain}
                            category={Category}
                            description={Description}
                        />
                        <AlignRight>
                            <RecommendationsSidebarDotsWrapper>
                                <Dropdown
                                    width={224}
                                    onClick={onDropdownComponentClick}
                                    onToggle={onDropdownToggle}
                                >
                                    {[
                                        <IconButton
                                            key="ddbtn"
                                            type="flat"
                                            iconName="dots-more"
                                            dataAutomation="recommendations-sidebar-settings"
                                        />,
                                        ...dropdownOptions.map((option, idx) => (
                                            <EllipsisDropdownItem key={`dditem_${idx}`} id={idx}>
                                                {option.label}
                                            </EllipsisDropdownItem>
                                        )),
                                    ]}
                                </Dropdown>
                            </RecommendationsSidebarDotsWrapper>
                            <Button
                                type={"outlined"}
                                dataAutomation="recommendations-sidebar-add-domain"
                                onClick={onClickAddDomain}
                            >
                                {translate("workspace.recommendations.add")}
                            </Button>
                        </AlignRight>
                    </RecommendationsSidebarTileTopFragment>
                    <Description>
                        {description ? (
                            <PlainTooltip tooltipContent={description}>
                                <span>{description}</span>
                            </PlainTooltip>
                        ) : (
                            <I18n>workspace.recommendation_sidebar.no.description</I18n>
                        )}
                    </Description>
                    <RecommendationsSidebarTileBottomFragment>
                        <CollectedMetrics
                            change={Change}
                            country={TopCountry}
                            countryName={TopCountryName}
                            Visits={Visits}
                        />
                    </RecommendationsSidebarTileBottomFragment>
                </RecommendationsSidebarTileWebsite>
            </RecommendationsSidebarTileWebsiteContainer>
        );
    },
);

export const RecommendationsSidebar = React.memo(
    ({
        isLoading,
        onAddRecommendations,
        recommendations,
        ...websiteActions
    }: IRecommendationsSidebarProps) => (
        <WithTranslation>
            {(translate) => (
                <WithTrack>
                    {(track) => {
                        return (
                            <>
                                <RecommendationsSidebarTopSection>
                                    <RecommendationsSidebarHeader>
                                        <RecommendationsSidebarTitleWrapper>
                                            <RecommendationsSidebarTitle>
                                                {translate(
                                                    "workspace.recommendation_sidebar.title",
                                                )}
                                            </RecommendationsSidebarTitle>
                                            <PlainTooltip
                                                tooltipContent={translate(
                                                    "workspace.recommendation_sidebar.title.tooltip",
                                                )}
                                            >
                                                <RecommendationsSidebarInfo>
                                                    <SWReactIcons iconName="info" size="xs" />
                                                </RecommendationsSidebarInfo>
                                            </PlainTooltip>
                                        </RecommendationsSidebarTitleWrapper>
                                    </RecommendationsSidebarHeader>
                                    <RecommendationsSidebarSubtitle>
                                        {translate(
                                            "workspace.recommendation_sidebar.subtitle.first",
                                        )}
                                    </RecommendationsSidebarSubtitle>
                                </RecommendationsSidebarTopSection>
                                <Separator />
                                <RecommendationsSidebarContentWrapper>
                                    {isLoading ? (
                                        <RecommendationsSidebarLoadingState translate={translate} />
                                    ) : recommendations.filter((crr) => !crr.Removed).length > 0 ? (
                                        <RecommendationsSidebarContent
                                            translate={translate}
                                            track={track}
                                            onAddRecommendations={onAddRecommendations}
                                            recommendations={recommendations}
                                            websiteActions={websiteActions}
                                        />
                                    ) : (
                                        <RecommendationsSidebarEmptyState translate={translate} />
                                    )}
                                </RecommendationsSidebarContentWrapper>
                            </>
                        );
                    }}
                </WithTrack>
            )}
        </WithTranslation>
    ),
);
