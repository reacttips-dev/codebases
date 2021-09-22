import { ModulesEnabledForSwitch, Module } from 'owa-workloads';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

const enabledModules: {
    [P in ModulesEnabledForSwitch]: true;
} = {
    Mail: true,
    Calendar: true,
    People: true,
    FilesHub: true,
    AppHost: true,
};

export function isModuleEnabledForModuleSwitch(module: Module) {
    const featureEnabled =
        isHostAppFeatureEnabled('moduleSwitch') ||
        isFeatureEnabled('fwk-module-switch') ||
        isFeatureEnabled('tri-officeRailHost');
    return featureEnabled && enabledModules[module];
}

export function isModuleSwitchEnabled(currentModule: Module, newModule: Module) {
    return (
        isModuleEnabledForModuleSwitch(currentModule) && isModuleEnabledForModuleSwitch(newModule)
    );
}
