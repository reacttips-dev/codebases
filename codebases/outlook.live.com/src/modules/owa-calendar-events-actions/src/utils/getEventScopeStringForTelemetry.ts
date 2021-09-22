import EventScope from 'owa-service/lib/contract/EventScope';

export default function getEventScopeStringForTelemetry(eventScope: EventScope) {
    switch (eventScope) {
        case EventScope.Default:
            return 'Default';
        case EventScope.ThisInstanceOnly:
            return 'ThisInstanceOnly';
        case EventScope.ThisAndFollowingInstances:
            return 'ThisAndFollowingInstances';
        case EventScope.AllInstancesInSeries:
            return 'AllInstancesInSeries';
    }
}
