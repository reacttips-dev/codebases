/* Returns a promise for the course materials object from the course data API. */

import URI from 'jsuri';

import Q from 'q';
import _ from 'underscore';
import API from 'js/lib/api';
import { stringKeyToTuple, tupleToStringKey } from 'js/lib/stringKeyTuple';

const onDemandCourseMaterialsAPI = API('/api/onDemandCourseMaterials.v2', {
  type: 'rest',
});

const MODULES_RESOURCE = 'onDemandCourseMaterialModules.v1';
const LESSONS_RESOURCE = 'onDemandCourseMaterialLessons.v1';
const PASSABLE_ITEM_GROUPS_RESOURCE = 'onDemandCourseMaterialPassableItemGroups.v1';
const PASSABLE_ITEM_GROUP_CHOICES_RESOURCE = 'onDemandCourseMaterialPassableItemGroupChoices.v1';
const PASSABLE_LESSON_ELEMENTS_RESOURCE = 'onDemandCourseMaterialPassableLessonElements.v1';
const ITEMS_RESOURCE = 'onDemandCourseMaterialItems.v2';
const TRACKS_RESOURCE = 'onDemandCourseMaterialTracks.v1';
const GRADE_POLICY_RESOURCE = 'onDemandCourseMaterialGradePolicy.v1';
const GRADING_PARAMETERS_RESOURCE = 'onDemandGradingParameters.v1';

const MODULE_FIELDS = ['name', 'slug', 'description', 'timeCommitment', 'lessonIds', 'optional', 'learningObjectives'];
const LESSON_FIELDS = ['name', 'slug', 'timeCommitment', 'elementIds', 'optional', 'trackId'];
const PASSABLE_ITEM_GROUP_FIELDS = ['requiredPassedCount', 'passableItemGroupChoiceIds', 'trackId'];
const PASSABLE_ITEM_GROUP_CHOICE_FIELDS = ['name', 'description', 'itemIds'];
const PASSABLE_LESSON_ELEMENTS_FIELDS = ['gradingWeight', 'isRequiredForPassing'];
const ITEM_FIELDS = [
  'name',
  'slug',
  'timeCommitment',
  'contentSummary',
  'isLocked',
  'lockableByItem',
  'itemLockedReasonCode',
  'trackId',
  'lockedStatus',
  'itemLockSummary',
];
const TRACK_FIELDS = ['passablesCount'];
const GRADING_PARAMETERS_FIELDS = ['gradedAssignmentGroups'];

const OLD_MODULE_FIELDS = _(['id', ...MODULE_FIELDS]).without('lessonIds');
const OLD_LESSON_FIELDS = _(['id', ...LESSON_FIELDS]).without('elementIds');
const OLD_ITEM_FIELDS = ['id', ...ITEM_FIELDS];

