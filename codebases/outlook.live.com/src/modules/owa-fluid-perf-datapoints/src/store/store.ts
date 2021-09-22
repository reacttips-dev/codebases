import { createStore } from 'satcheljs';
import type { OwaFluidDatapointsSchema, OwaFluidCheckmark } from './schema';
import { FluidOwaSource } from 'owa-fluid-validations';

const store: OwaFluidDatapointsSchema = {
    checkmarks: new Map<number, OwaFluidCheckmark>(),
    fluidOwaSource: FluidOwaSource.None,
};

export default createStore<OwaFluidDatapointsSchema>('OwaFluidDatapointsSchema', store);
