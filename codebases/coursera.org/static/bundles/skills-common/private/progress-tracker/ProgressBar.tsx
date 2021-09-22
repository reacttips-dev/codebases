import * as React from 'react';
import Measure from 'react-measure';

import ProgressBarSvg, { ProgressBarSvgProps } from './ProgressBarSvg';

export type ProgressBarProps = ProgressBarSvgProps;

const ProgressBar = (props: ProgressBarProps): JSX.Element => {
  return (
    <Measure client bounds>
      {({ measureRef, contentRect }) => (
        <div ref={measureRef} style={{ width: '100%' }}>
          {contentRect?.bounds?.width !== undefined && <ProgressBarSvg width={contentRect?.bounds.width} {...props} />}
        </div>
      )}
    </Measure>
  );
};

ProgressBar.Placeholder = (): JSX.Element => (
  <Measure client bounds>
    {({ measureRef, contentRect }) => (
      <div ref={measureRef} style={{ width: '100%' }}>
        {contentRect?.bounds?.width !== undefined && <ProgressBarSvg width={contentRect?.bounds.width} />}
      </div>
    )}
  </Measure>
);

export default ProgressBar;
