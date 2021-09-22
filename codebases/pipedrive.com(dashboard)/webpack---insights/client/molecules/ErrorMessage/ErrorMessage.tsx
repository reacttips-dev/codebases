import React from 'react';
import { Button, Spacing, Text } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { showIntercom } from '../../utils/intercom';

import styles from './ErrorMessage.pcss';

interface ErrorMessageProps {
	allowed: boolean;
	message?: string;
	hasRetryButton?: boolean;
	svg?: React.ReactNode;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
	allowed,
	message,
	hasRetryButton = false,
	svg,
}) => {
	const translator = useTranslator();

	return (
		<div className={styles.error}>
			<Spacing all="s">
				<Text>
					{svg}
					<p className={styles.errorHeader}>
						{allowed
							? message ||
							  translator.gettext(
									'Oops! Something went wrong...',
							  )
							: translator.gettext(
									'Uh oh, you should not be here yet!',
							  )}
					</p>
					{allowed && (
						<p className={styles.errorCaption}>
							{translator.gettext(
								'Please try again. If the problem persists, ',
							)}
							<a href="#0" onClick={showIntercom}>
								{translator.gettext(
									'contact our customer support.',
								)}
							</a>
						</p>
					)}
					{hasRetryButton && (
						<Button onClick={() => window.location.reload()}>
							{translator.gettext('Retry')}
						</Button>
					)}
				</Text>
			</Spacing>
		</div>
	);
};

export default ErrorMessage;
