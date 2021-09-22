import React from 'react';
import { useSelector, useStore } from 'react-redux';

import { ModalState } from '../store/types';
import { closeModal, afterCloseModal } from '../store/actions';

interface Props {
	MicroFEComponent: any;
}

export function ModalHost({ MicroFEComponent }: Props) {
	const modalName = useSelector((s: ModalState) => s.modalName);
	const visible = useSelector((s: ModalState) => s.visible);
	const mounted = useSelector((s: ModalState) => s.mounted);
	const modalHash = useSelector((s: ModalState) => s.modalHash);
	const options = useSelector((s: ModalState) => s.options);
	const store = useStore();

	if (!modalName && !visible && !mounted) {
		return null;
	}

	return (
		<MicroFEComponent
			key={modalHash}
			componentName={modalName}
			componentProps={{
				...options,
				visible,
				onClose() {
					store.dispatch(closeModal());
					options?.onClose?.();
				},
				onAfterClose() {
					if (options.onAfterClose === false) {
						return;
					}
					store.dispatch(afterCloseModal());
				},
			}}
		/>
	);
}
