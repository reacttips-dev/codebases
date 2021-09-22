import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function is3SServiceAvailable(): boolean {
    return getUserConfiguration().SessionSettings.IsSubstrateSearchServiceAvailable;
}
