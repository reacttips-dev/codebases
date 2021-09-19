import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/common/lowStockLabel.scss';

const LowStockLabel = ({ label = 'Low stock' }) => {
  const { testId } = useMartyContext();
  return (
    <p
      className={css.lowStockLabel}
      data-test-id={testId('lowStockLabel')}
      aria-label="Low stock">
      {label}
    </p>
  );
};

export default LowStockLabel;
