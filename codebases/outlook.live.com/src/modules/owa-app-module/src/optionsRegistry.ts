import { Module } from 'owa-workloads';
import type { AppBootstrapOptions } from './types/AppBootstrapOptions';
import type { RouteGenerator } from 'owa-router';
import { getCurrentModule } from 'owa-app-module-store';
import { updateModuleForVdirChange } from './utils/updateModuleForVdirChange';

const moduleToMainComponentMap: { [P in Module]?: AppBootstrapOptions } = {};
const moduleToRouteGenerator: { [P in Module]?: RouteGenerator } = {};

export function registerBootstrapOptions(options: AppBootstrapOptions): void {
    const mod = options.appModuleProps!.module;
    if (options.routerOptions) {
        options.routerOptions.routeGenerator.then(generator => {
            moduleToRouteGenerator[mod] = generator;
        });
        options.routerOptions.setModuleForVdir = () => updateModuleForVdirChange(options);

        // We only need to register the global route generator once
        if (Object.keys(moduleToMainComponentMap).length == 0) {
            options.routerOptions.routeGenerator = options.routerOptions.routeGenerator.then(
                () => () => moduleToRouteGenerator[getCurrentModule()!]!()
            );
        }
    }
    moduleToMainComponentMap[mod] = options;
}

export function getBootstrapOptions(mod: Module): AppBootstrapOptions | undefined {
    return moduleToMainComponentMap[mod];
}
