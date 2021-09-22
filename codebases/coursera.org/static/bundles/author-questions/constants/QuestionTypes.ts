/**
 * Constants representing different question types
 */
import _t from 'i18n!nls/author-questions';

export const QuestionTypes = {
  MultipleChoice: 'checkbox',
  SingleChoice: 'mcq',
  Code: 'codeExpression',
  Math: 'mathExpression',
  Regex: 'regex',
  Numeric: 'singleNumeric',
  Text: 'textExactMatch',
  ReflectMultipleChoice: 'checkboxReflect',
  ReflectSingleChoice: 'mcqReflect',
  ReflectText: 'reflect',
  Continue: 'continue',
  Poll: 'poll',
  CheckboxPoll: 'checkboxPoll',
  Widget: 'widget',
  QuestionBankQuestionBlock: 'questionBankQuestionBlock',
} as const;

export const getQuestionTypeLabel = (type?: typeof QuestionTypes[keyof typeof QuestionTypes]) => {
  const translations = {
    [QuestionTypes.MultipleChoice]: _t('Multiple correct answers'),
    [QuestionTypes.SingleChoice]: _t('Single correct answer'),
    [QuestionTypes.Code]: _t('Code expression'),
    [QuestionTypes.Math]: _t('Math expression'),
    [QuestionTypes.Regex]: _t('Regular expression'),
    [QuestionTypes.Numeric]: _t('Numeric'),
    [QuestionTypes.Text]: _t('Text match'),
    [QuestionTypes.ReflectMultipleChoice]: _t('Reflective multiple choice'),
    [QuestionTypes.ReflectSingleChoice]: _t('Reflective single choice'),
    [QuestionTypes.ReflectText]: _t('Reflective text answer'),
    [QuestionTypes.Continue]: _t('Pause and Reflect'),
    [QuestionTypes.Poll]: _t('Poll'),
    [QuestionTypes.CheckboxPoll]: _t('Checkbox Poll'),
    [QuestionTypes.Widget]: _t('Plugin Question'),
    [QuestionTypes.QuestionBankQuestionBlock]: _t('Question block from question bank'),
  };
  return type ? translations[type] || '' : '';
};

export default QuestionTypes;
