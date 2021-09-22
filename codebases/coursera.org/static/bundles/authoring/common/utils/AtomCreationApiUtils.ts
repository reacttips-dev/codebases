import Q from 'q';
import API from 'js/lib/api';

// TODO (jcheung) refine authoring course materials patch data flow type
type Data = any;

// enabledItemTypes specifies types of items that should always be created as Atoms
const enabledItemTypes = ['teammateReview'];

export const attachAtomId = (atomId: string, data: Data): Data => {
  const modifiedData = data;
  modifiedData.authoringCourseMaterialChange.definition.itemCreate = {
    typeName: 'atomReferenceCreate',
    definition: { atomId },
  };

  return modifiedData;
};

export const createAtom = (typeName: string): Q.Promise<string> => {
  if (typeName === 'teammateReview') {
    const teammateReviewsAPI = API('/api/authoringTeammateReviews.v1', { type: 'rest' });
    return Q(teammateReviewsAPI.post('')).then((response) => response.elements[0].id);
  }

  throw new Error(`Unable to create Atom: Unsupported item type(${typeName})`);
};

export const createAsAtomIfSupported = (data: Data): Q.Promise<Data> => {
  if (data.authoringCourseMaterialChange.definition.itemCreate) {
    if (enabledItemTypes.includes(data.authoringCourseMaterialChange.definition.itemCreate.typeName)) {
      return createAtom(data.authoringCourseMaterialChange.definition.itemCreate.typeName).then((atomId) =>
        attachAtomId(atomId, data)
      );
    }
  }
  return Q(data);
};
