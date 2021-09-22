import React from 'react';
import { SvgCheck, SvgWarning, SvgInfoFilled, SvgError } from '@coursera/coursera-ui/svg';
import { Strong } from '@coursera/coursera-ui';
import initBem from 'js/lib/bem';

import 'css!./__styles__/PlagiarismDetectionResultLayout';

const bem = initBem('PlagiarismDetectionResultLayout');

export const RESULT_TYPES = {
  RETRY: 'retry',
  DETECTED: 'detected',
  ERROR: 'error',
  NOT_DETECTED: 'not_detected',
} as const;

type ResultType = typeof RESULT_TYPES[keyof typeof RESULT_TYPES];

type Props = {
  title: React.ReactNode;
  type: ResultType;
};

const getResultIcon = (resultType: ResultType) => {
  const iconSize = 22; // 22px
  switch (resultType) {
    case RESULT_TYPES.RETRY:
      return <SvgInfoFilled size={iconSize} />;
    case RESULT_TYPES.DETECTED:
      return <SvgWarning size={iconSize} />;
    case RESULT_TYPES.ERROR:
      return <SvgError size={iconSize} color="#F2D049" />;
    case RESULT_TYPES.NOT_DETECTED:
      return <SvgCheck size={iconSize} />;
    default:
      return null;
  }
};

/**
 * Component primarily for managing different coloring/icons of different types of plagiarism results
 */
const PlagiarismDetectionResultLayout: React.FC<Props> = (props) => {
  const { title, type, children } = props;

  return (
    <div className={bem(undefined, type)}>
      <div className={bem('left-container')}>
        <div className={bem('icon')}>{getResultIcon(type)}</div>
      </div>
      <div className={bem('right-container')}>
        <Strong tag="div">{title}</Strong>
        {children && <div className={bem('children')}>{children}</div>}
      </div>
    </div>
  );
};

export default PlagiarismDetectionResultLayout;
