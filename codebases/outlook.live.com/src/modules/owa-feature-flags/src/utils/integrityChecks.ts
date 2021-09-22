import { getDefaultFeatureFlags } from '../actions/getDefaultFeatureFlags';

const uberFlag = 'fwk-uberflag';
const consumerFlag = 'fwk-consumer';
const businessFlag = 'fwk-business';

export function checkUberFlight() {
    return getIntegrityFlights().includes(uberFlag) ? 1 : 0;
}

export function checkUserTypeFlight(isConsumer: boolean) {
    const integrityFlights = getIntegrityFlights();
    return (isConsumer &&
        integrityFlights.includes(consumerFlag) &&
        !integrityFlights.includes(businessFlag)) ||
        (!isConsumer &&
            integrityFlights.includes(businessFlag) &&
            !integrityFlights.includes(consumerFlag))
        ? 1
        : 0;
}

let integrityFlags;
function getIntegrityFlights() {
    if (!integrityFlags) {
        integrityFlags = getDefaultFeatureFlags().filter(
            f => f === uberFlag || f === consumerFlag || f === businessFlag
        );
    }
    return integrityFlags;
}
