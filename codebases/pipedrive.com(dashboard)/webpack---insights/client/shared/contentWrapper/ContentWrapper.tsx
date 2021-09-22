import React from 'react';

import styles from './ContentWrapper.pcss';

const ContentWrapper: React.FC = ({ children }) => {
	return <section className={styles.contentWrapper}>{children}</section>;
};

export default ContentWrapper;
