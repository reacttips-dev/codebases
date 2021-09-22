import * as React from "react";
import styled from "styled-components";
import { RelevancyScore } from "components/RelevancyScore/src/RelevancyScore";
import { ITableCellProps } from "components/React/Table/interfaces/ITableCellProps";
import { FC } from "react";
import { Injector } from "common/ioc/Injector";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { colorsPalettes } from "@similarweb/styles";
import I18n from "components/WithTranslation/src/I18n";
import { ClosableItemColorMarker } from "components/compare/StyledComponent";
import { LowTrafficCompareWrapper } from "pages/website-analysis/incoming-traffic/StyledComponents";
import { i18nFilter } from "filters/ngFilters";

const RelevancyWrapper = styled.div`
    margin: 0;
    width: 56px;
`;

const CellWrapper = styled.div`
    justify-content: flex-start;
    align-items: center;
    display: flex;
`;

const IconWrapper = styled.span`
    border-color: #d6dbe1 !important;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: #fff;
    border: 1px solid;
    box-shadow: 0 2px 4px 0 rgba(${colorsPalettes.carbon[200]}, 0.2);
    margin-right: 9px;
    position: relative;

    img {
        margin: 0;
    }
`;

const TooltipWrapper = styled.div`
    color: #2a3e52cc;
    width: 237px;
    margin: 12px 4px 12px 4px;
    display: flex;
    flex-direction: column;
`;

const Title = styled.span`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 12px;
`;

const SubText = styled.div`
    font-size: 12px;
    margin-bottom: 12px;
`;

const DomainWrapper = styled.span`
    font-weight: bold;
    font-size: 12px;
`;

const ReferralsList = styled.div`
    display: flex
    flex-direction: column;
`;

const LowTraffic = styled.div`
    color: ${colorsPalettes.midnight[500]};
    margin-left: 2px;
`;

const DomainItemWrapper = styled.div`
    display: flex;
    margin-bottom: 15px;
    align-items: center;
`;

const NameWrapper = styled.span`
    margin-right: 20px
    width: 65px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;;
`;

const MoreDomains = styled.div`
    margin-left: 9px;
    color: ${colorsPalettes.midnight[500]};
    cursor: default;
    height: 26px;
    width: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const RelevancyCompareCellWithTooltip: FC<ITableCellProps> = (props) => {
    const { value, row, displayName } = props;
    const chosenSites = Injector.get<any>("chosenSites");
    const sites = chosenSites.sitelistForLegend();
    let isAllScoresNull = true;

    const domains = value.map((item) => {
        const site = sites.find((a) => a.name === item.name);

        if (item.score) {
            isAllScoresNull = false;
        }

        return {
            ...item,
            index: sites.findIndex((a) => a.name === item.name),
            icon: site.icon,
            color: site.color,
        };
    });
    const sortedDomains = domains.sort((a, b) =>
        a.score < b.score ? 1 : a.score === b.score ? (a.index > b.index ? 1 : -1) : -1,
    );

    const leader = sortedDomains[0];

    const DomainItem = (props) => {
        const { score, icon, name, color } = props;

        return (
            <DomainItemWrapper>
                <IconWrapper>
                    {icon && <img src={icon} />}
                    {color && <ClosableItemColorMarker style={{ backgroundColor: color }} />}
                </IconWrapper>
                <NameWrapper>{name}</NameWrapper>
                {score ? (
                    <RelevancyWrapper>
                        <RelevancyScore maxBullets={5} bullets={score} />
                    </RelevancyWrapper>
                ) : (
                    <LowTraffic>
                        <I18n>incoming-traffic.engagement-score.traffic-is-too-low</I18n>
                    </LowTraffic>
                )}
            </DomainItemWrapper>
        );
    };

    const tooltipContent = () => {
        return (
            <TooltipWrapper>
                <Title>{displayName}</Title>
                <SubText>
                    <I18n>
                        analysis.source.search.all.table.columns.engagement-score.cell.tooltip
                    </I18n>{" "}
                    <DomainWrapper>{row.Domain}</DomainWrapper>
                </SubText>
                <ReferralsList>
                    {sortedDomains.map((domain) => (
                        <DomainItem key={domain.index} {...domain} />
                    ))}
                </ReferralsList>
            </TooltipWrapper>
        );
    };

    return isAllScoresNull ? (
        <LowTrafficCompareWrapper>
            {i18nFilter()("incoming-traffic.engagement-score.traffic-is-too-low")}
        </LowTrafficCompareWrapper>
    ) : (
        <PlainTooltip
            maxWidth={275}
            placement="top"
            variation="white"
            tooltipContent={tooltipContent()}
        >
            <CellWrapper>
                <IconWrapper>
                    <img src={leader.icon} />
                </IconWrapper>
                {leader.score ? (
                    <RelevancyWrapper>
                        <RelevancyScore maxBullets={5} bullets={leader.score} />
                    </RelevancyWrapper>
                ) : (
                    <LowTraffic>
                        <I18n>incoming-traffic.engagement-score.traffic-is-too-low</I18n>
                    </LowTraffic>
                )}
                {sortedDomains.length - 1 > 0 && (
                    <MoreDomains>+{sortedDomains.length - 1}</MoreDomains>
                )}
            </CellWrapper>
        </PlainTooltip>
    );
};
