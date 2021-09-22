import React, { ReactElement, useEffect, useRef } from 'react';
import { HookArgs, useCoachmark } from 'Hooks/useCoachMark';
import { useUIContext } from 'Leadbox/useUIContext';
import { CoachmarkHandler } from 'Utils/coachmarksHandler';

import * as S from './CustomFiltersCoachmarkWrapper.styles';

export const CUSTOM_FILTERS_COACHMARK_TAG = 'leads_custom_filters';
export const TEAM_FILTERING_COACHMARK_TAG = 'leads_filtering_by_teams';

type CoachmarkProps = Omit<HookArgs, 'setIsVisible'> & { coachmarkHandler: CoachmarkHandler };

const Coachmark: React.FC<CoachmarkProps> = ({ parentRef, tag, content, appearance, detached, coachmarkHandler }) => {
	const {
		coachmark: { setIsVisible },
	} = useUIContext();

	const coachmark = useCoachmark({
		tag,
		content,
		parentRef,
		appearance,
		setIsVisible,
		detached,
	});

	useEffect(() => {
		if (coachmark) {
			coachmarkHandler.update(coachmark);
		}
	}, [coachmark, coachmarkHandler]);

	return null;
};

type CoachmarkWrapperProps = Omit<CoachmarkProps, 'parentRef' | 'coachmarkHandler'> & {
	render: (closeCoachmark: () => void) => ReactElement;
	disabled?: boolean;
};

export const FiltersCoachmarkWrapper: React.FC<CoachmarkWrapperProps> = ({ render, disabled, ...rest }) => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const coachmarkHandler = new CoachmarkHandler(null);

	return (
		<S.Wrapper ref={wrapperRef}>
			{!disabled && <Coachmark coachmarkHandler={coachmarkHandler} parentRef={wrapperRef} {...rest} />}
			{render(coachmarkHandler.closeCoachmark)}
		</S.Wrapper>
	);
};
