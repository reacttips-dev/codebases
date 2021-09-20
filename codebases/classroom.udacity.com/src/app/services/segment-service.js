import ApiService from 'services/api-service';

function createSegmentProxyEventMutation(eventName, properties) {
    let input = {
        eventName,
        properties,
    };

    return [
        `
      mutation createSegmentProxyEvent($eventName: String!, $properties: JSON) {
        proxySegmentEvent(eventName:$eventName, properties:$properties)
      }
    `,
        input,
    ];
}

export const sendSegmentProxyEvent = (eventName, properties) => {
    return ApiService.gql(
        ...createSegmentProxyEventMutation(eventName, properties)
    ).then((response) => response);
};