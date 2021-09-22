import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { Injector } from "common/ioc/Injector";
import { lockedMetrics } from "components/React/EngagementOverviewTable/EngagementOverviewTable";
import { LeaderDefaultCell } from "components/React/Table/cells/index";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { openUnlockModal } from "services/ModalService";
import styled from "styled-components";
import { InjectableComponent } from "../../InjectableComponent/InjectableComponent";

const Wrapper = styled.div<{ sitesCount: number }>`
    position: absolute;
    justify-content: center;
    display: flex;
    width: ${({ sitesCount }) => `calc(${100 * sitesCount}%)`};
    color: ${colorsPalettes.carbon["300"]};
    font-size: 12px;
    align-items: center;
    z-index: 3;
`;

const UpgradeButton = styled(Button)`
    border-color: ${colorsPalettes.mint[400]};
    height: 33px !important;
    :hover {
        border-color: ${colorsPalettes.mint[500]};
    }
    div {
        display: flex;
    }
`;

const StyledSpan = styled.span`
    margin-right: 8px;
`;

const LockedIconComponent: any = styled(SWReactIcons).attrs({
    size: "sm",
    iconName: "locked",
})`
    height: 12px !important;
    width: 12px !important;
    margin-right: 5px;
    path {
        fill: ${colorsPalettes.mint["400"]} !important;
        fill-opacity: unset;
    }
`;

const TextWrapper = styled.span`
    color: ${colorsPalettes.mint[400]} !important;
    font-weight: bold;
    font-size: 14px;
`;

export class FullRowCell extends InjectableComponent {
    private chosenSites = Injector.get<any>("chosenSites");
    private sitesCount = this.chosenSites.count();
    private noDataDedup = this.props.noDataDedup;
    private lockedMetric = this.props.lockedMetric;
    private unlockHook = this.props.row.metric.unlockHook || {};

    public getComponent = () => {
        let component;
        if (this.lockedMetric && lockedMetrics.includes(this.props.row.metric.value)) {
            const onClick = () => {
                openUnlockModal(this.unlockHook);
            };
            component =
                this.props.colIndex === 1 ? (
                    <Wrapper sitesCount={this.sitesCount}>
                        <StyledSpan>Gain access to more insights</StyledSpan>
                        <UpgradeButton onClick={onClick} type="outlined">
                            <LockedIconComponent />
                            <TextWrapper>UPGRADE</TextWrapper>
                        </UpgradeButton>
                    </Wrapper>
                ) : null;
        } else if (
            this.noDataDedup &&
            this.props.row.metric.value === i18nFilter()("wa.ao.metric.dedup")
        ) {
            component =
                this.props.colIndex === 1 ? (
                    <Wrapper sitesCount={this.sitesCount}>No Data For Last 28 Days</Wrapper>
                ) : null;
        } else {
            component = <LeaderDefaultCell {...this.props} />;
        }
        return component;
    };
    public render() {
        return this.getComponent();
    }
}
