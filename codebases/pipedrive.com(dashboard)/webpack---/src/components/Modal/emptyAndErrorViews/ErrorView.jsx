import React from 'react';
import { useDispatch } from 'react-redux';

import { Icon, Spacing } from '@pipedrive/convention-ui-react';

import styles from './style.scss';
import translator from 'utils/translator';
import communicationErrorImage from './communicationError.svg';
import { getSearchResults } from 'store/modules/itemSearch';

function ErrorView() {
	const dispatch = useDispatch();
	const retryClick = () => dispatch(getSearchResults());

	return (
		<div className={styles.wrapper}>
			<img src={communicationErrorImage} alt="communication-error" />
			<div className={styles.title}>{translator.gettext('Something went wrong')}</div>
			<Spacing bottom="s" className={styles.centeredText}>
				{translator.gettext('We couldn’t search.')}
			</Spacing>
			<div className={styles.cta}>
				<Icon icon="refresh" color="blue" size="s" />
				<div onClick={retryClick}>{translator.gettext('Retry')}</div>
			</div>
		</div>
	);
}

export default ErrorView;
