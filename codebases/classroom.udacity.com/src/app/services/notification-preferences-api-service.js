import ApiService from './api-service';
import PropTypes from 'prop-types';

const allCategories = [
    'alumni',
    'cancellation',
    'careerInfo',
    'careerServices',
    'community',
    'learning',
    'marketingEvents',
    'marketingNewContent',
    'marketingScholarships',
    'marketingSurveys',
    'onboarding',
    'paymentReminders',
    'reviews',
    'studentHubChannel',
    'studentHubDirect',
    'studentHubMe',
    'studyReminders',
];

const categoriesWithoutEmail = ['paymentReminders'];

const categoriesWithoutSms = ['cancellation'];

const categoriesWithPhone = [
    'cancellation',
    'marketingEvents',
    'marketingNewContent',
    'marketingScholarships',
    'marketingSurveys',
    'onboarding',
];

export const NotificationPreferencePropType = PropTypes.shape({
    email: PropTypes.bool,
    phone: PropTypes.bool,
    sms: PropTypes.bool,
});

export const NotificationPreferencesPropType = PropTypes.shape(
    _.reduce(
        allCategories,
        (out, category) => {
            out[category] = NotificationPreferencePropType.isRequired;
            return out;
        }, {}
    )
);

export default {
    async startPhoneNumberVerification(
        userKey,
        countryCode,
        phoneNumber,
        locale
    ) {
        try {
            const response = await ApiService.post(
                `${CONFIG.notificationPreferencesApiUrl}/users/${userKey}/verify/start`, {
                    country_code: countryCode,
                    phone_number: phoneNumber,
                    locale,
                }
            );
            return {
                success: response.status === 200,
                error: null,
            };
        } catch (err) {
            return {
                success: false,
                error: _.get(err, 'responseJSON.error.reason', 'Unknown'),
            };
        }
    },

    async verifyPhoneNumber(userKey, verificationCode, countryCode, phoneNumber) {
        try {
            const response = await ApiService.post(
                `${CONFIG.notificationPreferencesApiUrl}/users/${userKey}/verify/check`, {
                    country_code: countryCode,
                    phone_number: phoneNumber,
                    verification_code: verificationCode,
                }
            );
            return {
                success: response.status === 200,
                error: null
            };
        } catch (err) {
            return {
                success: false,
                error: _.get(err, 'responseJSON.error.reason', 'Unknown'),
            };
        }
    },

    async getPreferences(userKey) {
        try {
            const response = await ApiService.get(
                `${CONFIG.notificationPreferencesApiUrl}/users/${userKey}/preferences`
            );
            return _formatResponse(response);
        } catch (err) {
            return {};
        }
    },

    async updatePreferences(userKey, changes) {
        try {
            const response = await ApiService.patch(
                `${CONFIG.notificationPreferencesApiUrl}/users/${userKey}/preferences`,
                _buildParams(changes)
            );
            return {
                ..._formatResponse(response),
                categories: _.map(changes, 'category'),
            };
        } catch (err) {
            return {
                success: false,
                error: _.get(err, 'responseJSON.error.reason', 'Unknown'),
            };
        }
    },

    // accepts an optional "from" param - 'email' | 'sms'
    async unsubscribeAll(userKey, from) {
        const param = from ? `?from=${from}` : '';
        try {
            const response = await ApiService.post(
                `${CONFIG.notificationPreferencesApiUrl}/users/${userKey}/preferences/unsubscribe_all${param}`
            );
            return _formatResponse(response);
        } catch (err) {
            return {
                success: false,
                error: _.get(err, 'responseJSON.error.reason', 'Unknown'),
            };
        }
    },
};

function _buildParams(changes) {
    return _.reduce(
        changes,
        (res, {
            category,
            channel,
            value
        }) => {
            const snakeCategory = _.snakeCase(category);
            let params = {};
            if (channel === 'email') {
                params['email_unsubscribe'] = {
                    [snakeCategory]: !value
                };
            } else if (channel === 'sms') {
                params['sms_opt_in'] = {
                    [snakeCategory]: value
                };
            } else if (channel === 'phone') {
                params['phone_opt_in'] = {
                    [snakeCategory]: value
                };
            }

            return _.merge({}, res, params);
        }, {}
    );
}

function _formatResponse(response) {
    const {
        data,
        status
    } = response;

    const outData = _.reduce(
        allCategories,
        function(out, category) {
            const snakeCategory = _.snakeCase(category);
            out[category] = {};

            if (!_.includes(categoriesWithoutSms, category)) {
                out[category]['sms'] = _.get(
                    data,
                    `sms_opt_in.${snakeCategory}`,
                    false
                );
            }

            if (!_.includes(categoriesWithoutEmail, category)) {
                out[category]['email'] = !_.get(
                    data,
                    `email_unsubscribe.${snakeCategory}`,
                    false
                );
            }

            if (_.includes(categoriesWithPhone, category)) {
                out[category]['phone'] = _.get(
                    data,
                    `phone_opt_in.${snakeCategory}`,
                    false
                );
            }

            return out;
        }, {}
    );

    return {
        success: status === 200,
        data: outData,
        error: null,
    };
}