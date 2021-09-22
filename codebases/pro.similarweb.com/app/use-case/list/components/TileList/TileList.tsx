import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { useTrack } from "components/WithTrack/src/useTrack";
import React, { FC, useCallback } from "react";
import useCaseService from "use-case/common/services/useCaseService/useCaseService";
import * as SC from "use-case/list/components/StyledComponents";
import { Tile } from "use-case/list/components/TileList/Tile";
import { ITile, InputScreenParams } from "use-case/common/types";
import { asTwoChunks } from "use-case/list/utils/arrays";

const isUseCaseTemplate = (url: string): boolean =>
    url.includes("{website}") || url.includes("{competitors}");

const inputUrl = (
    swNavigator: SwNavigator,
    backUrl: string,
    inputScreenParams: InputScreenParams,
) =>
    swNavigator.href("useCase-input", {
        websiteTitle: inputScreenParams?.website?.title,
        websiteSubtitle: inputScreenParams?.website?.subtitle,
        websiteCta: inputScreenParams?.website?.cta,
        competitorsTitle: inputScreenParams?.competitors?.title,
        competitorsSubTitle: inputScreenParams?.competitors?.subtitle,
        competitorsCta: inputScreenParams?.competitors?.cta,
        backUrl: encodeURIComponent(backUrl),
    });

interface ITileList {
    items: ITile[];
    translate: (key: string) => string;
}

export const TileList: FC<ITileList> = ({ items, translate }) => {
    const swNavigator: SwNavigator = Injector.get("swNavigator");
    const [track] = useTrack();
    const trackTileClick = useCallback(
        (name: string, href: string) => {
            track(
                "use case screen",
                "click",
                `${name}//${useCaseService.isOnboarding() ? "onboarding" : "return"}`,
            );
            window.location.href = href;
        },
        [track],
    );

    return (
        <SC.Tiles>
            {asTwoChunks<ITile>(items).map((chunk, i) => (
                <SC.TileRow key={i}>
                    {chunk.map(
                        ({
                            title,
                            description,
                            image,
                            href: hrefTemplate,
                            id,
                            inputScreenParams,
                        }) => {
                            const href = isUseCaseTemplate(hrefTemplate)
                                ? inputUrl(swNavigator, hrefTemplate, inputScreenParams)
                                : hrefTemplate;

                            return (
                                <Tile
                                    key={id}
                                    id={id}
                                    title={translate(title)}
                                    description={translate(description)}
                                    href={href}
                                    onClick={trackTileClick}
                                >
                                    <img src={image} alt="" />
                                </Tile>
                            );
                        },
                    )}
                </SC.TileRow>
            ))}
        </SC.Tiles>
    );
};
