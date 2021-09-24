import React from 'react';
import cn from 'classnames';
import useApplication from '../../../hooks/useApplication';
import useObservable from '../../../hooks/useObservable';
import { extensionType } from '../../../util';

export default function File({ file, showTooltipOnTop }) {
  const application = useApplication();
  const rewindLargestChangeSize = useObservable(application.rewindLargestChangeSize);

  // If largestChangeSize is unavailable due to missing commit metadata, fall
  // back to making all commits the same height and the change size as flex
  // ratio so that change height is relative to other files in the revision.
  const style = {};
  if (rewindLargestChangeSize === null) {
    style.flex = file.changeSize;
  } else {
    const sizePercentage = Math.round((file.changeSize / rewindLargestChangeSize) * 100);
    const heightPercentage = Math.max(12, Math.round(sizePercentage));
    style.height = `${heightPercentage}%`;
  }

  return (
    <div
      className={cn('rewind-file', extensionType(file.path))}
      style={style}
      data-tooltip-left
      data-tooltip-top={showTooltipOnTop || undefined}
      data-tooltip={file.path}
    />
  );
}
