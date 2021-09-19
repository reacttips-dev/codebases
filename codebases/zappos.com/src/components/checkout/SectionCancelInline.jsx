import { Link } from 'react-router';

import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/checkout/sectionCancelInline.scss';

const SectionCancelInline = ({ describedby, onClickEvent, showLink, to }) => {
  const { testId } = useMartyContext();

  if (!showLink) {
    return null;
  }

  return (
    <Link
      aria-describedby={describedby}
      className={css.cancelLink}
      to={to}
      onClick={onClickEvent}
      data-test-id={testId('cancelLink')}>Cancel</Link>
  );
};

export default SectionCancelInline;
