import * as React from "react";
import styled from "styled-components";
import { FlexRow } from "../../../../../../styled components/StyledFlex/src/StyledFlex";
import OverallRank from "./OverallRank";
import CategoryRank from "./CategoryRank";

const getRankData = (data) => data.map(({ key, value }) => ({ date: key, value }));
export const StoreIntellegenceSectionWrapper = styled(FlexRow)`
    font-family: Roboto;
    width: 100%;
    display: block;
    margin-right: 0;
    @media (min-width: 761px) {
        display: flex;
        flex-wrap: wrap;
    }
`;
StoreIntellegenceSectionWrapper.displayName = "StoreIntellegenceSectionWrapper";

const StoreIntellegenceSection = ({ data, loading: isLoading, showStoreSearchLink }) => {
    const { overall, category } = (data.ranking || {}) as any;
    return (
        <StoreIntellegenceSectionWrapper>
            <OverallRank data={getRankData(overall || [])} isLoading={isLoading} />
            <CategoryRank data={getRankData(category || [])} isLoading={isLoading} />
        </StoreIntellegenceSectionWrapper>
    );
};

export default StoreIntellegenceSection;
