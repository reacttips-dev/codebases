import React, { ReactElement, RefObject, useContext, useEffect, useRef } from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { useFeatureFlags } from 'Hooks/useFeatureFlags';
import { useCoachmark } from 'Hooks/useCoachMark';
import { useUIContext } from 'Leadbox/useUIContext';
import { CoachmarkHandler } from 'Utils/coachmarksHandler';
import { WebappApiContext } from 'Components/WebappApiContext';

import * as S from './LeadsExportCoachmarkWrapper.styles';

export const LEADS_EXPORT_COACHMARK_TAG = 'leads_export';

const coachmarkHandler = new CoachmarkHandler(null);

type CoachmarkProps = { parentRef: RefObject<HTMLDivElement> };

const Coachmark: React.FC<CoachmarkProps> = ({ parentRef }) => {
	const translator = useTranslator();
	const {
		coachmark: { setIsVisible },
	} = useUIContext();

	const coachmark = useCoachmark({
		tag: LEADS_EXPORT_COACHMARK_TAG,
		content: translator.gettext('Export this filtered list either in CSV or Excel format'),
		parentRef,
		appearance: {
			placement: 'bottomLeft',
			zIndex: 3,
			width: 284,
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

type CoachmarkWrapperProps = {
	render: (closeCoachmark: () => void) => ReactElement;
};

export const closeLeadsExportCoachmark = () => {
	coachmarkHandler.closeCoachmark();
};

export const LeadsExportCoachmarkWrapper: React.FC<CoachmarkWrapperProps> = ({ render }) => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [LEADS_EXPORT] = useFeatureFlags(['LEADS_EXPORT']);
	const {
		permissions: { canUseExport },
	} = useContext(WebappApiContext);

	return (
		<S.Wrapper ref={wrapperRef}>
			{LEADS_EXPORT && canUseExport && <Coachmark parentRef={wrapperRef} />}
			{render(coachmarkHandler.closeCoachmark)}
		</S.Wrapper>
	);
};
