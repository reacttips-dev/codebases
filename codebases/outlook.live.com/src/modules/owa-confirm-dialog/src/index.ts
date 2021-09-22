import type { ConfirmCustomizationOptions } from './actions/confirm';
import { LazyImport, LazyModule } from 'owa-bundling';
import type { textResolver } from './components/ConfirmDialog';

import { DialogResponse } from './actions/DialogResponse';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ConfirmDialog"*/ './lazyIndex')
);

// Delay loaded action as import since action does not allow to return non-void values
let lazyConfirm = new LazyImport(lazyModule, m => m.confirmAction);

export function confirm(
    title: string | textResolver,
    subText?: string | textResolver,
    resolveImmediately?: boolean,
    customizationOptions?: ConfirmCustomizationOptions
): Promise<DialogResponse> {
    return lazyConfirm.import().then(concreteConfirm => {
        return concreteConfirm(title, subText, resolveImmediately, customizationOptions);
    });
}

// Types
export { ConfirmCustomizationOptions, DialogResponse };
