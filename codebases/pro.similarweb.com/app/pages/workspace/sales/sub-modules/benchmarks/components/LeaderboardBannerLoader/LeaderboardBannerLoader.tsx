import React from "react";
import { CircularLoader } from "@similarweb/ui-components/dist/circular-loader";
import { colorsPalettes } from "@similarweb/styles";
import { StyledBannerLoader } from "./styles";

const LeaderboardBannerLoader = () => {
    const options = {
        svg: {
            stroke: colorsPalettes.midnight["50"],
            strokeWidth: "4",
            r: 21,
            cx: "50%",
            cy: "50%",
        },
        style: {
            width: 46,
            height: 46,
        },
    };

    return (
        <StyledBannerLoader>
            <CircularLoader options={options} />
        </StyledBannerLoader>
    );
};

export default LeaderboardBannerLoader;
