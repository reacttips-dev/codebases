import React from 'react';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/common/finalSale.scss';

interface Props {
  className?: string;
}
const FinalSale = ({ className }: Props) => {
  const { testId, marketplace: { pdp: { showFinalSale } } } = useMartyContext();

  if (!showFinalSale) {
    return null;
  }

  return (
    <em className={cn(css.container, className)} data-test-id={testId('finalSale')}>Final Sale</em>
  );
};

export default FinalSale;
