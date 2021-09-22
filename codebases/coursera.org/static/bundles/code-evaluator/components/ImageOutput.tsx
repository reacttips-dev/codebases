import React from 'react';

import type { ImageDataOutputContents } from 'bundles/code-evaluator/models/EvaluationResponse';

class ImageOutput extends React.Component<{
  output: ImageDataOutputContents;
}> {
  render() {
    const { imageType, data } = this.props.output;
    const src = `data:${imageType};base64,${data}`;

    return (
      <div className="rc-ImageOutput">
        <img src={src} alt="" />
      </div>
    );
  }
}

export default ImageOutput;
