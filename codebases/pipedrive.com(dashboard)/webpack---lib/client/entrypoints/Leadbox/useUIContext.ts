import { useContext } from 'react';
import { UIContext } from 'Leadbox/UIContext';

export function useUIContext() {
	return useContext(UIContext);
}

export function useInFlightState() {
	const { inFlight } = useUIContext();

	return inFlight;
}
