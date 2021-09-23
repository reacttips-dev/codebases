import React from 'react';
import PropTypes from 'prop-types';
import { Footer } from '../Footer';
import styles from './styles.sass';

// HOC for AMP page rendering
const AMPPage = ({ children }) => (
  <div className={styles.ampPage}>
    {children}
    <Footer />
  </div>
);

AMPPage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
    .isRequired,
};

export default AMPPage;
