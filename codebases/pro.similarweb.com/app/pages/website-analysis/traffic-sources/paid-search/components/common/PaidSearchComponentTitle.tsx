import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { SecondaryBoxTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { mixins } from "@similarweb/styles";
import { StyledHeaderTitle } from "pages/website-analysis/traffic-sources/paid-search/components/common/StyledComponents";

interface IPaidSearchComponentTitleProps {
    title: string;
    tooltip: string;
    filters?: any[];
}

const StyledSubtitle = styled(BoxSubtitle)`
    font-size: 12px;
`;

const SubTitlePaidSearch = styled(StyledBoxSubtitle)`
    margin-top: 6px;
    ${mixins.setFont({ $size: 14 })}
`;

export const PaidSearchComponentTitle: FunctionComponent<IPaidSearchComponentTitleProps> = ({
    title,
    tooltip,
    filters,
}) => {
    return (
        <FlexRow justifyContent="space-between">
            <FlexColumn>
                <StyledHeaderTitle>
                    <SecondaryBoxTitle tooltip={tooltip}>{title}</SecondaryBoxTitle>
                    {filters && (
                        <SubTitlePaidSearch>
                            <StyledSubtitle filters={filters} />
                        </SubTitlePaidSearch>
                    )}
                </StyledHeaderTitle>
            </FlexColumn>
        </FlexRow>
    );
};
