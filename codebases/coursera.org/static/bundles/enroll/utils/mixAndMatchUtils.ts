import shuffle from 'lodash/shuffle';
import uniq from 'lodash/uniq';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
import { Specialization } from 'bundles/xdp/types/xdpSharedTypes';

export type CommonSpecialization = OnDemandSpecializationsV1 | Specialization;

const s12nOrderMap: Record<string, Array<string>> = {};

// order is randomized now, will be based on non-arbitrary criteria (e.g. popularity) in the future
export const getS12nOrder = (courseId: string, s12ns: Array<CommonSpecialization>): Array<CommonSpecialization> => {
  // don't cache the server-rendered order because it won't match the client-rendered order
  if (typeof window === 'undefined') {
    return s12ns;
  }

  if (!s12nOrderMap[courseId]) {
    const s12nSlugs = s12ns.map(({ slug }) => slug);

    // XdpV1Resource can reuturn multiple versions of the same s12n, so get unique by slug
    // This does not cause problems with enrollment because EAC derives its own list of s12nIds
    // and this function is purely used for display purposes to show all SDP links
    const uniqueS12nSlugs = uniq(s12nSlugs);

    s12nOrderMap[courseId] = shuffle(uniqueS12nSlugs);
  }

  return (
    s12nOrderMap[courseId]
      // We know that s12n.find will find specialization, so we cast it as CommonSpecialization
      .map((s12nId) => s12ns.find(({ slug }) => s12nId === slug) as CommonSpecialization)
      // XdpV1Resource can return non-equal amounts of s12ns on subsequent renders,
      // so filter out missing s12ns (the missing ones are usually hidden / private)
      // TODO investigate both issues on the BE
      .filter((s12n) => !!s12n)
  );
};
