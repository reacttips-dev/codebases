import snakeCase from 'lodash/snakeCase';
import Cookies from 'js-cookie';
import Logger from '@pipedrive/logger-fe';
import { subscriptionPlanMap } from './utils';

export default async (componentLoader) => {
	const [user, signup] = await Promise.all([
		componentLoader.load('webapp:user'),
		componentLoader.load('webapp:signup-data')
	]);
	const logger = new Logger('intercom-support-chat');

	return {
		doShowByDefault: () => {
			const requestedToOpen = Cookies.get('support_chat_requested');

			return !!requestedToOpen && requestedToOpen === '1';
		},

		init: function(intercom) {
			const { id } = intercom;

			if (!id) {
				return;
			}

			const settings = this.intercomSettings(id);

			this.loadIntercom(id, settings);
		},

		intercomSettings: (intercomId) => {
			const currentCompanyPlan = user.get('current_company_plan');

			const company = {
				id: user.get('company_id'),
				name: user.get('company_name'),
				company_status: user.get('company_status'),
				created_at: user.get('created'),
				company_plan: subscriptionPlanMap[currentCompanyPlan.id] || null,
				billing_cycle: currentCompanyPlan.billing_cycle || null,
				country: user.get('company_country'),
				seat_count: user.get('seats_quota'),
				users_count: user.get('user_count'),
				has_multiple_pipelines: user.pipelines.length > 1,
				started_paying_at:
					Math.floor(new Date(user.get('started_paying_time')).getTime() / 1000) || null,
				flow_test: user.get('company_id') % 2 === 0 ? 'even' : 'odd',
				recurly_coupons: user.get('recurly_coupons'),
				company_mrr: user.get('current_company_mrr')
			};

			const settings = {
				app_id: intercomId,
				company,
				user_hash: user.get('intercom_user_hash'),
				email: user.get('email'),
				user_id: user.get('id'),
				name: user.get('name'),
				user_type: user.get('is_admin') ? 'admin' : 'user',
				is_invited_user: !!user.settings.get('invited_by_user_id'),
				locale: user.get('locale'),
				language_override: user.get('language').language_code,
				user_signed_up_at: Math.floor(new Date(user.get('created')).getTime() / 1000),
				uses_google_apps:
					user.get('email').includes('@gmail') ||
					user.get('signup_flow_variation') === 'google',
				last_company_id: user.get('company_id'),
				has_new_navigation: true
			};

			const { data: signupData } = signup;

			if (signupData) {
				const { formData } = signupData;

				Object.keys(formData).forEach((key) => {
					const newKey = `sus_${snakeCase(key)}`;

					if (formData[key].companyCreatorSpecific) {
						settings[newKey] = formData[key].value;
					} else {
						settings.company[newKey] = formData[key].value;
					}
				});
			}

			return settings;
		},

		loadIntercom: function(intercomId, intercomSettings) {
			componentLoader.register({
				intercom: {
					js: `https://widget.intercom.io/widget/${intercomId}`
				}
			});

			componentLoader
				.load('intercom')
				.then(() => {
					if (window.Intercom && intercomSettings) {
						window.Intercom('boot', intercomSettings);

						if (this.doShowByDefault()) {
							window.Intercom('show');
						}

						/*
							Due to Router's global handler (https://github.com/pipedrive/webapp/blame/master/pipedrive/app/router.js#L965)
							the Intercom's close button handler never fires since it doesn't have href attribute.

							The following hack sets a handler that fires before Router's one and sets the href attribute
							for a link so the event continue it's propagation.
						*/
						document.addEventListener(
							'click',
							(e) => {
								const valid =
									e && e.target && e.target.getAttribute && e.target.setAttribute;

								if (valid) {
									const isIntercomClose =
										e.target.tagName === 'A' &&
										/^intercom-.+-close$/.test(e.target.className);

									const noHref = !e.target.getAttribute('href');

									if (isIntercomClose && noHref) {
										e.target.setAttribute('href', '#');
									}
								}
							},
							true
						);
					}
				})
				.catch((error) => {
					const level = error instanceof Error && !!error ? 'error' : 'warning';

					logger.remote(level, 'Could not initialize Intercom', {
						error: error && error.message,
						stack: error && error.stack
					});
				});
		}
	};
};
