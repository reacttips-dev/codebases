import PropTypes from 'prop-types';

import css from 'styles/components/checkout/sectionDivider.scss';

const SectionDivider = () => (
  <div className={css.divider} />
);

SectionDivider.contextTypes = {
  testId: PropTypes.func
};

export default SectionDivider;
