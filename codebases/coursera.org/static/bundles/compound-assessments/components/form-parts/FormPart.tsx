import React from 'react';

// Separate response definitions for the same thing.
// a=1a|2a|3a
// b=1b|2b|3b
// where 1a is essentially the same as 1b, etc.
// See https://phabricator.dkandu.me/D99213#inline-851142
import ChangedResponse from 'bundles/compound-assessments/components/local-state/changed-response/ChangedResponse';
import { Response as ChangedResponseType } from 'bundles/compound-assessments/components/local-state/changed-response/types';

import {
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
import { AssignmentRole } from 'bundles/compound-assessments/types/Roles';

// TODO: unify dirnames and make them dash-case
// TODO: unify component names, somethink like CheckboxPart or smth.
import BoxViewDocumentAnnotation from 'bundles/compound-assessments/components/form-parts/boxViewDocumentAnnotation/BoxViewDocumentAnnotation';
import Checkbox from 'bundles/compound-assessments/components/form-parts/checkbox/Checkbox';
import Mcq from 'bundles/compound-assessments/components/form-parts/mcq/Mcq';
import TextInputBox from 'bundles/compound-assessments/components/form-parts/textInputBox/TextInputBox';
import TextAreaBox from 'bundles/compound-assessments/components/form-parts/textAreaBox/TextAreaBox';
import MathExpression from 'bundles/compound-assessments/components/form-parts/mathExpression/MathExpression';
import CodeExpression from 'bundles/compound-assessments/components/form-parts/codeExpression/CodeExpression';
import Widget from 'bundles/compound-assessments/components/form-parts/widget/Widget';
import RichText from 'bundles/compound-assessments/components/form-parts/richText/RichText';
import OffPlatform from 'bundles/compound-assessments/components/form-parts/offPlatform/OffPlatform';
import UrlPart from 'bundles/compound-assessments/components/form-parts/url/UrlPart';
import FileUpload from 'bundles/compound-assessments/components/form-parts/fileUpload/FileUpload';
import PlainText from 'bundles/compound-assessments/components/form-parts/plainText/PlainText';
import MultiLineInput from 'bundles/compound-assessments/components/form-parts/multiLineInput/MultiLineInput';
import Options from 'bundles/compound-assessments/components/form-parts/options/Options';
import Git from 'bundles/compound-assessments/components/form-parts/git/Git';
import Poll from 'bundles/compound-assessments/components/form-parts/poll/Poll';

import initBem from 'js/lib/bem';

import getFormPartData from './lib/getFormPartData';

const bem = initBem('FormPartCA');

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

    if (questionType && prompt && (response || responses)) {
      let Component: $TSFixMe;

      switch (questionType) {
        case 'boxViewDocumentAnnotation':
          Component = BoxViewDocumentAnnotation;
          break;
        case 'checkbox':
          Component = Checkbox;
          break;
        case 'checkboxReflect':
          Component = Checkbox;
          break;
        case 'codeExpression':
          Component = CodeExpression;
          break;
        case 'mathExpression':
          Component = MathExpression;
          break;
        case 'mcq':
          Component = Mcq;
          break;
        case 'mcqReflect':
          Component = Mcq;
          break;
        case 'poll':
        case 'checkboxPoll':
          Component = Poll;
          break;
        case 'reflect':
          Component = TextAreaBox;
          break;
        case 'regex':
          Component = TextInputBox;
          break;
        case 'singleNumeric':
          Component = TextInputBox;
          break;
        case 'textExactMatch':
          Component = TextInputBox;
          break;
        case 'widget':
          Component = Widget;
          break;
        case 'richText':
          Component = RichText;
          break;
        case 'url':
          Component = UrlPart;
          break;
        case 'offPlatform':
          Component = OffPlatform;
          break;
        case 'fileUpload':
          Component = FileUpload;
          break;
        case 'plainText':
          Component = PlainText;
          break;
        case 'multiLineInput':
          Component = MultiLineInput;
          break;
        case 'options':
          Component = Options;
          break;
        case 'git':
          Component = Git;
          break;
        default:
          // never
          break;
      }

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
          return (
            <div className={bem()}>
              <Component {...childProps} />
            </div>
          );
        } else if (id && response) {
          return (
            <ChangedResponse
              id={id}
              // Separate response definitions for the same thing.
              response={response as ChangedResponseType}
              localScopeId={localScopeId}
            >
              {({ newResponse, handleChangeResponse }) => (
                <div className={bem()}>
                  <Component {...childProps} response={newResponse} onChangeResponse={handleChangeResponse} />
                </div>
              )}
            </ChangedResponse>
          );
        }
      }
    }
  }
  return null;
};

export default FormPart;
