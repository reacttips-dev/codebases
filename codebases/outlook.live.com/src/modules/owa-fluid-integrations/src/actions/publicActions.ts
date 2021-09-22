import { action } from 'satcheljs';
import type { FluidOwaSource } from 'owa-fluid-validations';

export const onFluidComponentRendered = action(
    'onFluidComponentRendered',
    (owaSource: FluidOwaSource, isCreateNew: boolean, viewStateId: string | undefined) => ({
        owaSource,
        isCreateNew,
        viewStateId,
    })
);
