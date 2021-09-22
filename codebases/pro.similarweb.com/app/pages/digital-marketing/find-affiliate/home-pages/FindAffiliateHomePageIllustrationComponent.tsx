import React, { FunctionComponent } from "react";
import {
    IllustrationContainer,
    IllustrationWrapper,
    NoBorderTileStyled,
} from "pages/digital-marketing/find-affiliate/home-pages/StyledComponents";
import { SWReactIcons } from "@similarweb/icons";

interface IFindAffiliateHomePageTemplateProps {
    artworkConfig: { icon: JSX.Element; text: string; title: string }[];
}

export const FindAffiliateHomePageIllustrationComponent: FunctionComponent<IFindAffiliateHomePageTemplateProps> = ({
    artworkConfig,
}) => {
    const arrowRight = {
        icon: <SWReactIcons iconName="arrow-right" size={"sm"} />,
        text: null,
        title: null,
    };

    return (
        <IllustrationWrapper>
            <IllustrationContainer>
                {artworkConfig.map((item, index) => (
                    <>
                        <NoBorderTileStyled key={`${index}_${item.text}`} {...item} />
                        {index < artworkConfig.length - 1 && (
                            <NoBorderTileStyled key={index} {...arrowRight} width={70} />
                        )}
                    </>
                ))}
            </IllustrationContainer>
        </IllustrationWrapper>
    );
};
