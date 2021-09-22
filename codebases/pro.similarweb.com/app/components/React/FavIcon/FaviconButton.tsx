import { colorsPalettes, rgba } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import I18n from "components/React/Filters/I18n";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import * as React from "react";
import { useState } from "react";
import styled from "styled-components";

interface IFaviconButtonProps {
    isPageFavorite?: boolean;
    onFavoriteClick: () => void;
    hoverMessages?: any;
}

export const StarButtonStyle = styled.div`
    #star-full,
    .SWReactIcons svg path {
        fill: ${colorsPalettes.carbon[200]};
    }

    &.white {
        #star-full,
        .SWReactIcons svg path {
            fill: ${colorsPalettes.carbon[0]};
        }
        :hover {
            #star-full,
            .SWReactIcons svg path {
                fill: ${colorsPalettes.carbon[0]};
                opacity: 1;
            }
        }
    }
    #star-outline,
    .SWReactIcons svg path {
        fill: ${colorsPalettes.carbon[200]};
    }

    &.white {
        #star-outline,
        .SWReactIcons svg path {
            fill: ${colorsPalettes.carbon[0]};
        }
    }

    &.white {
        &:hover button {
            background-color: ${rgba(colorsPalettes.carbon[100], 0.2)};
        }
    }

    &:hover button {
        cursor: pointer;
        background-color: ${colorsPalettes.carbon[50]};

        #star-full,
        .SWReactIcons svg path {
            fill: ${colorsPalettes.carbon[200]};
        }
        #star-outline,
        .SWReactIcons svg path {
            fill: ${colorsPalettes.carbon[200]};
        }
    }
`;

export const FaviconButton: React.FC<IFaviconButtonProps> = ({
    isPageFavorite,
    hoverMessages,
    onFavoriteClick,
}) => {
    const [isLocked, setLocked] = useState(false);

    const toggleLocked = (value) => {
        setLocked(value);
    };

    const onClick = () => {
        if (isLocked) {
            return;
        }
        toggleLocked(true);
        onFavoriteClick();
        setTimeout(() => {
            toggleLocked(false);
        }, 2000);
    };

    const getHoverContent = () => {
        const { hoverTitleFavoriteAdd, hoverTitleFavoriteRemove } = hoverMessages;
        return (
            <>
                {!isPageFavorite && <I18n>{hoverTitleFavoriteAdd}</I18n>}
                {isPageFavorite && <I18n>{hoverTitleFavoriteRemove}</I18n>}
            </>
        );
    };

    return (
        <>
            <PlainTooltip
                cssClass="plainTooltip-element PlainTooltip--favoritesStar favorites"
                text={getHoverContent()}
                closePopupOnClick={!isLocked}
                placement="bottom"
            >
                <div>
                    <StarButtonStyle>
                        {!isPageFavorite && (
                            <IconButton
                                iconName="star-outline"
                                type="flat"
                                onClick={onClick}
                                isDisabled={isLocked}
                            />
                        )}
                        {isPageFavorite && (
                            <IconButton
                                iconName="star-full"
                                type="flat"
                                onClick={onClick}
                                isDisabled={isLocked}
                            />
                        )}
                    </StarButtonStyle>
                </div>
            </PlainTooltip>
        </>
    );
};
