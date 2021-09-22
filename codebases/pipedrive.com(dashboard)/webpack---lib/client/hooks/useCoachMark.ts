import { useEffect, useState } from 'react';
import { useExternalComponent } from 'Hooks/useExternalComponent';

type Align = {
	points: [string, string];
	offset: [number, number];
};

export type HookArgs = {
	tag: string;
	parentRef: React.RefObject<HTMLElement>;
	appearance?: {
		placement: string;
		zIndex: number;
		width?: number;
		align?: Align;
	};
	content: string;
	setIsVisible: (isVisible: boolean) => void;
	detached?: boolean;
};

type ClientProps = {
	tag: string;
	parent?: HTMLElement;
	content?: string;
	visible?: boolean;
	appearance?: {
		placement: string;
		zIndex: number;
		width?: number;
		align?: Align;
	};
	actions?: {
		label: string;
		handler: () => void;
	}[];
	detached?: boolean;
	__debug?: boolean;
	onReady?: (data: { active: boolean }) => void;
	onChange?: (data: { active: boolean }) => void;
	onConfirm?: () => void;
};

export type Coachmark = {
	close: () => void;
	unqueue: () => void;
	confirm: () => void;
	remove: () => void;
};

type IamClient = {
	Coachmark: new (options: ClientProps) => Coachmark;
};

export const useCoachmark = ({
	tag,
	parentRef,
	content,
	appearance,
	detached,
	setIsVisible,
}: HookArgs): Coachmark | null => {
	const iamClient = useExternalComponent<IamClient>('iam-client');
	const [coachmark, setCoachmark] = useState<Coachmark | null>(null);

	useEffect(() => {
		if (!iamClient) {
			return;
		}
		const coachmark = new iamClient.Coachmark({
			tag,
			content,
			parent: parentRef.current ?? undefined,
			appearance,
			detached,
			__debug: false,
			onReady: ({ active }) => setIsVisible(active),
		});

		setCoachmark(coachmark);

		return () => {
			coachmark.remove();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [iamClient, parentRef.current]);

	return coachmark;
};
