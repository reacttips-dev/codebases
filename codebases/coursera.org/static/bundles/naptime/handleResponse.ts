import _ from 'lodash';

export default function handleResponse(response: $TSFixMe) {
  let linkedObjects: $TSFixMe;
  if (response && response.linked) {
    linkedObjects = _.fromPairs(
      _.map(response.linked, function (value, key) {
        return [
          key,
          function (id: $TSFixMe) {
            return _.find(response.linked[key], { id });
          },
        ];
      })
    );
  }

  return {
    elements: response.elements,

    getLinkedObject(key: $TSFixMe, value: $TSFixMe) {
      if (linkedObjects && _.has(linkedObjects, key)) {
        return linkedObjects[key](value);
      } else {
        return null;
      }
    },

    paging: response.paging,
  };
}
