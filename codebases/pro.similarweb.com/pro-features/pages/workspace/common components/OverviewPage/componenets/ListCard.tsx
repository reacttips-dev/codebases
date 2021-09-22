import { SWReactCountryIcons, SWReactIcons } from "@similarweb/icons";
import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import {
    InvestorKeys,
    SalesKeys,
} from "pages/workspace/common components/AddOpportunitiesButton/src/LeadCreationDropdownKeys";
import NewLeadsCreationDropdown from "pages/workspace/common components/AddOpportunitiesButton/src/NewLeadsCreationDropdown";
import * as React from "react";
import { TrendCell } from "../../../../../../app/components/React/Table/cells";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
} from "../../../../../../app/components/React/Table/headerCells";
import { LeadGeneratorChangePercentage } from "../../../../../../app/pages/lead-generator/lead-generator-exist/components/LeadGeneratorChangePercentage";
import { DomainNameAndIcon } from "../../../../../../app/pages/workspace/common/tableAdditionalColumns";
import { WorkspaceContext, workspaceContextType } from "../../WorkspaceContext";
import {
    CardListEmptyContainer,
    CardListEmptyWrapper,
    IconWrapper,
    ListCardBullet,
    ListCardButtonContainer,
    ListCardCountryIcon,
    ListCardHeaderContainer,
    ListCardSubtitle,
    ListCardTableContainer,
    ListCardTitle,
    ListCardWrapper,
    ListHeaderWrapper,
} from "../StyledComponents";

const translations = {
    investors: {
        tableDomain: "workspaces.investors.overview.table.domain.title",
        tableVisitsTrend: "workspaces.investors.overview.table.visits_trend.title",
        tableYoyVisitsChange: "workspaces.investors.overview.table.yoy_visits_change.title",
        totalDomains: "workspaces.investors.overview.companies",
        oneDomain: "workspaces.investors.overview.companies.one",
        noneDomains: "workspaces.investors.overview.companies.none",
        goToList: "workspaces.investors.overview.goto",
        goToListEmpty: "workspaces.investors.overview.goto.empty",
    },
    sales: {
        tableDomain: "workspaces.sales.overview.table.domain.title",
        tableVisitsTrend: "workspaces.sales.overview.table.visits_trend.title",
        tableYoyVisitsChange: "workspaces.sales.overview.table.yoy_visits_change.title",
        totalDomains: "workspaces.sales.overview.companies",
        oneDomain: "workspaces.sales.overview.companies.one",
        noneDomains: "workspaces.sales.overview.companies.none",
        goToList: "workspaces.sales.overview.goto",
        goToListEmpty: "workspaces.sales.overview.goto.empty",
    },
};

const getListCardTableColumnsConfig = (translate, workspaceType) => [
    {
        field: "domain",
        displayName: translate(translations[workspaceType].tableDomain),
        headerComponent: DefaultCellHeader,
        cellComponent: ({ value, row }) => <DomainNameAndIcon domain={value} icon={row.favicon} />,
        width: 176,
    },
    {
        field: "visitsTrend",
        displayName: translate(translations[workspaceType].tableVisitsTrend),
        headerComponent: DefaultCellHeader,
        cellComponent: TrendCell,
        width: 96,
    },
    {
        field: "yoyVisitsChange",
        displayName: translate(translations[workspaceType].tableYoyVisitsChange),
        headerComponent: DefaultCellHeaderRightAlign,
        cellComponent: LeadGeneratorChangePercentage,
        width: 96,
    },
];

export const ListCard = ({
    crrList,
    onSelectList,
    translate,
    workspaceType,
    onAddFromModal,
    onAddFromWizard,
    isGeneratorLimited,
    checkIsGeneratorLocked,
    editOpportunity,
    workspaceId,
    listsFromStore,
}) => {
    const getAddLeadsButton = () => {
        const button = (
            <Button type="flat" label={translate(translations[workspaceType].goToListEmpty)} />
        );
        const keys = workspaceType === "investors" ? InvestorKeys : SalesKeys;
        const onAddManually = () => onAddFromModal(crrList.opportunityListId);
        const onAddFromGenerator = () => {
            onAddFromWizard(crrList.opportunityListId);
        };
        return (
            <NewLeadsCreationDropdown
                keys={keys}
                button={button}
                onAddLeadsManually={onAddManually}
                onAddFromGenerator={onAddFromGenerator}
                isGeneratorLimited={isGeneratorLimited}
                checkIsGeneratorLocked={checkIsGeneratorLocked}
            />
        );
    };
    const editOpportunityList = (e) => {
        e.stopPropagation();
        const list = listsFromStore;
        list.country = crrList.country.id;
        editOpportunity(workspaceId, list);
    };
    return (
        <WorkspaceContext.Consumer>
            {({ getAssetsUrl }: workspaceContextType) => (
                <ListCardWrapper
                    data-automation={`${crrList.friendlyName}-list-card`}
                    onClick={() =>
                        crrList.numberOfDomains > 0 ? onSelectList(crrList.opportunityListId) : null
                    }
                >
                    <ListCardHeaderContainer>
                        {crrList.friendlyName && crrList.friendlyName.length > 32 ? (
                            <PlainTooltip tooltipContent={crrList.friendlyName}>
                                <ListHeaderWrapper>
                                    <ListCardTitle>{crrList.friendlyName}</ListCardTitle>
                                    <IconWrapper
                                        onClick={editOpportunityList}
                                        type={"flat"}
                                        iconName="settings"
                                        iconSize={"xs"}
                                    />
                                </ListHeaderWrapper>
                            </PlainTooltip>
                        ) : (
                            <ListHeaderWrapper>
                                <ListCardTitle>{crrList.friendlyName}</ListCardTitle>
                                <IconWrapper
                                    onClick={editOpportunityList}
                                    type={"flat"}
                                    iconName="settings"
                                    iconSize={"xs"}
                                />
                            </ListHeaderWrapper>
                        )}
                        <ListCardSubtitle>
                            {crrList.numberOfDomains > 0
                                ? crrList.numberOfDomains === 1
                                    ? translate(translations[workspaceType].oneDomain)
                                    : translate(translations[workspaceType].totalDomains, {
                                          number: crrList.numberOfDomains.toString(),
                                      })
                                : translate(translations[workspaceType].noneDomains)}
                            {crrList.numberOfDomains > 0 && (
                                <>
                                    <ListCardBullet />
                                    <ListCardCountryIcon>
                                        <SWReactCountryIcons countryCode={crrList.country.id} />
                                    </ListCardCountryIcon>
                                    {crrList.country.text}
                                </>
                            )}
                        </ListCardSubtitle>
                    </ListCardHeaderContainer>
                    {crrList.opportunities.length > 0 ? (
                        <>
                            <ListCardTableContainer>
                                <MiniFlexTable
                                    data={crrList.opportunities}
                                    columns={getListCardTableColumnsConfig(
                                        translate,
                                        workspaceType,
                                    )}
                                />
                            </ListCardTableContainer>
                            <ListCardButtonContainer>
                                <Button type={"flat"}>
                                    {translate(translations[workspaceType].goToList)}
                                </Button>
                            </ListCardButtonContainer>
                        </>
                    ) : (
                        <CardListEmptyWrapper>
                            <CardListEmptyContainer>
                                <img src={getAssetsUrl("/images/empty-list-card.png")} />
                                {getAddLeadsButton()}
                            </CardListEmptyContainer>
                        </CardListEmptyWrapper>
                    )}
                </ListCardWrapper>
            )}
        </WorkspaceContext.Consumer>
    );
};
