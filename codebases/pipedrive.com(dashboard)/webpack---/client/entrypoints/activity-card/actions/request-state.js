export function startActivitySave() {
	return { type: 'ACTIVITY_SAVE_START' };
}
export function activitySaveResult(result) {
	return { type: 'ACTIVITY_SAVE_RESULT', result };
}
