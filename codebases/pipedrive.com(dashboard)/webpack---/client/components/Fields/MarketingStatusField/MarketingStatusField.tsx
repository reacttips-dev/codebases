import React, { useContext, useEffect, useState } from 'react';
import { ModalContext } from 'components/AddModal/AddModal.context';

interface Props {
	value: string;
	onComponentChange: (param: string) => void;
}

export interface MarketingStatusSelectProps {
	value: string;
	onChange: (param: string) => void;
	conditional?: boolean;
	state?: string;
}

export function MarketingStatusField({ onComponentChange, value }: Props) {
	const { componentLoader } = useContext(ModalContext);
	const [MicroFEComponent, setMicroFEComponent] =
		useState<{Component: React.ComponentType<MarketingStatusSelectProps> | null}>({ Component: null });

	useEffect(() => {
		(async () => {
			const Component = await componentLoader.load('marketing-ui:marketingStatusSelect');

			setMicroFEComponent({ Component });
		})();
	}, []);

	if (!MicroFEComponent.Component) {
		return null;
	}

	return <MicroFEComponent.Component onChange={onComponentChange} value={value} conditional={false} state="create"/>;
}
