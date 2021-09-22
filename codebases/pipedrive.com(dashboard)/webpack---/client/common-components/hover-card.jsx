import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from '@pipedrive/react-utils';
import HoverCardCoachmark from './hover-card-coachmark';

let HoverCardComponent;

const HoverCard = (props) => {
	const { webappApi, children, hoverCardProps, addNew, logger, popoverProps, source = 'activity_modal' } = props;
	const [isLoaded, setIsLoaded] = useState(!!HoverCardComponent);

	if (!webappApi || !hoverCardProps) {
		return children;
	}

	const [hoverCardCoachmark, setHoverCardCoachmark] = useState();
	const hoverCardRef = useRef(null);

	const handleHoverCardClick = () => {
		hoverCardCoachmark && hoverCardCoachmark.close();
	};

	useEffect(() => {
		(async () => {
			const hasHoverCardsEnabled = webappApi.userSelf.companyFeatures.get('quick_info_card');

			if (!isLoaded && hasHoverCardsEnabled) {
				const { default: QuickInfoCard } = await webappApi.componentLoader.load(
					'quick-info-card',
				);

				HoverCardComponent = QuickInfoCard;
				setIsLoaded(true);
			}
		})();
	}, []);

	const renderHoverCard = HoverCardComponent && (hoverCardProps.id || addNew);

	return renderHoverCard ? (
		<ErrorBoundary
			error={children}
			logger={logger}
			loggingData={{ facility: 'quick-info-card' }}
		>
			<HoverCardComponent
				{...hoverCardProps}
				webappApi={webappApi}
				source={source}
				popoverProps={{
					className: 'hovercard',
					popperProps: { positionFixed: true },
					placement: 'top-start',
					...popoverProps,
				}}
				renderOnError={() => children}
			>
				<span style={{ overflow: 'hidden', maxWidth: '100%' }}>
					<HoverCardCoachmark
						fieldRef={hoverCardRef}
						setCoachmark={setHoverCardCoachmark}
					>
						<div
							onMouseEnter={() => setTimeout(handleHoverCardClick, 800)}
							ref={hoverCardRef}
						>
							{children}
						</div>
					</HoverCardCoachmark>
				</span>
			</HoverCardComponent>
		</ErrorBoundary>
	) : (
		children
	);
};

HoverCard.propTypes = {
	webappApi: PropTypes.object.isRequired,
	logger: PropTypes.object.isRequired,
	children: PropTypes.any.isRequired,
	hoverCardProps: PropTypes.object.isRequired,
	addNew: PropTypes.object.bool,
	popoverProps: PropTypes.map,
};

export default HoverCard;
