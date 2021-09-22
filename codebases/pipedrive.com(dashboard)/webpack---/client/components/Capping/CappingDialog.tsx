import React, { useContext, useEffect, useState } from 'react';

import { UsageCapsMapping } from 'Types/types';
import { ModalContext } from 'components/AddModal/AddModal.context';

interface Props {
	usageCapsMapping: UsageCapsMapping;
	isAccountSettingsEnabled: boolean;
	isReseller: boolean;
}

export interface CappingDialogProps {
	limitType: string;
	tierCode?: string;
	tierLimits: any;
	canBill: boolean;
	visible: boolean;
	onClose: () => void;
	nextTier?: string;
	isReseller: boolean;
}

export function CappingDialog({ usageCapsMapping, isAccountSettingsEnabled, isReseller }: Props) {
	const { componentLoader } = useContext(ModalContext);
	const [isVisible, setIsVisible] = useState(true);
	const [MicroFEComponent, setMicroFEComponent] = useState<{
		Component: React.ComponentType<CappingDialogProps> | null;
	}>({ Component: null });

	useEffect(() => {
		(async () => {
			const Component = await componentLoader.load('froot:cappingDialog');

			setMicroFEComponent({ Component });
		})();
	}, []);

	if (!MicroFEComponent.Component) {
		return null;
	}

	return (
		<MicroFEComponent.Component
			limitType="deals"
			tierCode={usageCapsMapping.currentTier}
			tierLimits={usageCapsMapping.mapping}
			canBill={isAccountSettingsEnabled}
			visible={isVisible}
			nextTier={usageCapsMapping.nextTier}
			isReseller={isReseller}
			onClose={() => {setIsVisible(false)}}
		/>
	);
}
