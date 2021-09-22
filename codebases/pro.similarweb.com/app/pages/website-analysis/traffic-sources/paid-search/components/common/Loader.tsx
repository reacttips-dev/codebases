import { CircularLoader } from "components/React/CircularLoader";
import React from "react";
import styled from "styled-components";
import { CenteredFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { colorsPalettes } from "@similarweb/styles";

const LoaderWrapper = styled(CenteredFlexRow)`
    height: 100%;
`;

export const Loader = () => {
    return (
        <LoaderWrapper>
            <CircularLoader
                options={{
                    svg: {
                        stroke: colorsPalettes.midnight[50],
                        strokeWidth: "4",
                        r: 21,
                        cx: "50%",
                        cy: "50%",
                    },
                    style: {
                        width: 46,
                        height: 46,
                    },
                }}
            />
        </LoaderWrapper>
    );
};
