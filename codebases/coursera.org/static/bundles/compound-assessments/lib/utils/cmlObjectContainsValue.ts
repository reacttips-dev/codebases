import { CMLOrHTMLContent } from 'bundles/compound-assessments/types/FormParts';

type Description = CMLOrHTMLContent | string;

const cmlObjectContainsValue = (description?: Description): boolean => {
  const defaultEmptyResponse = '<co-content></co-content>';
  if (typeof description === 'string') {
    return true;
  }
  const { definition } = description || {};

  if (!definition) {
    return false;
  }

  let feedbackText: string | null = null;

  if ('value' in definition) {
    feedbackText = definition.value;
  } else if ('content' in definition) {
    feedbackText = definition.content;
  }

  if (
    feedbackText &&
    (typeof feedbackText !== 'string' ||
      (!feedbackText.includes(defaultEmptyResponse) && feedbackText.length !== defaultEmptyResponse.length))
  ) {
    return true;
  }

  return false;
};

export default cmlObjectContainsValue;
