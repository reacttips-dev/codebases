import React from "react";
import { StyledListPageHeader } from "./styles";
import InfoSection from "../InfoSection/InfoSection";
import ControlsSectionContainer from "../ControlsSection/ControlsSectionContainer";

const ListPageHeader = () => {
    return (
        <StyledListPageHeader>
            <InfoSection />
            <ControlsSectionContainer />
        </StyledListPageHeader>
    );
};

export default ListPageHeader;
