import { action } from 'satcheljs';

export const onIsFluidEnabledFetched = action(
    'ON_FLUID_ENABLED_FETCHED',
    (isFluidEnabled: boolean) => ({
        isFluidEnabled: isFluidEnabled,
    })
);

export const preloadFluid = action('PRELOAD_FLUID');
