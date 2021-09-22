import React from 'react';
import { Spinner } from '@pipedrive/convention-ui-react';

import style from './style.css';

function fetch() {
	return (
		<div className={style.Fetching}>
			<Spinner size="l" />
		</div>
	);
}

export default fetch;
