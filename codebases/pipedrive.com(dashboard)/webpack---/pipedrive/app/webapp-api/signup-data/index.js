import SignupModal from './model';

export default new Promise((resolve) => {
	const signupData = new SignupModal();

	signupData.initialPull(() => {
		resolve(signupData);
	});
});
