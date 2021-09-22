import * as React from "react";
import { FunctionComponent } from "react";
import {
    RecommendationKeywordTileStyled,
    RecommendationKeywordStyled,
    RecommendationKeywordDataStyled,
    RecommendationKeywordDataTitleStyled,
    RecommendationKeywordDataValueStyled,
} from "./StyledComponents";
import { Button } from "@similarweb/ui-components/dist/button";
import { HoverIcon } from "components/core cells/src/CoreAppCell/StyledComponents";

interface IRecommendationKeywordTileProps {
    keyword: string;
    link: string;
    volume: string;
    cpc: string;
    onClick: VoidFunction;
    isLoading: boolean;
}

export const RecommendationKeywordTile: FunctionComponent<IRecommendationKeywordTileProps> = (
    props,
) => {
    const { keyword, link, volume, cpc, onClick, isLoading = false } = props;
    return (
        <RecommendationKeywordTileStyled>
            <RecommendationKeywordStyled>
                <>
                    <span>{keyword}</span>{" "}
                    <a href={link} target="_blank">
                        <HoverIcon iconName="link-out" />
                    </a>
                </>
            </RecommendationKeywordStyled>
            <RecommendationKeywordDataStyled>
                <RecommendationKeywordDataTitleStyled>Volume</RecommendationKeywordDataTitleStyled>
                <RecommendationKeywordDataValueStyled>
                    {volume}
                </RecommendationKeywordDataValueStyled>
            </RecommendationKeywordDataStyled>
            <RecommendationKeywordDataStyled>
                <RecommendationKeywordDataTitleStyled>CPC</RecommendationKeywordDataTitleStyled>
                <RecommendationKeywordDataValueStyled>{cpc}</RecommendationKeywordDataValueStyled>
            </RecommendationKeywordDataStyled>
            <Button
                width={70}
                style={{ minWidth: "70px" }}
                type={isLoading ? "primary" : "outlined"}
                isLoading={isLoading}
                isDisabled={isLoading}
                onClick={onClick}
            >
                ADD
            </Button>
        </RecommendationKeywordTileStyled>
    );
};
