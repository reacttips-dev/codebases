import {
    ButtonPlaceholderLoader,
    PixelPlaceholderLoader,
} from "@similarweb/ui-components/dist/placeholder-loaders";
import * as React from "react";
import { StatelessComponent } from "react";
import { FlexColumn } from "../../../../../../styled components/StyledFlex/src/StyledFlex";
import { DownloadsLoadersContainer, GraphInfoLoaders } from "./StyledComponents";

const LoadingDownloadsSection: StatelessComponent<any> = () => {
    return (
        <DownloadsLoadersContainer>
            <FlexColumn>
                <PixelPlaceholderLoader width={185} height={22} className="px-lod1" />
                <PixelPlaceholderLoader width={110} height={14} className="px-lod2" />
            </FlexColumn>
            <PixelPlaceholderLoader width={"100%"} height={3} className="px-lod3" />
            <GraphInfoLoaders>
                <PixelPlaceholderLoader width={"100%"} height={264} className="px-lod4" />
                <FlexColumn>
                    <PixelPlaceholderLoader width={154} height={20} className="px-lod5" />
                    <PixelPlaceholderLoader width={259} height={31} className="px-lod6" />
                </FlexColumn>
            </GraphInfoLoaders>
            <PixelPlaceholderLoader width={"100%"} height={3} className="px-lod7" />
            <ButtonPlaceholderLoader className="px-lod8" />
        </DownloadsLoadersContainer>
    );
};
LoadingDownloadsSection.displayName = "LoadingDownloadsSection";
export default LoadingDownloadsSection;
