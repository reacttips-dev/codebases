import React, { RefObject, useEffect, useRef } from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { useCoachmark } from 'Hooks/useCoachMark';
import { useUIContext } from 'Leadbox/useUIContext';
import { CoachmarkHandler } from 'Utils/coachmarksHandler';

import * as S from './CustomColumnsCoachmark.styles';

export const CUSTOM_COLUMNS_COACHMARK_TAG = 'leads_custom_columns';

const coachmarkHandler = new CoachmarkHandler(null);

type CoachmarkProps = { parentRef: RefObject<HTMLDivElement> };

const Coachmark: React.FC<CoachmarkProps> = ({ parentRef }) => {
	const translator = useTranslator();
	const {
		coachmark: { setIsVisible },
	} = useUIContext();

	const coachmark = useCoachmark({
		tag: CUSTOM_COLUMNS_COACHMARK_TAG,
		content: translator.gettext(
			'Customize your Leads Inbox by adding or removing columns, adjusting their width or reordering them',
		),
		parentRef,
		appearance: {
			placement: 'left',
			zIndex: 3,
			width: 399,
		},
		setIsVisible,
	});

	useEffect(() => {
		if (coachmark) {
			coachmarkHandler.update(coachmark);
		}
	}, [coachmark]);

	return null;
};

export const closeCustomColumnsCoachmark = () => {
	coachmarkHandler.closeCoachmark();
};

export const CustomColumnsCoachmark: React.FC = () => {
	const wrapperRef = useRef<HTMLDivElement>(null);

	return (
		<S.Wrapper ref={wrapperRef}>
			<Coachmark parentRef={wrapperRef} />
		</S.Wrapper>
	);
};
