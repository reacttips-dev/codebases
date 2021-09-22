export function addFlowCoachmark(interfaceTour: any) {
	if (!interfaceTour) {
		return;
	}

	interfaceTour.addFlowCoachmark('closedeals_activity_clickmenu', {
		selector: '[data-coachmark="navbar-item-activities"]',
		placement: 'right-end',
	});
}

export function closeFlowCoachmark(interfaceTour: any, navItemKey: string) {
	if (!interfaceTour) {
		return;
	}

	if (navItemKey === 'activities') {
		interfaceTour.closeFlowCoachmark('closedeals_activity_clickmenu');
	}
}
