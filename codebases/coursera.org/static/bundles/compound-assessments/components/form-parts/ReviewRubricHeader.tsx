import React from 'react';
import { View } from '@coursera/coursera-ui';
import initBem from 'js/lib/bem';

import 'css!./__styles__/ReviewRubricHeader';

const bem = initBem('ReviewRubricHeader');

type Props = {
  children: JSX.Element;
};

const ReviewRubricHeader = ({ children }: Props) => {
  return (
    <div className={bem()}>
      <div className={bem('header')}>
        <View rootClassName={bem('left-side')}>{children}</View>
        {/* TODO: Render when feature gets implemented */}
        {/* <View rootClassName={bem('right-side')}>Rubric not clear? <Button size="zero" type="link" label={_t('Give Feedback')} onClick={() => {}} /></View> */}
      </div>
    </div>
  );
};

export default ReviewRubricHeader;
