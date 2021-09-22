import type { RegisterRouteFunction } from 'owa-router';
import { lazyMountAndShowDCSecondStep } from '../lazyFunctions';

export const DC_ROUTE_KEYWORD = 'domainconnect';
export const DC_STEP_KEYWORD = 'setalias';

function DomainConnectRouteHandler(parameters: any) {
    lazyMountAndShowDCSecondStep.importAndExecute();
}

export function initializeDomainConnectRoutes(registerRoute: RegisterRouteFunction) {
    registerRoute(`/${DC_ROUTE_KEYWORD}/${DC_STEP_KEYWORD}`, DomainConnectRouteHandler);
}
