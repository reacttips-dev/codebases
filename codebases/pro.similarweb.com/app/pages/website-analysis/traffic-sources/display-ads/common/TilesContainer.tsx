import ScrollListener from "components/React/ScrollListener/ScrollListener";
import React, { FC, useState } from "react";
import { DefaultFetchService } from "services/fetchService";
import { stringify } from "querystring";
import Tiles from "pages/website-analysis/traffic-sources/ads/components/Tiles/Tiles";
import { CircularLoader } from "components/React/CircularLoader";
import { StyledLoaderWrapper } from "pages/website-analysis/traffic-sources/display-ads/common/StyledComponents";
import { ITilesContainer } from "pages/website-analysis/traffic-sources/display-ads/common/displayAdsTypes";

const fetchService = DefaultFetchService.getInstance();

export const TilesContainer: FC<ITilesContainer> = ({
    params,
    selectedFilters,
    tilesEndpoint,
    initialTilesList,
}) => {
    const [pagesToRender, setPagesToRender] = useState<number>(1);
    const [appendToList, setAppendToList] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEndOfData, setIsEndOfData] = useState<boolean>(false);

    const listToRender = [...initialTilesList, ...appendToList];
    const tilesToRender = listToRender.slice(0, params["pageSize"] * pagesToRender);

    const transformData = (response) => {
        return response.Data
            ? response.Data.map((item) => {
                  return {
                      Size: `${item.Width}x${item.Height}`,
                      ...item,
                  };
              })
            : [];
    };

    const renderMoreTiles = () => {
        setIsLoading(true);

        if (!isEndOfData) {
            fetchService
                .post<{ Data: any }>(
                    `${tilesEndpoint}?${stringify({
                        ...params,
                        page: pagesToRender + 1,
                    })}`,
                    {
                        Publishers: selectedFilters.selectedPublishers,
                        AdNetworks: selectedFilters.selectedAdNetworks,
                        Campaigns: selectedFilters.selectedCampaigns,
                    },
                )
                .then((response) => {
                    const transformedData = transformData(response);
                    if (transformedData.length > 0) {
                        setPagesToRender(pagesToRender + 1);
                    } else if (transformedData.length === 0) {
                        setIsEndOfData(true);
                    }
                    setAppendToList([...appendToList, ...transformedData]);
                    setIsLoading(false);
                });
        }
    };

    return (
        <>
            <ScrollListener threshold={0} onThresholdReached={renderMoreTiles}>
                <Tiles list={tilesToRender} />
            </ScrollListener>
            <StyledLoaderWrapper height={100}>
                {!isEndOfData && isLoading && (
                    <CircularLoader
                        options={{
                            svg: {
                                cx: "50%",
                                cy: "50%",
                                r: "14",
                                stroke: "#dedede",
                                strokeWidth: "3",
                            },
                            style: {
                                width: "36px",
                                height: "36px",
                            },
                        }}
                    />
                )}
            </StyledLoaderWrapper>
        </>
    );
};
