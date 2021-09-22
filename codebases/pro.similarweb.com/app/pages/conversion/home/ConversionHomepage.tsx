import { default as React, StatelessComponent } from "react";
import BoxTitle from "../../../../.pro-features/components/BoxTitle/src/BoxTitle";
import AllContexts from "../../../../.pro-features/pages/conversion/components/AllContexts";
import {
    ConversionHomepageContainer,
    PageDescription,
    PageTitle,
    TilesContainer,
} from "../../../../.pro-features/pages/conversion/Homepage/src/StyledComponents";
import {
    FlexColumn,
    FlexRow,
} from "../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { CustomGroupTiles, IGroup } from "./CustomGroupTiles";
import {
    StyledLeaderboardsHeaderContainer,
    StyledPrimaryTitle,
    TileWrapper,
} from "./StyledComponents";
import { ISegmentsData } from "../../../services/conversion/ConversionSegmentsService";
import { GraphLoader } from "../../../../.pro-features/components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { TrackWithGuidService } from "../../../services/track/TrackWithGuidService";

export interface IConversionHomepageProps {
    isLoading: boolean;
    customGroups: IGroup[];
    onCreate: () => void;
    translate: (key: string, params?) => string;
    track: (a?, b?, c?, d?) => void;
    components?: { ConversionLeaderboardContainer: any };
    segments?: ISegmentsData;
}

export const ConversionHomepage: StatelessComponent<IConversionHomepageProps> = ({
    isLoading,
    customGroups,
    onCreate,
    translate,
    track,
    components,
    segments,
}) => {
    const { ConversionLeaderboardContainer } = components;
    return (
        <AllContexts
            translate={translate}
            track={track}
            trackWithGuid={TrackWithGuidService.trackWithGuid}
        >
            <ConversionHomepageContainer>
                <FlexColumn>
                    <PageTitle>{translate("conversion.homepage.title")}</PageTitle>
                    <PageDescription>{translate("conversion.homepage.desc")}</PageDescription>

                    <StyledLeaderboardsHeaderContainer>
                        <StyledPrimaryTitle>
                            <BoxTitle
                                tooltip={translate("conversion.homepage.customgroup.tooltip")}
                            >
                                {translate("conversion.homepage.customgroup.title")}
                            </BoxTitle>
                        </StyledPrimaryTitle>
                    </StyledLeaderboardsHeaderContainer>
                    {isLoading ? (
                        <TilesContainer>
                            <TileWrapper>
                                <GraphLoader height={294} width={"100%"} />
                            </TileWrapper>
                            <TileWrapper>
                                <GraphLoader height={294} width={"100%"} />
                            </TileWrapper>
                            <TileWrapper>
                                <GraphLoader height={294} width={"100%"} />
                            </TileWrapper>
                        </TilesContainer>
                    ) : (
                        [
                            <CustomGroupTiles
                                key={"customgrouptiles"}
                                segments={segments}
                                customGroups={customGroups}
                                onCreate={onCreate}
                            />,
                            <ConversionLeaderboardContainer
                                key={"conversionleaderboard"}
                                segments={segments}
                            />,
                        ]
                    )}
                </FlexColumn>
            </ConversionHomepageContainer>
        </AllContexts>
    );
};
