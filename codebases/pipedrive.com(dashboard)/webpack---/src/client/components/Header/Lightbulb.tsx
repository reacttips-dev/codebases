import React from 'react';
import { Icon } from '@pipedrive/convention-ui-react';

import { HeaderTooltip } from './index';
import { HeaderIcon } from './styled';
import { hideSupport } from './helpers';
import { useDataTestID } from './helpers/lightbulb-testing';

enum BulbIcons {
	default = 'assistant',
	snoozed = 'assistant-snoozed',
}

export default function Lightbulb({
	isBulbActive,
	isSidebarOpen,
	toggleSidebar,
	bulbIcon,
	translator,
}: {
	isBulbActive: boolean;
	isSidebarOpen: boolean;
	toggleSidebar: () => void;
	bulbIcon: BulbIcons;
	translator: {
		gettext: (str) => string;
	};
}) {
	const dataTestID = useDataTestID({ isSidebarOpen, isBulbActive });

	const onClick = () => {
		toggleSidebar();

		hideSupport();
	};

	return (
		<HeaderTooltip content={translator.gettext('Sales Assistant')}>
			<HeaderIcon
				data-test={dataTestID}
				active={isSidebarOpen}
				lastItem={false}
				yellow={isBulbActive}
				aria-label={translator.gettext('Sales Assistant')}
				onClick={onClick}
				tabIndex={0}
			>
				<Icon icon={bulbIcon || BulbIcons.default} color="black-64" />
			</HeaderIcon>
		</HeaderTooltip>
	);
}
