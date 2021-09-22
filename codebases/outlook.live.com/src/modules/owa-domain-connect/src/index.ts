// export component

export { PremiumDomainConnectFirstStep, PremiumDomainConnectSecondStep } from './lazyFunctions';

export { initializeDomainConnectRoutes } from './routing/domainConnectRoutes';
export { domainConnectFetchDomainService } from './services/domainConnectFetchDomain';
export type { DomainConnectFetchSetupResponse } from './contract/DomainConnectFetchSetupResponse';
export { default as domainConnectFetchSetupInfoService } from './services/domainConnectFetchSetupInfoService';
export { default as DomainPurchaseType } from './contract/DomainPurchaseType';
export { default as store } from './store/store';
export const HMPlusBit = 2;
