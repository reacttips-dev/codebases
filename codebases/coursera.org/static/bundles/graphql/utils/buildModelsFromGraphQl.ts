import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import MembershipsV1 from 'bundles/naptimejs/resources/memberships.v1';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import OnDemandLearnerSessionsV1 from 'bundles/naptimejs/resources/onDemandLearnerSessions.v1';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import OnDemandSessionMembershipsV1 from 'bundles/naptimejs/resources/onDemandSessionMemberships.v1';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import OnDemandSessionsV1 from 'bundles/naptimejs/resources/onDemandSessions.v1';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import OnDemandSpecializationMembershipsV1 from 'bundles/naptimejs/resources/onDemandSpecializationMemberships.v1';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import PartnersV1 from 'bundles/naptimejs/resources/partners.v1';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import SiteMessagesMetadataV1 from 'bundles/naptimejs/resources/siteMessagesMetadata.v1';

const TYPE_NAME_KEY = '__typename';

const MODEL_TYPE_MAP = {
  CoursesV1,
  MembershipsV1,
  OnDemandLearnerSessionsV1,
  OnDemandSessionMembershipsV1,
  OnDemandSessionsV1,
  OnDemandSpecializationMembershipsV1,
  PartnersV1,
  SiteMessagesMetadataV1,
};

// @ts-ignore ts-migrate(7024) FIXME: Function implicitly has return type 'any' because ... Remove this comment to see the full error message
const buildModelsFromGraphQl = (data: $TSFixMe) => {
  if (!data) {
    return data;
  }

  const typeName = data[TYPE_NAME_KEY];
  // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  const TypeClass = MODEL_TYPE_MAP[typeName];

  if (Array.isArray(data)) {
    return Array.prototype.slice.call(data).map(buildModelsFromGraphQl);
  } else if (!TypeClass) {
    return data;
  }

  const model = new TypeClass();

  Object.keys(data).forEach((key) => {
    if (key !== TYPE_NAME_KEY) {
      model[key] = buildModelsFromGraphQl(data[key]);
    }
  });

  return model;
};

export default buildModelsFromGraphQl;
export { TYPE_NAME_KEY };
