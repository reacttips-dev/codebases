import boxAnnotationConfig from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/boxAnnotation/modelConfig';
import multiLineInputConfig from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/multiLineInput/modelConfig';
import optionsConfig from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/options/modelConfig';
import singleLineInputConfig from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/singleLineInput/modelConfig';
import yesNoConfig from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/yesNo/modelConfig';

export default {
  yesNo: yesNoConfig,
  options: optionsConfig,
  singleLineInput: singleLineInputConfig,
  multiLineInput: multiLineInputConfig,
  boxViewDocumentAnnotation: boxAnnotationConfig,
};
