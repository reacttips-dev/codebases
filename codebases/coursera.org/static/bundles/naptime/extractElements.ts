/**
 * Given a Naptime response, returns the first element in response.elements.
 * If the response contains no elements, returns undefined.
 */
const exported = {
  getFirstElement(response: $TSFixMe) {
    if (response.elements && response.elements.length > 0) {
      return response.elements[0];
    }
  },

  getFirstLinkedElement(response: $TSFixMe, resourceName: $TSFixMe) {
    const linkedResource = response.linked && response.linked[resourceName];
    if (linkedResource && linkedResource.length > 0) {
      return linkedResource[0];
    }
  },
};

export default exported;

export const { getFirstElement, getFirstLinkedElement } = exported;
