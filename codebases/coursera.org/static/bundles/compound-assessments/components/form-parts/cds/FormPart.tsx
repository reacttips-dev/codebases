import React from 'react';

// Separate response definitions for the same thing.
// a=1a|2a|3a
// b=1b|2b|3b
// where 1a is essentially the same as 1b, etc.
// See https://phabricator.dkandu.me/D99213#inline-851142
import ChangedResponse from 'bundles/compound-assessments/components/local-state/changed-response/ChangedResponse';
import type { Response as ChangedResponseType } from 'bundles/compound-assessments/components/local-state/changed-response/types';

import type {
  AnyData,
  FormElement,
  Response as CompoundAssessmentsFormResponseType,
  Responses,
  ResponseId,
  ResponseMetadata,
  ReviewPartSchema,
  SubmissionPartSchema,
} from 'bundles/compound-assessments/components/api/types/CompoundAssessmentsForm';

import { typeNames } from 'bundles/compound-assessments/constants';
import type { AssignmentRole } from 'bundles/compound-assessments/types/Roles';

// TODO: unify dirnames and make them dash-case
// TODO: unify component names, somethink like CheckboxPart or smth.
import BoxViewDocumentAnnotation from 'bundles/compound-assessments/components/form-parts/boxViewDocumentAnnotation/BoxViewDocumentAnnotation';
import Checkbox from 'bundles/compound-assessments/components/form-parts/cds/checkbox/Checkbox';
import Mcq from 'bundles/compound-assessments/components/form-parts/cds/mcq/Mcq';
import TextInputBox from 'bundles/compound-assessments/components/form-parts/cds/textInputBox/TextInputBox';
import TextAreaBox from 'bundles/compound-assessments/components/form-parts/cds/textAreaBox/TextAreaBox';
import MathExpression from 'bundles/compound-assessments/components/form-parts/cds/mathExpression/MathExpression';
import CodeExpression from 'bundles/compound-assessments/components/form-parts/cds/codeExpression/CodeExpression';
import Widget from 'bundles/compound-assessments/components/form-parts/cds/widget/Widget';
import RichText from 'bundles/compound-assessments/components/form-parts/cds/richText/RichText';
import OffPlatform from 'bundles/compound-assessments/components/form-parts/offPlatform/OffPlatform';
import UrlPart from 'bundles/compound-assessments/components/form-parts/cds/url/UrlPart';
import FileUpload from 'bundles/compound-assessments/components/form-parts/cds/fileUpload/FileUpload';
import PlainText from 'bundles/compound-assessments/components/form-parts/cds/plainText/PlainText';
import MultiLineInput from 'bundles/compound-assessments/components/form-parts/cds/multiLineInput/MultiLineInput';
import Options from 'bundles/compound-assessments/components/form-parts/cds/options/Options';
import Git from 'bundles/compound-assessments/components/form-parts/git/Git';
import Poll from 'bundles/compound-assessments/components/form-parts/poll/Poll';

import type { FormPartData } from 'bundles/compound-assessments/components/form-parts/lib/getFormPartData';
import getFormPartData from 'bundles/compound-assessments/components/form-parts/lib/getFormPartData';

export type ChildProps = {
  prompt?: SubmissionPartSchema | ReviewPartSchema | AnyData;
  response?: CompoundAssessmentsFormResponseType | null;
  responseId?: ResponseId;
  responses?: Responses;
  storedResponse?: CompoundAssessmentsFormResponseType | null;
  metadata?: ResponseMetadata;
  isDisabled: boolean;
  isReadOnly: boolean;
  onChangeResponse: () => void;
  showValidation: boolean;
  courseId?: string;
  itemId?: string;
  userId?: number;
  role?: AssignmentRole;
  ariaLabelledBy?: string;
  isExpanded?: boolean; // only currently used by FileUpload and BoxViewDocumentAnnotation
};

