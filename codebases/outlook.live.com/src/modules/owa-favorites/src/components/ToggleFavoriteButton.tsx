import { addToFavoritesText } from 'owa-locstrings/lib/strings/addtofavoritestext.locstring.json';
import { removeFromFavoritesText } from 'owa-locstrings/lib/strings/removefromfavoritestext.locstring.json';
import { addToFavoritesCategoryText } from 'owa-locstrings/lib/strings/addtofavoritescategorytext.locstring.json';
import { removeFromFavoritesCategoryText } from 'owa-locstrings/lib/strings/removefromfavoritescategorytext.locstring.json';
import loc from 'owa-localize';
import { StarCharm } from 'owa-star-charm';
import { observer } from 'mobx-react-lite';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

import * as React from 'react';

export interface ToggleFavoriteButtonProps {
    isInFavorites: boolean;
    isClickDisabled?: boolean;
    animate?: boolean;
    iconStyles?: string;
    buttonStyles?: string;
    spinnerStyles?: string;
    tooltipStyles?: string;
    onClick?: (evt: React.MouseEvent<unknown>) => void;
    isCategory?: boolean;
}

const ToggleFavoriteButton = observer(function ToggleFavoriteButton(
    props: ToggleFavoriteButtonProps
) {
    const {
        isInFavorites,
        isClickDisabled,
        animate,
        iconStyles,
        buttonStyles,
        spinnerStyles,
        tooltipStyles,
        onClick,
        isCategory,
    } = props;

    // We dont support add/remove favorites in explicit logon scenarios
    const userConfiguration = getUserConfiguration();
    if (userConfiguration?.SessionSettings?.IsExplicitLogon) {
        return null;
    }

    const starredText = isCategory
        ? loc(removeFromFavoritesCategoryText)
        : loc(removeFromFavoritesText);
    const unstarredText = isCategory ? loc(addToFavoritesCategoryText) : loc(addToFavoritesText);

    return (
        <StarCharm
            isStarred={isInFavorites}
            onClick={onClick}
            isClickDisabled={isClickDisabled}
            animate={animate}
            iconStyles={iconStyles}
            buttonStyles={buttonStyles}
            spinnerStyles={spinnerStyles}
            tooltipStyles={tooltipStyles}
            ariaLabelText={isInFavorites ? starredText : unstarredText}
            tooltip={{
                starred: starredText,
                unstarred: unstarredText,
            }}
        />
    );
});
export default ToggleFavoriteButton;
