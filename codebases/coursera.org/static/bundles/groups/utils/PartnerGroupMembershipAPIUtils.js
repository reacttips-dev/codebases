import Q from 'q';
import API from 'js/lib/api';
import URI from 'jsuri';

const partnerGroupMembershipsAPI = API('/api/partnerGroupMemberships.v1/', {
  type: 'rest',
});

const PartnerGroupMembershipAPIUtils = {
  getPartnerGroupMembership(groupId) {
    const uri = new URI()
      .addQueryParam('q', 'byGroup')
      .addQueryParam('groupId', groupId)
      .addQueryParam('includes', 'partners')
      .addQueryParam('fields', 'partners.v1(squareLogo)');

    return Q(partnerGroupMembershipsAPI.get(uri.toString()));
  },
};

export default PartnerGroupMembershipAPIUtils;

export const { getPartnerGroupMembership } = PartnerGroupMembershipAPIUtils;
