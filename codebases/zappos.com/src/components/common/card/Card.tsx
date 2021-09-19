import React, { ComponentPropsWithRef, forwardRef } from 'react';
import cn from 'classnames';

import css from 'styles/components/common/card.scss';

type CardProps = ComponentPropsWithRef<'article'>;
// eslint-disable-next-line prefer-arrow-callback
export const Card = forwardRef<HTMLElement, CardProps>(function Card(props, ref) {
  const { children, className, ...rest } = props;

  return (
    <article
      ref={ref}
      className={cn(css.card, className)}
      {...rest}>
      {children}
    </article>
  );
});

export default Card;
