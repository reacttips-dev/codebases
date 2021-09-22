import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { Injector } from "common/ioc/Injector";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { SecondaryBoxTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import {
    StyledHeaderTitle,
    SubTitleWrapper,
    StyledSubtitle,
    AddToDashboardWrapper,
} from "./StyledComponents";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { SwNavigator } from "common/services/swNavigator";

interface IWidgetTitleProps {
    title: string;
    tooltip?: string;
    filters?: any[];
    addToDashboard?(): void;
}
export const WidgetTitle: FunctionComponent<IWidgetTitleProps> = ({
    title,
    tooltip,
    filters,
    addToDashboard,
}) => {
    return (
        <FlexRow justifyContent="space-between">
            <FlexColumn>
                <StyledHeaderTitle>
                    <SecondaryBoxTitle tooltip={tooltip}>{title}</SecondaryBoxTitle>
                    {filters && (
                        <SubTitleWrapper>
                            <StyledSubtitle filters={filters} />
                        </SubTitleWrapper>
                    )}
                </StyledHeaderTitle>
            </FlexColumn>
            {addToDashboard && (
                <AddToDashboardWrapper>
                    <AddToDashboardButton onClick={addToDashboard} />
                </AddToDashboardWrapper>
            )}
        </FlexRow>
    );
};