// Long ago, the Phoenix web client used a non-Naptime API (/api/opencourse.v1/course/:slug)
// to read course materials. We've migrated away from that to onDemandCourseMaterials.v1,
// though we still use the old API's model format in our code (hence the term "old" in this
// method name).
//
// There is an even newer API: onDemandCourseMaterials.v2. It changes the item model enough that we must modify a lot
// of code that deals with items to support it. So we can't use it now.
//
// TODO: Migrate to onDemandCourseMaterials.v2, away from the old item model format.
const constructOldCourseMaterials = (
  moduleIds,
  modules,
  lessons,
  passableItemGroups,
  passableItemGroupChoices,
  passableLessonElements,
  items,
  tracks,
  gradePolicy,
  gradingParameters
) => {
  // NOTE (@sgogia): There is some pretty funky stuff going on here with how item and item group
  // fields are computed on top of the API response data. Ideally we want to mirror our backend
  // and frontend data models, or have at least a single location on frontend for any data reshaping
  // on top of the backend.
  // CLEANUP REQUIRED!
  const honorsItemIds = _(lessons)
    .chain()
    .filter((lesson) => lesson.trackId === 'honors')
    .reduce((a, b) => a.concat(b.elementIds), [])
    .value();

  const gradedAssignmentGroupItemIds = gradingParameters?.gradedAssignmentGroups
    ? _(gradingParameters.gradedAssignmentGroups)
        .chain()
        .map((group) => group.itemIds)
        .flatten()
        .map((itemId) => `item~${itemId}`) // turns this into passable lesson element id
        .value()
    : [];

  const totalGroupGradingWeight = gradingParameters?.gradedAssignmentGroups
    ? _(gradingParameters.gradedAssignmentGroups)
        .chain()
        .map((group) => group.gradingWeight)
        .reduce((a, b) => a + b, 0)
        .value()
    : 0;

  const totalNonGroupItemGradingWeight = _(passableLessonElements)
    .chain()
    .filter(
      (passableLessonElement) =>
        !honorsItemIds.includes(passableLessonElement.id) &&
        !gradedAssignmentGroupItemIds.includes(passableLessonElement.id)
    )
    .map((passableLessonElement) => passableLessonElement.gradingWeight)
    .reduce((a, b) => a + b, 0)
    .value();

  const totalGradingWeight = totalGroupGradingWeight + totalNonGroupItemGradingWeight;

  const normalizedGradingWeightsById = _(passableLessonElements)
    .chain()
    .map((passableLessonElement) => [
      passableLessonElement.id,
      passableLessonElement.gradingWeight / Math.max(totalGradingWeight, 1),
    ])
    .object()
    .value();

  const passingRequiredById = _(passableLessonElements)
    .chain()
    .map((passableLessonElement) => [passableLessonElement.id, passableLessonElement.isRequiredForPassing])
    .object()
    .value();

  const oldItems = _(items)
    .chain()
    .map((item) => {
      const passableLessonElementId = tupleToStringKey(['item', item.id]);
      const gradingWeight = normalizedGradingWeightsById[passableLessonElementId];
      const isRequiredForPassing = passingRequiredById[passableLessonElementId];
      return [item.id, { ..._(item).pick(OLD_ITEM_FIELDS), gradingWeight, isRequiredForPassing }];
    })
    .object()
    .value();

  const oldPassableItemGroupChoices = _(passableItemGroupChoices)
    .chain()
    .map((passableItemGroupChoice) => {
      const elements = passableItemGroupChoice.itemIds.map((id) => oldItems[id]);
      return [passableItemGroupChoice.id, { elements, ...passableItemGroupChoice }];
    })
    .object()
    .value();

  const oldPassableItemGroups = _(passableItemGroups)
    .chain()
    .map((passableItemGroup) => {
      const elements = passableItemGroup.passableItemGroupChoiceIds.map((id) => oldPassableItemGroupChoices[id]);
      const passableLessonElementId = tupleToStringKey(['passableItemGroup', passableItemGroup.id]);
      const gradingWeight = normalizedGradingWeightsById[passableLessonElementId];
      const isRequiredForPassing = passingRequiredById[passableLessonElementId];
      return [passableItemGroup.id, { ...passableItemGroup, choices: elements, gradingWeight, isRequiredForPassing }];
    })
    .object()
    .value();

  const oldLessons = _(lessons)
    .chain()
    .map((lesson) => {
      const lessonElements = _(lesson.elementIds)
        .chain()
        .map((id) => {
          const [elementType, elementId] = stringKeyToTuple(id);
          if (elementType === 'item') {
            return { elementType, item: oldItems[elementId] };
          } else if (elementType === 'passableItemGroup') {
            return {
              elementType,
              passableItemGroup: oldPassableItemGroups[elementId],
            };
          }
          return undefined;
        })
        .groupBy('elementType')
        .value();

      // See the comment in "../models/lesson.js" for an explanation of why this is named `elements` instead of
      // `items`.
      const elements = (lessonElements.item || []).map(({ item }) => item);

      const itemGroups = (lessonElements.passableItemGroup || []).map(({ passableItemGroup }) => passableItemGroup);

      return [lesson.id, _(lesson).chain().pick(OLD_LESSON_FIELDS).extend({ elements, itemGroups }).value()];
    })
    .object()
    .value();

  const oldModules = _(modules)
    .chain()
    .map((module) => {
      const elements = module.lessonIds.map((id) => oldLessons[id]);
      return [module.id, _(module).chain().pick(OLD_MODULE_FIELDS).extend({ elements }).value()];
    })
    .object()
    .value();

  const elements = moduleIds.map((id) => oldModules[id]);
  const tracksObject = _.indexBy(tracks, 'id');

  return { elements, tracks: tracksObject, gradePolicy, gradingParameters, totalGradingWeight };
};