export type FormPartProps = {
  formPart: FormElement;
  isReadOnly?: boolean | null;
  isDisabled?: boolean | null;
  localScopeId?: string | null;
  showValidation?: boolean | null;
  courseId?: string;
  itemId?: string;
  userId?: number;
  role?: AssignmentRole;
  ariaLabelledBy?: string;
  isExpanded?: boolean;
  /** Renders read-only child component directly instead of reading from ChangedResponse
   * in grading view */
  isGraderView?: boolean;
};

const getFormPartComponent = (formPartData: FormPartData) => {
  const { prompt, response, responses, questionType } = formPartData;

  if (questionType && prompt && (response || responses)) {
    switch (questionType) {
      case 'boxViewDocumentAnnotation':
        return BoxViewDocumentAnnotation;
      case 'checkbox':
      case 'checkboxReflect':
        return Checkbox;
      case 'codeExpression':
        return CodeExpression;
      case 'mathExpression':
        return MathExpression;
      case 'mcq':
      case 'mcqReflect':
        return Mcq;
      case 'poll':
      case 'checkboxPoll':
        return Poll;
      case 'reflect':
        return TextAreaBox;
      case 'regex':
      case 'singleNumeric':
      case 'textExactMatch':
        return TextInputBox;
      case 'widget':
        return Widget;
      case 'richText':
        return RichText;
      case 'url':
        return UrlPart;
      case 'offPlatform':
        return OffPlatform;
      case 'fileUpload':
        return FileUpload;
      case 'plainText':
        return PlainText;
      case 'multiLineInput':
        return MultiLineInput;
      case 'options':
        return Options;
      case 'git':
        return Git;
      default:
        // never
        break;
    }
  }
  return undefined;
};

export const FormPart = (props: FormPartProps) => {
  const {
    formPart: element,
    isDisabled,
    isReadOnly: overrideReadOnly,
    localScopeId,
    showValidation,
    courseId,
    itemId,
    userId,
    role,
    isExpanded,
    ariaLabelledBy,
    isGraderView,
  } = props;

  if (
    element.typeName === typeNames.PROMPT_WITH_MULTIPLE_RESPONSES_ELEMENT ||
    element.typeName === typeNames.PROMPT_WITH_RESPONSE_ELEMENT ||
    element.typeName === typeNames.PROMPT_REQUIRING_RESPONSE_ELEMENT ||
    element.typeName === typeNames.GIT_REPOSITORY_PROMPT_ELEMENT
  ) {
    const formPartData = getFormPartData(element);
    const { id, prompt, response, responses, questionType, isReadOnly, metadata } = formPartData;

    const isRubricPart =
      questionType === 'options' || questionType === 'multiLineInput' || questionType === 'boxViewDocumentAnnotation';

    const Component: $TSFixMe = getFormPartComponent(formPartData);

    if (Component) {
      const childProps: ChildProps = {
        prompt,
        response,
        responses,
        responseId: id,
        // storedResponse is the response stored in the backend
        storedResponse: response,
        metadata,
        isDisabled: !!isDisabled,
        isReadOnly: !!(isReadOnly || overrideReadOnly),
        onChangeResponse: () => {},
        showValidation: !!showValidation,
        courseId,
        itemId,
        userId,
        role,
        isExpanded,
        ariaLabelledBy,
      };

      if (childProps.isReadOnly && (isRubricPart || isGraderView || questionType === 'git')) {
        return <Component {...childProps} />;
      } else if (id && response) {
        return (
          <ChangedResponse
            id={id}
            // Separate response definitions for the same thing.
            response={response as ChangedResponseType}
            localScopeId={localScopeId}
          >
            {({ newResponse, handleChangeResponse }) => (
              <Component {...childProps} response={newResponse} onChangeResponse={handleChangeResponse} />
            )}
          </ChangedResponse>
        );
      }
    }
  }
  return null;
};

export default FormPart;
