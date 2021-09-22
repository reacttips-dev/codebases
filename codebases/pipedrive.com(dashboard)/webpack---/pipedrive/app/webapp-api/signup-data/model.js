import { Model } from '@pipedrive/webapp-core';
import Logger from '@pipedrive/logger-fe';

const logger = new Logger('signup-data');

const SignupData = Model.extend({
	data: null,

	url: function() {
		return `${app.config.baseurl}/signup-service/authed/signup-data`;
	},

	parse: function(response) {
		if (response && response.data) {
			this.data = response.data;

			return response.data;
		}

		return null;
	},

	initialPull: function(callback) {
		this.pull({
			success: callback,
			error: (e) => {
				logger.log('Failed to pull signup-data.', e);

				callback();
			}
		});

		return this;
	}
});

export default SignupData;
