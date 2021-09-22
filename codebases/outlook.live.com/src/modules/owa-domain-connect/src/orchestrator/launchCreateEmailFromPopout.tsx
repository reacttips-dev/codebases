import * as React from 'react';
import { PremiumDomainConnectSecondStep } from '../index';
import { showModal } from 'owa-modal';

export function launchDomainConnectSetAlias(domain: string, csrfToken: string) {
    mountDomainConnectSecondStep(domain, csrfToken);
}

function mountDomainConnectSecondStep(domain: string, csrfToken: string) {
    const WrappedComponent = () => (
        <PremiumDomainConnectSecondStep
            domainName={domain}
            csrfToken={csrfToken}
            mountFromDomainDashBoard={false}
            isSecondaryUser={false}
        />
    );
    showModal(WrappedComponent);
}
