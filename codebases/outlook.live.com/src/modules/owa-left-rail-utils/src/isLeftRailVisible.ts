import { isMultiAccountScenario } from './isMultiAccountScenario';
import { isCloudCacheScenario } from './isCloudCacheScenario';
import { Module } from 'owa-workloads';
import isOfficeRailEnabled from './isOfficeRailEnabled';

export function isLeftRailVisible(selectedModule: Module) {
    return (
        isCloudCacheScenario() || isMultiAccountScenario() || isOfficeRailEnabled(selectedModule)
    );
}
