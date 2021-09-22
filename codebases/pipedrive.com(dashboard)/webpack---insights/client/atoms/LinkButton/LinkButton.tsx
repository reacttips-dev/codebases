import React from 'react';
import { Icon } from '@pipedrive/convention-ui-react';

import styles from './LinkButton.pcss';

interface LinkButtonPorps {
	text: string;
	icon: string;
	onClick: () => void;
	disabled: boolean;
}

const LinkButton: React.FC<LinkButtonPorps> = ({
	text,
	icon,
	onClick,
	disabled,
}) => {
	return (
		<button
			type="button"
			disabled={disabled}
			className={styles.linkButton}
			onClick={onClick}
		>
			{icon && <Icon icon={icon} size="s" color="blue" />}
			<span className={styles.buttonText}>{text}</span>
		</button>
	);
};

export default LinkButton;
