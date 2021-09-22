import { createStore } from 'satcheljs';
import type DomainConnectStore from './schema/domainConnectStore';

const domainConnectStoreData: DomainConnectStore = {
    csrfToken: '',
    didCompleteDomainConnect: false,
    step1Store: {
        openDomainConnect: false,
        showNewDomainStep: true,
        showBYODStep: false,
        showBYODValidateButton: false,
        showBYODForm: true,
        showBYODSpinner: false,
        showBYODFinalStep: false,
        showBYODError: false,
        showBYODInvalidDomainError: false,
        showBYODDomainApiError: false,
        godaddyByodUrl: '',
        dnsSetupValue: '',
        byodDomain: '',
    },
    step2Store: {
        showWaitMsg: true,
        showSubstep1: false,
        showSubstep2: false,
        alias: '',
        domainName: '',
        openDomainConnectStep2: false,
        showValidatingSpinner: false,
        showAddressAleardyInUseError: 'none',
        showInvalidInputError: false,
    },
};

export const store = createStore<DomainConnectStore>('domainConnectStore', domainConnectStoreData);
export default store();
