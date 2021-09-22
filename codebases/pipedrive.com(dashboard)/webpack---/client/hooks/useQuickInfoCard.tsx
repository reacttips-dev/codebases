import Logger from '@pipedrive/logger-fe';
import { ModalContext } from 'components/AddModal/AddModal.context';
import React, { useContext, useState } from 'react';
import { ADD_MODALS_SERVICE_NAME } from 'utils/logger';

export interface QuickInfoCardProps {
	type: string;
	id: number;
	source: string;
	popoverProps: any;
}

export default function useQuickInfoCard(): React.ComponentType<QuickInfoCardProps> | null {
	const { componentLoader, userSelf, pdMetrics } = useContext(ModalContext);
	const [QuickInfoCard, setQuickInfoCard] = useState<React.ComponentType<QuickInfoCardProps> | null>(null);
	const logger = new Logger(ADD_MODALS_SERVICE_NAME);

	React.useEffect(() => {
		const fetchQuickInfoCard = async () => {
			const { default: QuickInfoCardComponent } = await componentLoader.load('quick-info-card');

			setQuickInfoCard(() => (props: QuickInfoCardProps) => (
				<QuickInfoCardComponent webappApi={{ userSelf, logger, pdMetrics }} {...props} />
			));
		};

		fetchQuickInfoCard();
	}, []);

	return QuickInfoCard;
}
