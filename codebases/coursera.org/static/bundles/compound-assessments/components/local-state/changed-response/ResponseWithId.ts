/**
 * Type to co-locate a response with its id for storage into the `ChangedResponse` local cache.
 * This also provides utility functions for converting form parts into lists of responses.
 */

import {
  FormElement,
  FormElementNodeWithId,
} from 'bundles/compound-assessments/components/api/types/CompoundAssessmentsForm';
import { ChangedResponse, Response } from 'bundles/compound-assessments/components/local-state/changed-response/types';

import getFormPartData from 'bundles/compound-assessments/components/form-parts/lib/getFormPartData';

export type ResponseWithId = {
  id: string;
  response: Response;
};

export const asChangedResponse = (responseWithId: ResponseWithId): ChangedResponse => ({
  ...responseWithId,
  __typename: 'LocalChangedResponse',
});

export const formResponseWithIdFromFormElement = (formElement: FormElement): ResponseWithId | undefined => {
  const { id, response } = getFormPartData(formElement);
  if (id && response) {
    return { id, response: response as Response };
  }
  return undefined;
};

export const formResponseWithIdsFromFormPart = (formPart: FormElementNodeWithId): ResponseWithId[] => {
  const {
    root: { element, children },
  } = formPart;

  const submissionResponse = formResponseWithIdFromFormElement(element);
  const reviewResponses = children.map(({ element: reviewElement }) =>
    formResponseWithIdFromFormElement(reviewElement)
  );

  return [submissionResponse].concat(reviewResponses).filter((response) => response !== undefined) as ResponseWithId[];
};

export const formResponseWithIdsFromFormParts = (formParts: FormElementNodeWithId[]): ResponseWithId[] => {
  return formParts.reduce(
    (acc, formPart) => acc.concat(formResponseWithIdsFromFormPart(formPart)),
    [] as ResponseWithId[]
  );
};
