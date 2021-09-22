import _ from 'underscore';

class GroupEnrollUtils {
  static getPayerName(myGroupsWithZeroPayment: $TSFixMe, response: $TSFixMe) {
    if (response && !_(response.elements).isEmpty()) {
      const groupPartnerId = response.elements[0].partnerId.maestroId || response.elements[0].partnerId;
      const partner = _(response.linked['partners.v1']).find((data) => parseInt(data.id, 10) === groupPartnerId);
      return partner.name;
    }
  }
}

export default GroupEnrollUtils;
