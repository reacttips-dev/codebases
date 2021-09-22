export default function reloadPage() {
	// skipReloads is used in UI tests
	// @ts-ignore
	if (!window.skipReloads) {
		location.assign('/');
	}
}
