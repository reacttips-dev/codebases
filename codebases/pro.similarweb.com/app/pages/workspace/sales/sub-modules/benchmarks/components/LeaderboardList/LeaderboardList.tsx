import React from "react";
import { BaseWebsiteType } from "../../types/common";
import WebsiteDomain from "pages/workspace/sales/components/WebsiteDomain/WebsiteDomain";
import {
    StyledLeaderboardListContainer,
    StyledRanks,
    StyledWebsitesContainer,
    StyledWebsiteItem,
    StyledRank,
    StyledRankSuffix,
} from "./styles";
import { getNumberSuffixNaive } from "../../helpers";
import EditableCompetitor from "../EditableCompetitor/EditableCompetitorContainer";
import AddCompetitorContainer from "../EditableCompetitor/AddCompetitorContainer";

type LeaderboardListProps = {
    isLoading: boolean;
    prospectDomain: string;
    metric: string;
    country: number;
    similarWebsites: BaseWebsiteType[];
    websites: BaseWebsiteType[];
    onRemoveWebsite(domain: string): void;
    onAddWebsite(website: BaseWebsiteType): void;
    onUpdateWebsite(website: BaseWebsiteType, prevDomain: string): void;
    metricFormatter(value: number): string;
};

const LeaderboardList = (props: LeaderboardListProps) => {
    const {
        isLoading,
        prospectDomain,
        similarWebsites,
        metric,
        country,
        websites,
        onAddWebsite,
        onRemoveWebsite,
        onUpdateWebsite,
        metricFormatter,
    } = props;
    const searchExcludeList = websites.map(({ domain }) => ({ name: domain }));

    const renderWebsiteItem = (
        website: BaseWebsiteType & { value: number },
        index: number,
        array: BaseWebsiteType[],
    ) => {
        if (website.domain === prospectDomain) {
            return (
                <StyledWebsiteItem key={website.domain}>
                    <WebsiteDomain domain={website.domain} favicon={website.favicon} />
                </StyledWebsiteItem>
            );
        }

        return (
            <StyledWebsiteItem key={website.domain}>
                <EditableCompetitor
                    metric={metric}
                    website={website}
                    country={country}
                    clickable={!isLoading}
                    onClose={onRemoveWebsite}
                    onChange={onUpdateWebsite}
                    similarWebsites={similarWebsites}
                    searchExcludeList={searchExcludeList}
                    closable={array.length > 2 && !isLoading}
                    metricFormatter={metricFormatter}
                />
            </StyledWebsiteItem>
        );
    };

    return (
        <StyledLeaderboardListContainer>
            <StyledRanks>
                {websites.map(({ domain }, index) => (
                    <StyledRank key={`${domain}-rank`} isEmphasized={prospectDomain === domain}>
                        <span>{index + 1}</span>
                        <StyledRankSuffix>{getNumberSuffixNaive(index + 1)}</StyledRankSuffix>
                    </StyledRank>
                ))}
            </StyledRanks>
            <StyledWebsitesContainer>
                {websites.map(renderWebsiteItem)}
                {websites.length < 10 && (
                    <AddCompetitorContainer
                        updating={isLoading}
                        similarWebsites={similarWebsites}
                        searchExcludeList={searchExcludeList}
                        onAddCompetitor={onAddWebsite}
                        country={country}
                        metric={metric}
                        metricFormatter={metricFormatter}
                    />
                )}
            </StyledWebsitesContainer>
        </StyledLeaderboardListContainer>
    );
};

export default LeaderboardList;
