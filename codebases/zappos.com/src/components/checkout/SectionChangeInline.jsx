import { Link } from 'react-router';

import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/checkout/sectionChangeInline.scss';

const SectionChangeInline = ({ label, describedby, onClickEvent, showLink, to }) => {
  const { testId } = useMartyContext();

  if (!showLink) {
    return null;
  }

  return (
    <Link
      aria-describedby={describedby}
      className={css.changeLink}
      to={to}
      onClick={onClickEvent}
      data-test-id={testId('sectionChangeLink')}>{label}</Link>
  );
};

export default SectionChangeInline;
