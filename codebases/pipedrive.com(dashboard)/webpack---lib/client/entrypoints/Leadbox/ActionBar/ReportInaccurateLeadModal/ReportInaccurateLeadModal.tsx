import React from 'react';
import { Modal } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { useUIContext } from 'Leadbox/useUIContext';

export const ReportInaccurateLeadModal: React.FC = () => {
	const translator = useTranslator();
	const uiContext = useUIContext();
	const {
		reportBadLeadsModal: { isVisible, hide },
	} = uiContext;

	return (
		<Modal header={translator.gettext('Select data to report')} backdrop visible={isVisible} onClose={hide}>
			modal content
		</Modal>
	);
};
