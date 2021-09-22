import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export default function isAddinComplianceVerificationEnabled(): boolean {
    return !isConsumer();
}
