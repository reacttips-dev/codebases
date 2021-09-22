import React, { FunctionComponent } from "react";
import styled from "styled-components";
import {
    FlexRowStyled,
    TitleContainer,
} from "pages/digital-marketing/find-affiliate/by-industry/StyledComponents";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { SecondaryBoxTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import { SubTitleReferrals } from "pages/website-analysis/incoming-traffic/StyledComponents";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import { StyledHeaderTitle } from "pages/conversion/components/benchmarkOvertime/StyledComponents";

interface IReferralComponentTitleProps {
    title: string;
    tooltip: string;
    filters?: any[];
}

const StyledSubtitle = styled(BoxSubtitle)`
    font-size: 12px;
`;

export const ReferralComponentTitle: FunctionComponent<IReferralComponentTitleProps> = ({
    title,
    tooltip,
    filters,
}) => {
    return (
        <TitleContainer>
            <FlexRowStyled>
                <FlexColumn>
                    <StyledHeaderTitle>
                        <SecondaryBoxTitle tooltip={tooltip}>{title}</SecondaryBoxTitle>
                        {filters && (
                            <SubTitleReferrals>
                                <StyledSubtitle filters={filters} />
                            </SubTitleReferrals>
                        )}
                    </StyledHeaderTitle>
                </FlexColumn>
            </FlexRowStyled>
        </TitleContainer>
    );
};
