import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SimilarSiteType } from "../../types/similar-sites";
import useSimilarSitesTableService from "../../hooks/useSimilarSitesTableService";
import Table from "pages/workspace/sales/components/custom-table/Table/Table";
import {
    StyledTable,
    StyledDomainCell,
    StyledSimilarityCell,
    StyledWebsiteDomain,
    StyledLink,
    StyledDeleteIcon,
    StyledTooltipText,
    StyledTooltipTitle,
} from "./styles";
import { StyledTableHeaderCell } from "pages/workspace/sales/components/custom-table/TableCell/styles";

type SimilarSitesPanelTableProps = {
    websites: SimilarSiteType[];
    onWebsiteRemove(domain: string): void;
    onWebsiteLinkClick(domain: string): void;
};

const SimilarSitesPanelTable = (props: SimilarSitesPanelTableProps) => {
    const translate = useTranslation();
    const { websites, onWebsiteRemove, onWebsiteLinkClick } = props;
    const similarSitesTableService = useSimilarSitesTableService(websites);
    const tableData = similarSitesTableService.getData();

    const renderDomainCell = (domain: string, index: number, isHovered: boolean) => {
        return (
            <StyledDomainCell>
                <StyledWebsiteDomain
                    domain={domain}
                    faviconSize="sm"
                    favicon={similarSitesTableService.getFavicon(domain)}
                />
                {isHovered && (
                    <StyledLink>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://${domain}`}
                            onClick={() => onWebsiteLinkClick(domain)}
                            data-automation={`si-similar-sites-table-website-link-${domain}`}
                        >
                            <IconButton type="flat" iconName="link-out" iconSize="xs" />
                        </a>
                    </StyledLink>
                )}
            </StyledDomainCell>
        );
    };

    const renderSimilarityCell = (similarity: string, index: number, isHovered: boolean) => {
        const domain = tableData[index].domain;

        return (
            <StyledSimilarityCell>
                <span data-automation={`si-similar-sites-table-similarity-${domain}`}>
                    {similarity}
                </span>
                {isHovered && (
                    <PlainTooltip
                        placement="top"
                        tooltipContent={translate("Remove website from list")}
                    >
                        <StyledDeleteIcon>
                            <IconButton
                                type="flat"
                                iconSize="xs"
                                iconName="delete"
                                dataAutomation={`si-similar-sites-table-website-remove-${domain}`}
                                onClick={() => onWebsiteRemove(domain)}
                            />
                        </StyledDeleteIcon>
                    </PlainTooltip>
                )}
            </StyledSimilarityCell>
        );
    };

    const renderSimilarityHeaderCell = () => {
        const title = similarSitesTableService.getColumnText("similarity");

        return (
            <PlainTooltip
                tooltipContent={
                    <>
                        <StyledTooltipTitle>{title}</StyledTooltipTitle>
                        <StyledTooltipText>
                            {similarSitesTableService.getSimilarityHeaderTooltipText()}
                        </StyledTooltipText>
                    </>
                }
            >
                <StyledTableHeaderCell>{title}</StyledTableHeaderCell>
            </PlainTooltip>
        );
    };

    return (
        <StyledTable>
            <Table
                reactsToMouseEnter
                data={tableData}
                columns={similarSitesTableService.getColumns()}
                customRenderers={{ domain: renderDomainCell, similarity: renderSimilarityCell }}
                customHeaderRenderers={{ similarity: renderSimilarityHeaderCell }}
            />
        </StyledTable>
    );
};

export default SimilarSitesPanelTable;
