import Q from 'q';
import URI from 'jsuri';
import API from 'js/lib/api';
import { createAsAtomIfSupported } from 'bundles/authoring/common/utils/AtomCreationApiUtils';

const courseMaterialsAPI = API('/api/authoringCourseMaterials.v1', {
  type: 'rest',
});

const CourseMaterialAPIUtils = {
  getCourseMaterials(branchId, includeWriteAccessState = false) {
    const uri = new URI(branchId).addQueryParam(
      'fields',
      includeWriteAccessState
        ? 'material,conflictMetadata,authoringAtoms.v2(writeAccessState)'
        : 'material,conflictMetadata'
    );
    if (includeWriteAccessState) {
      uri.addQueryParam('includes', 'atomIds');
    }
    return Q(courseMaterialsAPI.get(uri.toString()));
  },

  saveCourseMaterialPatch(branchId, data, includeWriteAccessState = false) {
    // Integrating the Atom System with the current item creation framework requires an initial call to create an Atom draft
    // for item types that support Atoms and then to pass the new atomId to the existing item creation endpoint.
    return createAsAtomIfSupported(data).then((modifiedData) => {
      const uri = new URI(branchId).addQueryParam(
        'fields',
        'material,conflictMetadata,changeScope,authoringAtoms.v2(writeAccessState)'
      );
      if (includeWriteAccessState) {
        uri.addQueryParam('includes', 'atomIds');
      }
      return Q(courseMaterialsAPI.patch(uri.toString(), { data: modifiedData }));
    });
  },
};

export default CourseMaterialAPIUtils;

export const { getCourseMaterials, saveCourseMaterialPatch } = CourseMaterialAPIUtils;