// TODO(wbowers): Move this mutable state into a separate store and update it accordingly.
// Explanation: Learners will likely have to refresh the page after completing items
// that lock other items because course materials is considered to be immutable by
// the rest of the systems
const getCourseMaterialItems = (baseUri) => {
  const uri = baseUri
    .addQueryParam(
      'includes',
      [
        'modules',
        'lessons',
        'passableItemGroups',
        'passableItemGroupChoices',
        'passableLessonElements',
        'items',
        'tracks',
        'gradePolicy',
        'gradingParameters',
      ].join(',')
    )
    .addQueryParam(
      'fields',
      [
        'moduleIds',
        `${MODULES_RESOURCE}(${MODULE_FIELDS.join(',')})`,
        `${LESSONS_RESOURCE}(${LESSON_FIELDS.join(',')})`,
        `${PASSABLE_ITEM_GROUPS_RESOURCE}(${PASSABLE_ITEM_GROUP_FIELDS.join(',')})`,
        `${PASSABLE_ITEM_GROUP_CHOICES_RESOURCE}(${PASSABLE_ITEM_GROUP_CHOICE_FIELDS.join(',')})`,
        `${PASSABLE_LESSON_ELEMENTS_RESOURCE}(${PASSABLE_LESSON_ELEMENTS_FIELDS.join(',')})`,
        `${ITEMS_RESOURCE}(${ITEM_FIELDS.join(',')})`,
        `${TRACKS_RESOURCE}(${TRACK_FIELDS.join(',')})`,
        `${GRADING_PARAMETERS_RESOURCE}(${GRADING_PARAMETERS_FIELDS.join(',')})`,
      ].join(',')
    )
    .addQueryParam('showLockedItems', 'true');

  return Q(onDemandCourseMaterialsAPI.get(uri.toString())).then((response) => {
    return constructOldCourseMaterials(
      response.elements[0].moduleIds,
      response.linked[MODULES_RESOURCE],
      response.linked[LESSONS_RESOURCE],
      response.linked[PASSABLE_ITEM_GROUPS_RESOURCE],
      response.linked[PASSABLE_ITEM_GROUP_CHOICES_RESOURCE],
      response.linked[PASSABLE_LESSON_ELEMENTS_RESOURCE],
      response.linked[ITEMS_RESOURCE],
      response.linked[TRACKS_RESOURCE],
      response.linked[GRADE_POLICY_RESOURCE],
      response.linked[GRADING_PARAMETERS_RESOURCE][0]
    );
  });
};

// Sometimes you want to memoize something but only temporarily.
// TEMPOIZE IT.
const tempoize = (fn, milliseconds = 5000) => {
  const tempMap = {};
  const throttledFn = (...args) => {
    const key = JSON.stringify(args);

    if (tempMap[key]) return;

    const result = fn(...args);

    setTimeout(() => {
      delete tempMap[key];
    }, milliseconds);

    tempMap[key] = result;
  };

  return (...args) => {
    // Try seeing if the promise that is to be returned is being
    // generated after the specified time.
    throttledFn(...args);

    return tempMap[JSON.stringify(args)];
  };
};

export const fromSlug = tempoize((courseSlug) => {
  if (!courseSlug) return Q.reject('Missing courseSlug argument');

  const baseUri = new URI('').addQueryParam('q', 'slug').addQueryParam('slug', courseSlug);

  return getCourseMaterialItems(baseUri);
});

export const fromLearnerId = tempoize((learnerId, courseId) => {
  if (!learnerId) return Q.reject('Missing learnerId argument');
  if (!courseId) return Q.reject('Missing courseId argument');

  const baseUri = new URI('')
    .addQueryParam('q', 'learner')
    .addQueryParam('learnerId', learnerId)
    .addQueryParam('courseId', courseId);
  return getCourseMaterialItems(baseUri);
});

export const fromId = tempoize((courseId) => {
  if (!courseId) return Q.reject('Missing courseId argument');

  const baseUri = new URI(courseId);
  return getCourseMaterialItems(baseUri);
});

export default { fromSlug, fromLearnerId, fromId };
