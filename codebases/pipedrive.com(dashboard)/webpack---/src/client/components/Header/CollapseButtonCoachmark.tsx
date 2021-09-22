import React, { useEffect, useState, useRef } from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import useToolsContext from '../../hooks/useToolsContext';
import { useRootSelector } from '../../store';
import Logger from '@pipedrive/logger-fe';

const logger = new Logger('froot', 'collapseButtonCoachmark');

interface CollapseButtonCoachmarkProps {
	children?: React.ReactNode;
}

const showCollapseButtonCoachMark = (targetElement, iamClient, translator) => {
	return new iamClient.Coachmark({
		tag: 'secondary_menu_collapse',
		parent: targetElement,
		content: translator.gettext(
			'Click to hide the submenu and get more workspace on your screen; click again to bring the menu back',
		),
		appearance: {
			placement: 'bottomRight',
			zIndex: {
				min: 45,
			},
			align: {
				points: ['tl', 'bl'],
				offset: [2, 4],
			},
			width: 400,
		},
		detached: true,
	});
};

export default function CollapseButtonCoachmark({ children }: CollapseButtonCoachmarkProps) {
	const { iamClient } = useToolsContext();
	const translator = useTranslator();
	const { showSecondaryMenuCoachmarks } = useRootSelector((s) => s.navigation);
	const showSecondaryMenuCoachmarksRef = useRef(true);
	const [coachMark, setCoachMark] = useState(null);
	const element = useRef();

	showSecondaryMenuCoachmarksRef.current = showSecondaryMenuCoachmarks;

	useEffect(() => {
		if (!coachMark && element.current && iamClient) {
			// set coachmark as empty object before setTimeout to avoid setCoachMarkAsync running twice in useEffect
			setCoachMark({});

			// delay the creation of the coachmark until we are sure that useMenuCoachmark
			// has created all 4 initial coachmarks and showSecondaryMenuCoachMarks has the correct value
			setTimeout(() => {
				if (showSecondaryMenuCoachmarksRef.current) {
					setCoachMark(showCollapseButtonCoachMark(element.current, iamClient, translator));
				}
			}, 2000);
		}

		return () => {
			try {
				coachMark?.remove?.();
				setCoachMark(null);
			} catch (error) {
				logger.logError('Coachmark failed to close', error);
			}
		};
	}, [element.current, iamClient]);

	function handleCoachMark() {
		if (coachMark && coachMark.tag && iamClient) {
			coachMark.close();
			setCoachMark(null);
		}
	}

	return (
		<div onClick={handleCoachMark} ref={element}>
			{children}
		</div>
	);
}
