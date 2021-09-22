import { fromId, fromSlug } from 'bundles/s12n-common/service/promises/s12ns';
import { fromId as specializationFromId } from 'bundles/s12n-common/service/promises/specializations';
import sparkSpecializationPromiseFactory from 'bundles/s12n-common/service/promises/sparkSpecializationPromiseFactory'; //eslint-disable-line

export const loadS12nById = function(
  actionContext: $TSFixMe,
  { s12nId, includeMembership = true }: $TSFixMe,
  done: $TSFixMe
) {
  return fromId(s12nId, { includeMembership })
    .then((s12n: $TSFixMe) => {
      actionContext.dispatch('RECEIVED_S12N', s12n);
    })
    .done(done);
};

export const loadS12nBySlug = function(
  actionContext: $TSFixMe,
  { slug, includeMembership = true }: $TSFixMe,
  done: $TSFixMe
) {
  return fromSlug(slug, { includeMembership })
    .then((s12n: $TSFixMe) => {
      actionContext.dispatch('RECEIVED_S12N', s12n);
    })
    .done(done);
};

// Load a spark specialization
export const loadSpecializationById = function(
  actionContext: $TSFixMe,
  { specializationId }: $TSFixMe,
  done: $TSFixMe
) {
  return specializationFromId(specializationId.toString())
    .then((specialization: $TSFixMe) => {
      actionContext.dispatch('RECEIVED_S12N', specialization);
    })
    .done(done);
};

// Load a spark specailization from Django endpoint (we need this for prices)
export const loadSpecializationFromDjangoEndpointById = function(
  actionContext: $TSFixMe,
  { specializationId }: $TSFixMe,
  done: $TSFixMe
) {
  return sparkSpecializationPromiseFactory(specializationId.toString())
    .then((sparkSpecializationInfo: $TSFixMe) => {
      actionContext.dispatch('RECEIVED_S12N_FROM_DJANGO', sparkSpecializationInfo);
    })
    .done(done);
};
