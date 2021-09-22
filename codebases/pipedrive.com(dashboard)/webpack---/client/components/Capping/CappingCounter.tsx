import React, { useContext, useEffect, useState } from 'react';

import { UsageCaps } from 'Types/types';
import { ModalContext } from 'components/AddModal/AddModal.context';

import styles from './CappingCounter.pcss';

interface Props {
	usageCaps: UsageCaps;
	usageCapsMapping: any;
	isAccountSettingsEnabled: boolean;
	isReseller: boolean;
}

export interface CappingPopoverProps {
	limitType: string;
	tierCode: string;
	numberOfItems: UsageCaps['usage'];
	tierLimit: UsageCaps['cap'];
	nextTierLimit: number;
	canBill: boolean;
	nextTier: string;
	isReseller: boolean;
}

export function CappingCounter({ usageCaps, usageCapsMapping, isAccountSettingsEnabled, isReseller }: Props) {
	const { componentLoader } = useContext(ModalContext);
	const [MicroFEComponent, setMicroFEComponent] = useState<{
		Component: React.ComponentType<CappingPopoverProps> | null;
	}>({ Component: null });

	useEffect(() => {
		(async () => {
			const Component = await componentLoader.load('froot:cappingPopover');

			setMicroFEComponent({ Component });
		})();
	}, []);

	if (!MicroFEComponent.Component) {
		return null;
	}

	return (
		<div className={styles.cappingInfo}>
			<div className={styles.cappingText}>{`${usageCaps.usage}/${usageCaps.cap}`}</div>
			<MicroFEComponent.Component
				limitType="deals"
				tierCode={usageCapsMapping?.currentTier}
				numberOfItems={usageCaps?.usage}
				tierLimit={usageCaps?.cap}
				nextTierLimit={usageCapsMapping?.mapping?.[usageCapsMapping?.nextTier].deals}
				canBill={isAccountSettingsEnabled}
				nextTier={usageCapsMapping?.nextTier}
				isReseller={isReseller}
			/>
		</div>
	);
}
