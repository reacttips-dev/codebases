import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/checkout/sectionTitle.scss';

const SectionTitle = ({ id, isActive, title, step }) => {
  const { testId } = useMartyContext();

  return (
    <h2 className={css.header} data-test-id={testId('sectionTitle')} id={id}>
      <span className={cn({ [css.isActive]: isActive })}>{ !!step && step}</span>
      { ` ${title}` }
    </h2>
  );
};

export default SectionTitle;
