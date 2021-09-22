import {
    ListItemPlaceholderLoader,
    PixelPlaceholderLoader,
    TitlePlaceholderLoader,
} from "@similarweb/ui-components/dist/placeholder-loaders";
import * as React from "react";
import { StatelessComponent } from "react";
import { FlexRow } from "../../../../../../styled components/StyledFlex/src/StyledFlex";
import { HeaderContainer, LoadersBody, LoadingMetric } from "./StyledComponents";

const LoadingHeaderSection: StatelessComponent<any> = () => {
    return (
        <HeaderContainer>
            <LoadersBody>
                <ListItemPlaceholderLoader className="li-lod" />
                <PixelPlaceholderLoader width={664} height={22} className="px-lod lod-100" />
                <PixelPlaceholderLoader width={640} height={14} className="px-lod lod-100" />
                <PixelPlaceholderLoader width={640} height={14} className="px-lod lod-100" />
            </LoadersBody>
            <PixelPlaceholderLoader width={"100%"} height={3} />
            <FlexRow>
                <LoadingMetric>
                    <TitlePlaceholderLoader className="lod-100" />
                </LoadingMetric>
                <LoadingMetric>
                    <TitlePlaceholderLoader className="lod-100" />
                </LoadingMetric>
                <LoadingMetric>
                    <TitlePlaceholderLoader className="lod-100" />
                </LoadingMetric>
            </FlexRow>
        </HeaderContainer>
    );
};
LoadingHeaderSection.displayName = "LoadingHeaderSection";
export default LoadingHeaderSection;
