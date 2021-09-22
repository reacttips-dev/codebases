import type SigsInfo from '../store/schema/SigsInfo';
import type SxSExtendedViewState from '../store/schema/SxSExtendedViewState';
import type SxSReadingPaneState from '../store/schema/SxSReadingPaneState';
import type { SxSCustomization } from '../store/schema/SxSStore';
import type { ClientItemId } from 'owa-client-ids';
import { action } from 'satcheljs';

export const onSxSReadingPaneChange = action(
    'onSxSReadingPaneChange',
    (readingPaneState: SxSReadingPaneState | null, sxsId: string) => ({
        readingPaneState,
        sxsId,
    })
);

export const onBeforeSxSReadingPaneChange = action(
    'onBeforeSxSReadingPaneChange',
    (id: string) => ({
        id,
    })
);

export const onSxSChangeOrClose = action(
    'onSxSChangeOrClose',
    (selectedLinkId: string | null, isSelectedLinkReadOnly?: boolean) => ({
        selectedLinkId,
        isSelectedLinkReadOnly,
    })
);

export const showSxS = action(
    'showSxS',
    (
        customization: SxSCustomization,
        extendedViewState: SxSExtendedViewState,
        editState: {
            editAllowed: boolean;
            itemId: ClientItemId;
            isDraft: boolean;
        },
        selectedLinkId: string,
        sxsId: string,
        sigsInfo?: SigsInfo
    ) => ({
        customization,
        extendedViewState,
        editState,
        selectedLinkId,
        sxsId,
        sigsInfo,
    })
);

export const closeSxS = action('closeSxS');

export const onComposeStateChange = action(
    'onComposeStateChange',
    (composeId: string | null, sxsId: string) => ({
        composeId,
        sxsId,
    })
);

export const cloneSxSStore = action('cloneSxSStore', (sxsId: string, newSxSId: string) => ({
    sxsId,
    newSxSId,
}));

export const onCustomizationChange = action(
    'onCustomizationChange',
    (customization: SxSCustomization, sxsId: string) => ({
        customization,
        sxsId,
    })
);
