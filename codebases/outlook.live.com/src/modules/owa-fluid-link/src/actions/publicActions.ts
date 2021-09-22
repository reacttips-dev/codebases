import { action } from 'satcheljs';
import type { FluidOwaSource } from 'owa-fluid-validations';

export const onFluidFileInserted = action(
    'ON_FLUID_FILE_INSERTED',
    (
        containerId: string,
        owaSource: FluidOwaSource,
        url: string,
        viewStateId: string | undefined
    ) => ({
        containerId,
        owaSource,
        url,
        viewStateId,
    })
);

export const onFluidFileCreationFailed = action(
    'ON_FLUID_FILE_CREATION_FAILED',
    (containerId: string, owaSource: FluidOwaSource, viewStateId: string | undefined) => ({
        containerId,
        owaSource,
        viewStateId,
    })
);

export const onFluidPlaceholderCreated = action(
    'ON_FLUID_PLACEHOLDER_CREATED',
    (containerId: string, owaSource: FluidOwaSource, viewStateId: string | undefined) => ({
        containerId,
        owaSource,
        viewStateId,
    })
);

export const onFluidFileLoadFailure = action(
    'ON_FLUID_FILE_LOAD_FAILURE',
    (owaSource: FluidOwaSource, error: Error, viewStateId: string | undefined) => ({
        owaSource,
        error,
        viewStateId,
    })
);
