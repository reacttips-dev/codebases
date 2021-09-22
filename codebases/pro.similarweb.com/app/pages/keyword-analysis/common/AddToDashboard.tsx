import React from "react";
import styled from "styled-components";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { addToDashboard as handleAddToDashboard } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";

const Container = styled.div`
    position: absolute;
    top: -9px;
    right: -10px;
`;
export const AddToDashboard = ({
    webSource,
    type,
    metric,
    onOpen = (modal) => null,
    overrideAddToDasboardParams = {},
}) => {
    const onClick = () => {
        handleAddToDashboard({
            webSource,
            type,
            metric,
            onOpen,
            overrideAddToDashboardParams: overrideAddToDasboardParams,
            modelType: "fromKeyword",
        });
    };

    return (
        <Container>
            <AddToDashboardButton onClick={onClick} />
        </Container>
    );
};
