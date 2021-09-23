export function include3ColumnRecordGate(properties, optedInAndUngated) {
  var event = properties.event,
      objectType = properties.objectType,
      eventProps = properties.eventProps;

  if (optedInAndUngated) {
    return {
      event: event,
      objectType: objectType,
      eventProps: Object.assign({
        gate: 'CRM:RecordCanary'
      }, eventProps)
    };
  }

  return properties;
}