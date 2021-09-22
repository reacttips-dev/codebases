import { action } from 'satcheljs';

export const setIsContextMenuOpen = action(
    'SET_IS_CONTEXT_MENU_OPEN',
    (linkId: string, value: boolean) => ({
        linkId: linkId,
        value: value,
    })
);

export const resetIsContextMenuOpenForLinks = action(
    'RESET_IS_CONTEXT_MENU_OPEN_FOR_LINKS',
    () => ({})
);

export const updateComposeLinkViewState = action(
    'UPDATE_COMPOSE_LINK_VIEW_STATE',
    (linkId: string, displayName: string, isLinkBeautified: boolean) => ({
        linkId: linkId,
        displayName: displayName,
        isLinkBeautified: isLinkBeautified,
    })
);

export const removeComposeLinkViewState = action(
    'REMOVE_COMPOSE_LINK_VIEW_STATE',
    (linkId: string) => ({
        linkId: linkId,
    })
);
