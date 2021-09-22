import { SWReactIcons } from "@similarweb/icons";
import { Title } from "@similarweb/ui-components/dist/title";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { FlexColumn, FlexRow } from "../../../../../../styled components/StyledFlex/src/StyledFlex";

const br0 = "500px";
const br1 = "640px";
const br2 = "840px";

export const StyledMetric: any = styled(FlexColumn)`
    width: 33.33%;
    padding: 24px 20px;
    border-right: 1px solid #e5e7ea;
    :last-child {
        border-right: none;
    }
    @media (max-width: ${br2}) {
        flex-grow: 1;
        border-bottom: 1px solid #e5e7ea;
        :nth-child(2) {
            border-right: none;
        }
    }
    @media (max-width: ${br1}) {
        width: 100%;
        border-bottom: 1px solid #e5e7ea;
        border-right: none;
    }
    @media (max-width: ${br0}) {
        width: 100%;
        border-bottom: 2px solid #efefef;
        border-right: none;
        padding: 10px 20px;
    }
`;
StyledMetric.displayName = "StyledMetric";

const MIcon: any = styled(SWReactIcons)`
    width: 22px;
    height: 22px;
`;
MIcon.displayName = "MIcon";

const MTitle: any = styled(Title)`
    font-size: 16px;
    margin-left: 12px;
    font-weight: 400;
`;
MTitle.displayName = "MTitle";

const MValue: any = styled(Title)`
    display: flex;
    flex-direction: row;
    height: 24px;
    padding-left: 34px;
    padding-right: 26px;
    padding-top: 6px;
    font-size: 20px;
    font-weight: 400;
    svg {
        width: 24px;
    }
    @media (max-width: ${br0}) {
        font-size: 14px;
        svg {
            width: 16px;
        }
    }
`;
MValue.displayName = "MValue";

const Metric: StatelessComponent<any> = ({ title, icon, children }) => {
    return (
        <StyledMetric data-automation-metric={true}>
            <FlexRow>
                <MIcon iconName={icon}></MIcon>
                <MTitle data-automation-metric-title={true}>{title}</MTitle>
            </FlexRow>
            <MValue data-automation-metric-value={true}>{children ? children : "N/A"}</MValue>
        </StyledMetric>
    );
};
Metric.displayName = "Metric";
export default Metric;
