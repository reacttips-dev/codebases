export default async (componentLoader) => {
	const [user, pdMetrics] = await Promise.all([
		await componentLoader.load('webapp:user'),
		await componentLoader.load('webapp:metrics')
	]);

	const fullStoryHelper = {
		start: function() {
			pdMetrics.trackPage(null, null, null, {
				integrations: {
					'All': false,
					'Google Tag Manager': true
				}
			});
			pdMetrics.track(
				'FullStory',
				{
					userId: user.get('id'),
					userName: user.get('name'),
					userEmail: user.get('email'),
					companyId: user.get('company_id'),
					companyName: user.get('company_name'),
					companyStatus: user.get('company_status'),
					userLang: user.get('language').language_code,
					userCreated: user.get('created'),
					isInvitedUser: !!user.settings.get('invited_by_user_id'),
					userType: 1 === user.get('is_admin') ? 'admin' : 'user'
				},
				{
					integrations: {
						'All': false,
						'Google Tag Manager': true
					}
				}
			);
		},
		/**
		 * Fetch FullStory script if necessary and start recording. Fullstory's undocumented comment: FS.restart()
		 * starts recording after it's been stopped. Unless it's been more than half an hour since FS.shutdown was
		 * called, this will create a new page in the current session, like the user navigated to a different url.
		 */
		record: function() {
			if (this.isReady()) {
				window.FS.restart();
			} else {
				fullStoryHelper.start();
			}
		},
		/**
		 * Stop the Fullstory's recording when it has already began. Also, there is method Fs.splitPage() which
		 * shuts down and immediately restarts recording, creating a new page in a session (just for info).
		 */
		stop: function() {
			if (this.isReady()) {
				window.FS.shutdown();
			}
		},
		/**
		 * Indicates if Fullstory is already initiated and if restart and shutdown methods are available.
		 */
		isReady: function() {
			const fsLoaded =
				window.FS &&
				typeof window.FS.restart === 'function' &&
				typeof window.FS.shutdown === 'function';

			return !!fsLoaded;
		}
	};

	return fullStoryHelper;
};
