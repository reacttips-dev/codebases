import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { SecondaryBoxTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import { mixins } from "@similarweb/styles";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";

interface IDisplayOverviewTitleComponentProps {
    title: string;
    tooltip: string;
    filters?: any[];
}

const StyledHeaderTitle: any = styled(FlexColumn).attrs({
    "data-automation-box-title": true,
})`
    ${InfoIcon} {
        line-height: 1.55;
    }
`;

const StyledSubtitle = styled(BoxSubtitle)`
    font-size: 12px;
`;

const SubTitleContainer = styled(StyledBoxSubtitle)`
    margin-top: 6px;
    ${mixins.setFont({ $size: 14 })}
`;

export const DisplayOverviewTitleComponent: FunctionComponent<IDisplayOverviewTitleComponentProps> = ({
    title,
    tooltip,
    filters,
}) => {
    return (
        <StyledHeaderTitle>
            <SecondaryBoxTitle tooltip={tooltip}>{title}</SecondaryBoxTitle>
            {filters && (
                <SubTitleContainer>
                    <StyledSubtitle filters={filters} />
                </SubTitleContainer>
            )}
        </StyledHeaderTitle>
    );
};
