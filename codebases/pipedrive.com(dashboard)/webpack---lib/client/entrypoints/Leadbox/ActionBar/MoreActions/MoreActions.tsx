import { Button, Icon, Option, Spacing } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import React, { useContext } from 'react';
import { useExportModal } from 'Leadbox/ActionBar/useExportModal';
import { useUIContext } from 'Leadbox/useUIContext';
import { useFeatureFlags } from 'Hooks/useFeatureFlags';
import { WebappApiContext } from 'Components/WebappApiContext';

import * as S from './MoreActions.styles';
import { LeadsExportCoachmarkWrapper } from './LeadsExportCoachmarkWrapper';

interface Props {
	isLeadSelected: boolean;
}

export const MoreActions: React.FC<Props> = ({ isLeadSelected }) => {
	const uiContext = useUIContext();
	const {
		reportBadLeadsModal: { show },
	} = uiContext;
	const translator = useTranslator();
	const onExportClick = useExportModal();
	const [PROSPECTOR_OPTIMIZED_FLOWS, LEADS_EXPORT] = useFeatureFlags(['PROSPECTOR_OPTIMIZED_FLOWS', 'LEADS_EXPORT']);

	const {
		permissions: { canUseExport },
	} = useContext(WebappApiContext);

	const isReportLeadVisible = PROSPECTOR_OPTIMIZED_FLOWS && isLeadSelected;
	const isExportVisible = LEADS_EXPORT && canUseExport;

	const anyActionVisible = isReportLeadVisible || isExportVisible;

	if (!anyActionVisible) {
		return null;
	}

	return (
		<S.MoreActionsPopover
			placement="bottom-end"
			spacing="none"
			content={
				<>
					{isExportVisible && (
						<Option onClick={onExportClick}>{translator.gettext('Export filter results')}</Option>
					)}
					{isReportLeadVisible && (
						<Option onClick={show}>{translator.gettext('Report inaccurate lead')}</Option>
					)}
				</>
			}
		>
			<Spacing right="m">
				<LeadsExportCoachmarkWrapper
					render={(closeCoachmark) => (
						<Button data-testid="MoreActionsButton" onClick={closeCoachmark}>
							<Icon icon="ellipsis" size="s" />
						</Button>
					)}
				/>
			</Spacing>
		</S.MoreActionsPopover>
	);
};
