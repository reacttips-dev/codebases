import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import { Error } from './Error';
import NetworkErrorIcon from './NetworkErrorIcon.svg';

type Props = {
	readonly onReload?: () => void;
};

export const InternetConnectionError: React.FC<Props> = (props) => {
	const translator = useTranslator();

	const openIntercom = (e: React.MouseEvent) => {
		e.preventDefault();

		const intercom = window.Intercom;
		intercom('show');
	};

	return (
		<Error
			iconComponent={<NetworkErrorIcon />}
			title={translator.gettext('It seems there is something wrong with your internet connection.')}
			subtitle={
				<>
					{translator.gettext('Please try again. If this keeps happening,')}
					<a onClick={openIntercom} href="#">
						{' '}
						{translator.gettext('reach out to support')}
					</a>
					.
				</>
			}
			onReload={props.onReload}
		/>
	);
};
