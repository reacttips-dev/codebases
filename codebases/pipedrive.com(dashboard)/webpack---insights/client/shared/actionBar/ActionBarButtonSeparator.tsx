import React from 'react';
import { Separator } from '@pipedrive/convention-ui-react';

const ActionBarButtonSeparator: React.FC = () => {
	return (
		<Separator
			type="vertical"
			spacing={{ vertical: 'xs', horizontal: 'm' }}
		/>
	);
};

export default ActionBarButtonSeparator;
