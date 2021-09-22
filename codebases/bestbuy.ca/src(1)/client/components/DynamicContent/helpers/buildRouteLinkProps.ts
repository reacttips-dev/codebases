import {buildLinkProps} from "@bbyca/apex-components";
import {EventTypes as RouteEventTypes} from "@bbyca/apex-components/dist/models";
import {EventTypes, LinkEventType} from "models";

export const getRouteEventType = (event: EventTypes): RouteEventTypes | null =>
    (Object.keys(RouteEventTypes).find((routeEventType) => event === routeEventType) as RouteEventTypes) || null;

const buildRouteLinkProps = (event: LinkEventType) => {
    const eventType = getRouteEventType(event.eventType);
    return eventType
        ? buildLinkProps({
              ...event,
              eventType,
          })
        : null;
};

export default buildRouteLinkProps;
