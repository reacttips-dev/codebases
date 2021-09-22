import React from 'react';
import { Button, Spinner } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { useLeadFilterStatus } from 'Hooks/useLeadFilterStatus';
import { useUIContext } from 'Leadbox/useUIContext';
import styled, { css } from 'styled-components';
import { useFeatureFlags } from 'Hooks/useFeatureFlags';

import { SelectedPill } from './SelectedPill';
import { BulkArchiveButton } from './BulkArchiveButton';
import { BulkDeleteButton } from './BulkDeleteButton';
import * as S from './ActionBar.styles';
import { BulkUnarchiveButton } from './BulkUnarchiveButton';

type Props = {
	readonly isRefetching: boolean;
	readonly resetSelection?: () => void;
};

const ToggleBulkSidebarButton = styled(Button)<{
	hasMargin: boolean;
}>`
	${(props) =>
		props.hasMargin &&
		css`
			margin-right: 8px;
		`}
`;

export const ActionBarBulkActions: React.FC<Props> = ({ isRefetching, resetSelection }) => {
	const translator = useTranslator();
	const leadFilterStatus = useLeadFilterStatus();
	const uiContext = useUIContext();
	const [LEADS_EXPORT] = useFeatureFlags(['LEADS_EXPORT']);

	const isInArchive = leadFilterStatus === 'ARCHIVED';

	return (
		<>
			<S.Section data-testid="ActionBarBulkActions">
				{isInArchive ? (
					<BulkUnarchiveButton resetSelection={resetSelection} />
				) : (
					<BulkArchiveButton resetSelection={resetSelection} />
				)}
				<BulkDeleteButton resetSelection={resetSelection} />
			</S.Section>
			<S.Section>
				{isRefetching && <Spinner light />}
				<SelectedPill resetSelection={resetSelection} />
				<ToggleBulkSidebarButton
					hasMargin={!LEADS_EXPORT}
					data-testid="ToggleBulkSidebarButton"
					onClick={() => {
						uiContext.bulkSidebar.isVisible ? uiContext.bulkSidebar.hide() : uiContext.bulkSidebar.show();
					}}
				>
					{uiContext.bulkSidebar.isVisible
						? translator.gettext('Hide panel')
						: translator.gettext('Show panel')}
				</ToggleBulkSidebarButton>
			</S.Section>
		</>
	);
};
