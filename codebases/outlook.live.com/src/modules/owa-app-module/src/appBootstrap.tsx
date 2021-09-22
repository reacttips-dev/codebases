import * as React from 'react';
import type { AppBootstrapOptions } from './types/AppBootstrapOptions';
import { bootstrap } from 'owa-bootstrap/lib/bootstrap';
import { registerBootstrapOptions } from './optionsRegistry';
import AppModule from './components/AppModule';
import { initializeModule } from 'owa-app-module-store';
import { firstApp } from 'owa-config/lib/bootstrapOptions';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import * as trace from 'owa-trace';
import { getServiceWorkerConfig } from './getServiceWorkerConfig';

export async function appBootstrap(options: AppBootstrapOptions) {
    if (isHostAppFeatureEnabled('incorrectNativeEntryPoint') && firstApp != 'Native') {
        trace.errorThatWillCauseAlert('IncorrectNativeEntryPoint');
    }

    const mod = options.appModuleProps!.module;
    initializeModule(mod);
    const serviceWorkerConfig = getServiceWorkerConfig(
        mod,
        isHostAppFeatureEnabled('opxServiceWorker')
    );
    if (serviceWorkerConfig) {
        options.swConfig = serviceWorkerConfig;
    }

    registerBootstrapOptions(options);

    const suiteWrapper = options.strategies?.suiteWrapper;
    const components = suiteWrapper ? await suiteWrapper.import() : undefined;
    let wrapSuiteHeader;
    if (components) {
        options.windowIcons = components.windowIcons;
        wrapSuiteHeader = suiteHeader => <components.suiteHeader suiteHeader={suiteHeader} />;
    }

    const appBarStrategy = options.strategies?.appBarStrategy;
    const AppBarComponent = appBarStrategy ? await appBarStrategy.import() : undefined;

    options.renderMainComponent = () => (
        <AppModule wrapSuiteHeader={wrapSuiteHeader} AppBarComponent={AppBarComponent} />
    );

    return bootstrap(options);
}
