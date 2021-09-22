import * as React from "react";
import { FC } from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";

const Content = styled.div`
    font-weight: 400;
`;

const IconWrapper = styled.div`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${colorsPalettes.blue[400]};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 6px 0 6px;
`;

const StyledAlertIcon = styled(SWReactIcons)`
    path {
        fill: white;
    }
    display: flex;
    height: 12px;
    width: 12px;
`;

export const MMXAlertWithPlainTooltip: FC<any> = () => {
    const tooltipContent = (
        <FlexColumn>
            <Content>
                {i18nFilter()("mmx.mobile.new.algo.subtitle.filters.tooltip.content")}
            </Content>
        </FlexColumn>
    );

    return (
        <PlainTooltip maxWidth={302} tooltipContent={tooltipContent} placement="bottom">
            <IconWrapper>
                <StyledAlertIcon iconName="alerts" />
            </IconWrapper>
        </PlainTooltip>
    );
};

SWReactRootComponent(MMXAlertWithPlainTooltip, "MMXAlertWithPlainTooltip");
