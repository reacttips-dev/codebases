import React from 'react';
import styled from 'styled-components';
import { useInFlightState } from 'Leadbox/useUIContext';
import { LeadsListLoader } from 'Leadbox/LoadUIState/LeadsListLoader';

const Overlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(255, 255, 255, 0.8);
	z-index: 10;
`;

export function LeadsListInFlightOverlay() {
	const inFlight = useInFlightState();

	if (!inFlight.isActive) {
		return null;
	}

	return (
		<Overlay>
			<LeadsListLoader grayed={false} />
		</Overlay>
	);
}
