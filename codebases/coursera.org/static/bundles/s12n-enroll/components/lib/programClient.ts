import Q from 'q';
import Uri from 'jsuri';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import EnrollmentProductTypes from 'bundles/enroll-course/common/EnrollmentProductTypes';
import API from 'bundles/phoenix/lib/apiWrapper';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import userIdentity from 'bundles/phoenix/template/models/userIdentity';
import uniq from 'lodash/uniq';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';

export const getAvailablePrograms = (s12nId: $TSFixMe) => {
  const programEnrollmentAPI = API('/api/programEnrollments.v2/', {
    type: 'rest',
  });
  const thirdPartyOrgAPI = API('/api/thirdPartyOrganizations.v1/', {
    type: 'rest',
  });
  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
  return Q().then(() => {
    if (!(userIdentity && userIdentity.get('authenticated'))) {
      return false;
    }
    const uri = new Uri()
      .addQueryParam('q', 'availableProgramsForUserAndS12nId')
      .addQueryParam('includes', 'enterprisePrograms')
      .addQueryParam('fields', 'enterprisePrograms.v1(metadata,thirdPartyOrganizationId)')
      .addQueryParam('userId', userIdentity.get('id'))
      .addQueryParam('s12nId', s12nId);

    return Q(programEnrollmentAPI.get(uri.toString())).then((res) => {
      const program = res.linked['enterprisePrograms.v1'][0];
      const programs = res.linked['enterprisePrograms.v1'];
      const uri2 = new Uri()
        .addQueryParam('fields', 'name')
        .addQueryParam('ids', uniq(programs.map((program: $TSFixMe) => program.thirdPartyOrganizationId)).join(','));
      return Q(thirdPartyOrgAPI.get(uri2.toString())).then(({ elements }) => {
        const thirdPartyOrganization = elements.find(
          (element: $TSFixMe) => element.id === program.thirdPartyOrganizationId
        );
        const thirdPartyOrganizations = elements;
        return { program, programs, thirdPartyOrganization, thirdPartyOrganizations };
      });
    });
  });
};

export const getAvailableInvitedPrograms = (s12nId: $TSFixMe) => {
  const programEnrollmentAPI = API('/api/programEnrollments.v2/', {
    type: 'rest',
  });
  const thirdPartyOrgAPI = API('/api/thirdPartyOrganizations.v1/', {
    type: 'rest',
  });
  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
  return Q().then(() => {
    if (!(userIdentity && userIdentity.get('authenticated'))) {
      return false;
    }
    const uri = new Uri()
      .addQueryParam('q', 'availableInvitedProgramsForProduct')
      .addQueryParam('includes', 'enterprisePrograms')
      .addQueryParam('fields', 'enterprisePrograms.v1(metadata,thirdPartyOrganizationId)')
      .addQueryParam('userId', userIdentity.get('id'))
      .addQueryParam('productId', tupleToStringKey([EnrollmentProductTypes.Specialization, s12nId]));

    return Q(programEnrollmentAPI.get(uri.toString())).then((res) => {
      const invitedPrograms = res.linked['enterprisePrograms.v1'];
      const uri2 = new Uri()
        .addQueryParam('fields', 'name')
        .addQueryParam(
          'ids',
          uniq(invitedPrograms.map((program: $TSFixMe) => program.thirdPartyOrganizationId)).join(',')
        );
      return Q(thirdPartyOrgAPI.get(uri2.toString())).then(({ elements }) => {
        const invitedThirdPartyOrganizations = elements;
        return { invitedPrograms, invitedThirdPartyOrganizations };
      });
    });
  });
};
