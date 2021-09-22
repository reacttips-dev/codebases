import {
    getOptionsForFeature,
    OwsOptionsFeatureType,
    SurfaceActionsOptions,
} from 'owa-outlook-service-options';

export const isComposeAddinPinned = (addinId: string): boolean => {
    const surfaceActionsOptions = getOptionsForFeature<SurfaceActionsOptions>(
        OwsOptionsFeatureType.SurfaceActions
    );
    return !!~surfaceActionsOptions.composeSurfaceAddins.indexOf(addinId);
};

export const isReadAddinPinned = (addinId: string): boolean => {
    const surfaceActionsOptions = getOptionsForFeature<SurfaceActionsOptions>(
        OwsOptionsFeatureType.SurfaceActions
    );
    return !!~surfaceActionsOptions.readSurfaceAddins.indexOf(addinId);
};
