import React from 'react';
import cn from 'classnames';

import css from 'styles/components/icons/fitSurveyValue.scss';
interface Props {
  value: number;
}

const makeBubbles = ({ value: selectedBubble }: Props) => (
  [1, 2, 3, 4, 5].map(i => (
    <span key={i} className={cn(css.bubble, { [css.selected]: i === selectedBubble })} />
  ))
);

const FitSurveyValue = (props: Props) => (
  <div className={css.container}>
    <div className={css.arm} />
    <div className={css.bubbles}>{makeBubbles(props)}</div>
  </div>
);

export default FitSurveyValue;
