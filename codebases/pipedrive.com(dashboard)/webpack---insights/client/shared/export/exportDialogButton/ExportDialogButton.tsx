import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { Button, Tooltip } from '@pipedrive/convention-ui-react';

import styles from './ExportDialogButton.pcss';

interface ExportDialogButtonProps {
	onClick: () => void;
	hasPermission: boolean;
	buttonText: string;
	className?: string;
}

const ExportDialogButton: React.FC<ExportDialogButtonProps> = ({
	onClick,
	hasPermission,
	buttonText,
	className,
}) => {
	const translator = useTranslator();

	const exportButton = (
		<Button
			disabled={!hasPermission}
			className={className}
			onClick={onClick}
		>
			{buttonText}
		</Button>
	);

	if (!hasPermission) {
		return (
			<Tooltip
				className={styles.tooltip}
				placement="bottom"
				content={
					<span>
						{translator.gettext('Ask an admin user for permission')}
					</span>
				}
			>
				{exportButton}
			</Tooltip>
		);
	}

	return exportButton;
};

export default ExportDialogButton;
