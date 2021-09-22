import * as React from "react";
import { StatelessComponent } from "react";
import {
    ButtonPlaceholderLoader,
    PixelPlaceholderLoader,
} from "@similarweb/ui-components/dist/placeholder-loaders";
import { FlexColumn, FlexRow } from "../../../../../../styled components/StyledFlex/src/StyledFlex";
import { DownloadsLoadersContainer } from "../downloads section/StyledComponents";
import styled from "styled-components";

const ContentLoader = styled(FlexRow)`
    height: 323px;
    justify-content: space-between;
    padding: 25px 25px 0 25px;
`;

const ItemLoaderContainer = styled(FlexColumn)`
    height: 54px;
    justify-content: space-between;
`;

const ButtonContainer = styled.div`
    .px-lod8 {
        bottom: 22.5px;
        right: 25px;
    }
`;

const ItemLoader = () => (
    <ItemLoaderContainer>
        <PixelPlaceholderLoader width={110} height={14} className="px-lod lod-100" />
        <PixelPlaceholderLoader width={70} height={28} className="px-lod lod-100" />
    </ItemLoaderContainer>
);

export const SectionLoader = () => {
    return (
        <DownloadsLoadersContainer>
            <FlexColumn>
                <PixelPlaceholderLoader width={185} height={22} className="px-lod1" />
                <PixelPlaceholderLoader width={110} height={14} className="px-lod2" />
            </FlexColumn>
            <PixelPlaceholderLoader width={"100%"} height={3} className="px-lod3" />
            <ContentLoader>
                <ItemLoader />
                <ItemLoader />
                <ItemLoader />
                <ItemLoader />
            </ContentLoader>
            <PixelPlaceholderLoader width={"100%"} height={3} className="px-lod7" />
            <ButtonContainer>
                <ButtonPlaceholderLoader className="px-lod8" />
            </ButtonContainer>
        </DownloadsLoadersContainer>
    );
};
