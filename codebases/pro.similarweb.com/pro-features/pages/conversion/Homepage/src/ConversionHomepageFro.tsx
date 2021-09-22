import { default as React, StatelessComponent } from "react";
import { FlexColumn, FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";
import AllContexts from "../../components/AllContexts";
import { IGroupTile, SWGroupTiles } from "./components/SWGroupTiles";
import {
    ConversionHomepageContainer,
    PageDescription,
    PageTitle,
    TilesContainer,
} from "./StyledComponents";
import { GraphLoader } from "../../../../components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { TileWrapper } from "../../../../../app/pages/conversion/home/StyledComponents";
import { TrackWithGuidService } from "../../../../../app/services/track/TrackWithGuidService";

export interface IConversionHomepageFroProps {
    isLoading: boolean;
    tilesProps: IGroupTile[];
    translate: (key: string, params?) => string;
    track: (a?, b?, c?, d?) => void;
}

export const ConversionHomepageFro: StatelessComponent<IConversionHomepageFroProps> = ({
    isLoading,
    tilesProps,
    translate,
    track,
}) => {
    return (
        <AllContexts
            translate={translate}
            trackWithGuid={TrackWithGuidService.trackWithGuid}
            track={track}
        >
            <ConversionHomepageContainer>
                <FlexColumn>
                    <PageTitle>{translate("conversion.homepage.title")}</PageTitle>
                    <PageDescription>{translate("conversion.homepage.desc")}</PageDescription>
                    {isLoading ? (
                        <TilesContainer>
                            <TileWrapper>
                                <GraphLoader height={294} width={"100%"} />
                            </TileWrapper>
                            ,
                            <TileWrapper>
                                <GraphLoader height={294} width={"100%"} />
                            </TileWrapper>
                            ,
                            <TileWrapper>
                                <GraphLoader height={294} width={"100%"} />
                            </TileWrapper>
                        </TilesContainer>
                    ) : (
                        <SWGroupTiles tilesProps={tilesProps} />
                    )}
                </FlexColumn>
            </ConversionHomepageContainer>
        </AllContexts>
    );
};
