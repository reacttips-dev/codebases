import Q from 'q';

import epicClient from 'bundles/epic/client';
import { getCourseMaterials } from 'bundles/author-course/utils/CourseMaterialAPIUtils';

const isInlineItemNameEditingEnabled = () => epicClient.get('Authoring', 'enableInlineItemNameEditing');

export const loadCourseMaterialForBranch = (
  actionContext,
  { branchId, forceRefresh = false, callback = () => {}, reloadLinkedAtomInfoMapCallback = () => {} },
  done
) => {
  const existing = actionContext.getStore('CourseMaterialStore').getCourseMaterial(branchId);

  if (existing && existing.elements && !forceRefresh) {
    // TODO: This might cause problems if we actually need to refetch, because the
    // conflict metadata is out of sync between the backend and frontend.
    return Q(existing).done(() => {
      callback();
      done();
    });
  }

  // A callback for reloading the linkedAtomInfoMap occurs here in order to allow linked
  // items to load course material and linked-related content in the same render.
  return Q.Promise.all([
    getCourseMaterials(branchId, isInlineItemNameEditingEnabled()),
    reloadLinkedAtomInfoMapCallback(),
  ])
    .then((response) => {
      const [courseMaterialsResponse] = response;

      // Setting branch conflict metadata in branch store
      actionContext.dispatch('SAVE_CONFLICT_METADATA_FOR_BRANCH', {
        branchId,
        conflictMetadata: courseMaterialsResponse.elements[0].conflictMetadata,
      });

      actionContext.dispatch('LOADED_COURSE_MATERIAL_FOR_BRANCH', {
        branchId,
        courseMaterial: courseMaterialsResponse.elements[0].material,
        authoringAtoms: courseMaterialsResponse.linked['authoringAtoms.v2'],
      });
    })
    .done(() => {
      callback();
      done();
    });
};
