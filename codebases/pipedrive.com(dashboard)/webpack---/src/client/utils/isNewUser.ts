// Exactly the same logic as webapp
export function isNewUser(user: any) {
	const currentTime = new Date().getTime();
	const startTime = new Date(user.get('created')).getTime();
	const differenceInHours = (currentTime - startTime) / 3600000;
	const hoursThreshold = 24;

	return differenceInHours < hoursThreshold;
}
