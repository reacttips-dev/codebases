import React from "react";
import styled from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { ProgressBar } from "components/React/ProgressBar";
import { Text } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";

const AffinityCellContainer = styled(FlexRow)`
    align-items: center;
    .sw-progress-bar {
        flex: 1;
    }
`;

const TextFixedSize = styled(Text)`
    width: 24px;
    margin: auto 12px auto 0;
`;

export const KeywordCompetitorsAffinityCell = ({
    row,
    value,
}: {
    row?: { Affinity };
    value?: number;
}) => {
    // can be value or a full row
    const affinity = value || row?.Affinity;

    return (
        <AffinityCellContainer justifyContent="space-between">
            <TextFixedSize>{Math.round(affinity)}</TextFixedSize>
            <ProgressBar width={Math.round(affinity)} height={8} />
        </AffinityCellContainer>
    );
};
