import { CircularLoader } from "components/React/CircularLoader";
import React from "react";
import styled from "styled-components";

const LoaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
`;

export const Loader = () => {
    return (
        <LoaderWrapper>
            <CircularLoader
                options={{
                    svg: {
                        stroke: "#dedede",
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
