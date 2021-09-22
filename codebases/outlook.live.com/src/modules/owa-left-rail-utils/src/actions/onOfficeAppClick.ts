import { action } from 'satcheljs';
import type { OfficeApp } from '../store/schema/OfficeApp';
import { Module } from 'owa-workloads';

export default action('onOfficeAppClick', (app: OfficeApp, currentlySelectedModule?: Module) => ({
    app,
    currentlySelectedModule,
}));
