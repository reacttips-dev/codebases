import findMetatag from './findMetatag';
import type {
    PhysicalRingEnum,
    VariantEnvironmentEnum,
} from 'owa-client-pie/lib/outlookwebcontext.g';

export type PhysicalRing = keyof typeof PhysicalRingEnum;
export type VariantEnvironment = keyof typeof VariantEnvironmentEnum;

const physicalRingKnownList: PhysicalRing[] = [
    'Unknown',
    'WW',
    'Dogfood',
    'SIP',
    'BlackForest',
    'DONMT',
    'MSIT',
    'Gallatin',
    'SDFV2',
    'PDT',
    'TDF',
    'ITAR',
];

const environmentList: VariantEnvironment[] = [
    'Unknown',
    'AG08',
    'AG09',
    'BlackForest',
    'DITAR',
    'DoD',
    'Dogfood',
    'Gallatin',
    'GCCModerate',
    'GccHigh',
    'GovCloud',
    'ITAR',
    'Prod',
];

export function getPhysicalRing(): PhysicalRing {
    const physicalRing = (findMetatag('physicalRing') || '').toLowerCase();
    return (
        physicalRingKnownList.filter(item => item.toLowerCase() === physicalRing)[0] || 'Unknown'
    );
}

export function getVariantEnvironment(): VariantEnvironment {
    const environment = (findMetatag('environment') || '').toLowerCase();
    return environmentList.filter(item => item.toLowerCase() === environment)[0] || 'Unknown';
}

export function isDogfoodEnv() {
    const physicalRing = getPhysicalRing();
    return (
        physicalRing == 'Dogfood' || physicalRing == 'SDFV2' || getVariantEnvironment() == 'Dogfood'
    );
}

export function isEnvironmentAirGap(): boolean {
    const environment = getVariantEnvironment();
    return environment == 'AG08' || environment == 'AG09';
}
