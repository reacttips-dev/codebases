import React from "react";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { StyledRankingAxisLoader } from "./styles";
import { LOADER_HEIGHT, LOADER_WIDTH } from "./constants";

const RankingAxisLoader = () => {
    return (
        <StyledRankingAxisLoader>
            <PixelPlaceholderLoader width={LOADER_WIDTH} height={LOADER_HEIGHT} />
        </StyledRankingAxisLoader>
    );
};

export default RankingAxisLoader;
