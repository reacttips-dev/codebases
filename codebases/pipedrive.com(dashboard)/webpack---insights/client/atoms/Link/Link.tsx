import React from 'react';

import styles from './Link.pcss';

interface LinkProps {
	href: string;
	text: string;
	onClick?: () => void;
}

const Link: React.FC<LinkProps> = ({ href, text, ...props }) => {
	return (
		<a href={href} className={styles.link} {...props}>
			{text}
		</a>
	);
};

export default Link;
