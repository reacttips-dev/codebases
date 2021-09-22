import React from 'react';
import classNames from 'classnames';
import a11yKeyPress from 'js/lib/a11yKeyPress';

import type { Highlight } from 'bundles/video-highlighting/types';

import 'css!./__styles__/HighlightCapturePreview';

type Props = {
  show: boolean;
  onClick: () => void;
  highlight: Highlight | null;
};

const HighlightCapturePreview = ({ show, highlight, onClick }: Props) => {
  return (
    <div
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyPress={(event) => a11yKeyPress(event, onClick)}
      className={classNames('rc-HighlightCapturePreview', { show })}
    >
      {highlight && <img alt={highlight.transcriptText} src={highlight.snapshotDataUrl} />}
    </div>
  );
};

export default HighlightCapturePreview;
