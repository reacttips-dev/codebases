import type { AppBootstrapOptions } from '../types/AppBootstrapOptions';
import { setApp } from 'owa-config/lib/bootstrapOptions';
import initializeWindowTitle from 'owa-shared-bootstrap/lib/initializeWindowTitle';
import { OwaWorkload, setOwaWorkload } from 'owa-workloads';
import { getCurrentModule, updateModule } from 'owa-app-module-store';
import { getWindowTitle } from 'owa-bootstrap/lib/initialization/getWindowTitle';
import { setVdir } from 'owa-router';

export function updateModuleForVdirChange(options: AppBootstrapOptions) {
    const newModule = options.appModuleProps.module;
    if (getCurrentModule() != newModule) {
        setApp(newModule);
        initializeWindowTitle(() => getWindowTitle(options.getModuleName));
        setOwaWorkload(options.workload || OwaWorkload.None);
        options.routerOptions && setVdir(options.routerOptions.vdir);
        updateModule(newModule);
    }
}
