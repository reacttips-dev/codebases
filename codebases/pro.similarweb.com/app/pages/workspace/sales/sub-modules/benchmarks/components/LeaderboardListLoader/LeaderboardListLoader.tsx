import React from "react";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { StyledListLoader } from "./styles";

const LeaderboardListLoader = () => {
    return (
        <StyledListLoader>
            <PixelPlaceholderLoader width={150} height={13} />
            <PixelPlaceholderLoader width={150} height={13} />
            <PixelPlaceholderLoader width={150} height={13} />
            <PixelPlaceholderLoader width={150} height={13} />
            <PixelPlaceholderLoader width={150} height={13} />
            <PixelPlaceholderLoader width={150} height={13} />
            <PixelPlaceholderLoader width={150} height={13} />
        </StyledListLoader>
    );
};

export default LeaderboardListLoader;
