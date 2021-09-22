import { Module } from 'owa-workloads';
import { getBootstrapOptions, registerBootstrapOptions } from 'owa-app-module/lib/optionsRegistry';
import { getCurrentModule } from 'owa-app-module-store';
import { updateModuleForVdirChange } from 'owa-app-module/lib/utils/updateModuleForVdirChange';
import { registerFontSubsets } from 'owa-icons';
import { getPackageBaseUrl } from 'owa-config';
import { preloadStrategies } from 'owa-shared-bootstrap/lib/preloadStrategies';
import { moduleToConfigMap } from './configRegistry';
import { orchestrator } from 'satcheljs';
import {
    onModuleClick,
    isModuleSwitchEnabled,
    onOfficeAppClick,
    onAppHostHeaderStartSearch,
} from 'owa-left-rail-utils';
import isSupportedOfficeRailApp from 'owa-left-rail-utils/lib/isSupportedOfficeRailApp';
import { registerRouterRoutes } from 'owa-router';
import { setApp } from 'owa-config/lib/bootstrapOptions';
import { getBposNavBarDataAsync } from 'owa-bpos-store';
import { isFeatureEnabled } from 'owa-feature-flags';

let isRunning = false;

orchestrator(onModuleClick, actionMessage => {
    changeModuleIfEnabled(actionMessage.module, actionMessage.currentlySelectedModule);
});

orchestrator(onOfficeAppClick, actionMessage => {
    if (isFeatureEnabled('tri-officeRailHost') && isSupportedOfficeRailApp(actionMessage.app)) {
        changeModuleIfEnabled(
            Module.AppHost,
            actionMessage.currentlySelectedModule || getCurrentModule()!
        );
    }
});

orchestrator(onAppHostHeaderStartSearch, actionMessage => {
    changeModuleIfEnabled(Module.Mail, Module.AppHost);
});

function resetIsRunning() {
    isRunning = false;
}

function changeModuleIfEnabled(newModule: Module, currentlySelectedModule: Module) {
    if (
        currentlySelectedModule != newModule &&
        isModuleSwitchEnabled(currentlySelectedModule, newModule) &&
        !isRunning
    ) {
        isRunning = true;
        changeModuleInternal(newModule).then(resetIsRunning, resetIsRunning);
    }
}

async function changeModuleInternal(newModule: Module) {
    let options = getBootstrapOptions(newModule);
    if (!options) {
        setApp(newModule);
        const lazyConfig = moduleToConfigMap[newModule]!;
        options = await lazyConfig.options.importAndExecute(
            Promise.resolve(undefined),
            lazyConfig.strategies
        )!;
        registerBootstrapOptions(options!);
        await registerRouterRoutes(options!.routerOptions!, true /* registerAll */);
        const promises = preloadStrategies(options!.strategies)
            .filter(p => p)
            .map(p => p.promise);
        const statePromise = options!.initializeState();
        if (statePromise) {
            promises.push(statePromise);
        }

        promises.push(getBposNavBarDataAsync('changeModuleInternal'));
        registerFontSubsets(getPackageBaseUrl(), options!.iconFonts);
        const postLazyAction = options!.postLazyAction;
        if (postLazyAction) {
            postLazyAction.importAndExecute.apply(postLazyAction, options!.postLazyArgs || []);
        }
        await Promise.all(promises);
    }

    updateModuleForVdirChange(options!);
}
