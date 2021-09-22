import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { Button } from '@pipedrive/convention-ui-react';

import NoDeals from '../../utils/svg/NoDeals.svg';
import useRouter from '../../hooks/useRouter';

import styles from './NoDealsMessage.pcss';

const NoDealsMessage = () => {
	const translator = useTranslator();
	const [goTo] = useRouter();

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();

		goTo('/pipeline');
	};

	return (
		<div className={styles.message}>
			<div>
				<NoDeals />
				<h1 className={styles.title}>
					{translator.gettext('Nothing to show here yet')}
				</h1>
				<p className={styles.subtitle}>
					{translator.gettext(
						'Add your first deal and then come back to start exploring Insights',
					)}
				</p>
				<p className={styles.subtitle}>
					<Button
						onClick={handleClick}
						data-test="navigate-to-pipeline"
					>
						{translator.gettext('Add deal')}
					</Button>
				</p>
			</div>
		</div>
	);
};

export default NoDealsMessage;
