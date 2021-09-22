import React from "react";
import { StyledLoadingContainer } from "./styles";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";

type VisualisationLoaderProps = {
    height: number;
    className: string;
};

const LOADER_HEIGHT = 12;
const VisualisationLoader = (props: VisualisationLoaderProps) => {
    const { className, height } = props;

    return (
        <StyledLoadingContainer style={{ height }}>
            <div className={className}>
                <PixelPlaceholderLoader width={270} height={LOADER_HEIGHT} />
                <PixelPlaceholderLoader width={220} height={LOADER_HEIGHT} />
                <PixelPlaceholderLoader width={220} height={LOADER_HEIGHT} />
                <PixelPlaceholderLoader width={270} height={LOADER_HEIGHT} />
                <PixelPlaceholderLoader width={250} height={LOADER_HEIGHT} />
            </div>
        </StyledLoadingContainer>
    );
};

export default VisualisationLoader;
