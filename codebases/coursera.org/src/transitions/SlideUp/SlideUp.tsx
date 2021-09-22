import React from 'react';

import { Slide, SlideProps } from '@material-ui/core';

const SlideUp = (
  props: SlideProps,
  ref: React.Ref<unknown>
): React.ReactElement<SlideProps> => {
  return <Slide ref={ref} direction="up" {...props} />;
};

export default React.forwardRef(SlideUp);
