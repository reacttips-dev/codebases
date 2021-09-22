import React from 'react';
import { Panel, Spacing } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

const NotFound: React.FC = () => {
	const translator = useTranslator();

	return (
		<Spacing all="m">
			<Panel color="yellow">
				{translator.gettext(
					'This item is not visible to you or does not exist. ' +
						'If you think you should be able to access this item, ' +
						'please contact an administrator from your company.',
				)}
			</Panel>
		</Spacing>
	);
};

export default React.memo(NotFound);
