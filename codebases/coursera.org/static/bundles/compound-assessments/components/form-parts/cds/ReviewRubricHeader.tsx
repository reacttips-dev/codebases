import React from 'react';
import initBem from 'js/lib/bem';

import 'css!./__styles__/ReviewRubricHeader';
import { Typography } from '@coursera/cds-core';

const bem = initBem('ReviewRubricHeader');

type Props = {
  children: JSX.Element;
};

const ReviewRubricHeader = ({ children }: Props) => {
  return (
    <div className={bem()}>
      <div className={bem('header')}>
        <Typography variant="body1" className={bem('left-side')}>
          {children}
        </Typography>
        {/* TODO: Render when feature gets implemented */}
        {/* <View rootClassName={bem('right-side')}>Rubric not clear? <Button size="zero" type="link" label={_t('Give Feedback')} onClick={() => {}} /></View> */}
      </div>
    </div>
  );
};

export default ReviewRubricHeader;
