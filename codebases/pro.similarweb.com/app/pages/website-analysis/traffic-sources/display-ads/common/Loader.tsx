import { CircularLoader } from "components/React/CircularLoader";
import React from "react";

export const Loader = () => {
    return (
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
    );
};
