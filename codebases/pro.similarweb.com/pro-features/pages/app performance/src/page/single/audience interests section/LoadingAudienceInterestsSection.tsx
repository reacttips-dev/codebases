import {
    ButtonPlaceholderLoader,
    PixelPlaceholderLoader,
} from "@similarweb/ui-components/dist/placeholder-loaders";
import * as React from "react";
import { StatelessComponent } from "react";
import { StyledHeader } from "../../StyledComponents";
import { AudienceLoadersContainer, CategoryRow, TopApps } from "./StyledComponents";

const LoadingAudienceInterestsSection: StatelessComponent<any> = () => {
    return (
        <AudienceLoadersContainer>
            <StyledHeader>
                <PixelPlaceholderLoader width={185} height={22} className="px-lod1" />
                <PixelPlaceholderLoader width={110} height={14} />
            </StyledHeader>
            <PixelPlaceholderLoader width={"100%"} height={3} className="px-lod3" />
            <LoaderRow idx="0" />
            <LoaderRow idx="2" />
            <LoaderRow idx="3" />
            <LoaderRow idx="4" last={true} />
        </AudienceLoadersContainer>
    );
};
LoadingAudienceInterestsSection.displayName = "LoadingAudienceInterestsSection";
export default LoadingAudienceInterestsSection;

export const LoaderRow: any = ({ idx, last }) => {
    return [
        <CategoryRow key={"r" + idx} loading={true}>
            <PixelPlaceholderLoader width={110} height={14} />
            <PixelPlaceholderLoader width={"25%"} height={14} className="px-lod42" />
            <TopApps>
                <PixelPlaceholderLoader width={32} height={32} className="px-lod43" />
                <PixelPlaceholderLoader width={32} height={32} className="px-lod43" />
                <PixelPlaceholderLoader width={32} height={32} className="px-lod43" />
                <PixelPlaceholderLoader width={32} height={32} className="px-lod43" />
                <PixelPlaceholderLoader width={32} height={32} className="px-lod43" />
            </TopApps>
            <ButtonPlaceholderLoader className="px-lod44" />
        </CategoryRow>,
        last ? null : <PixelPlaceholderLoader key={"b" + idx} width={"100%"} height={3} />,
    ];
};
LoaderRow.displayName = "LoaderRow";
