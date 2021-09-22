import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import * as React from "react";
import { StatelessComponent } from "react";
import BoxSubtitle from "../../../../components/BoxSubtitle/src/BoxSubtitle";
import BoxTitle from "../../../../components/BoxTitle/src/BoxTitle";
import StyledBoxSubtitle from "../../../../styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { LoadingHeader, StyledHeader, StyledHeaderTitle } from "../page/StyledComponents";

const Header: StatelessComponent<any> = ({ loading, title, tooltip, subtitleFilters }) =>
    loading ? (
        <LoadingHeader>
            <PixelPlaceholderLoader width={185} height={22} className="px-lod1" />
            <PixelPlaceholderLoader width={110} height={14} className="px-lod2" />
            <PixelPlaceholderLoader width="100%" height={3} className="px-lod3" />
        </LoadingHeader>
    ) : (
        <StyledHeader>
            <StyledHeaderTitle>
                <BoxTitle tooltip={tooltip}>{title}</BoxTitle>
            </StyledHeaderTitle>
            <StyledBoxSubtitle>
                <BoxSubtitle filters={subtitleFilters} />
            </StyledBoxSubtitle>
        </StyledHeader>
    );
Header.displayName = "Header";
export default Header;
