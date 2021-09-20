import ApiService from './api-service';
import Currency from 'constants/currency';
import Queries from './_queries';
import {
    i18n
} from 'services/localization-service';

function createLayoutQuery() {
    return `
    query LayoutQuery {
      user {
        affiliate_program_key
        can_see_career_portal
        preferred_language
        has_enterprise_enrollments
      }
    }
  `;
}

function createCoursesQuery({
    isGraduated
}) {
    return `
    query CoursesQuery {
      user {
        courses(is_graduated: ${isGraduated}) {
          key
          title
          locale
          version
          summary
          semantic_type
          is_default
          is_graduated
          is_graduation_legacy
          is_public
        }
      }
    }
  `;
}

function createNanodegreesQuery({
    isGraduated
}) {
    return `
    query UserNanodegreesQuery {
      user {
        nanodegrees(is_graduated: ${isGraduated}) {
          id
          key
          title
          locale
          version
          summary
          semantic_type
          is_graduated
          is_public
          is_default
          enrollment {
            variant
            service_model_id
          }
          parts(filter_by_enrollment_service_model: true) {
            key
            modules {
              lessons {
                project {
                  key
                  progress_key
                  title
                  project_state {
                    state
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
}

//SXP-124: convert to an enrollments query to include parts
function createNanodegreesAndCoursesAndPartsQuery({
    isGraduated
}) {
    return `
    query UserNanodegreesAndCoursesAndPartsQuery {
      user {
        nanodegrees_and_courses(
          is_graduated: ${isGraduated}, order: [last_viewed_at, degrees_first]
        ) {
          ${Queries.nanodegreesAndCourses}
        }
      }
    }
  `;
}

function createMeQuery() {
    return `
    query MeQuery {
      user {
        id
        subscribed_nanodegrees_count
        subscribed_courses_count
        graduated_nanodegrees_count
        graduated_courses_count
        graduated_parts_count
        courses(start_index: 0, count: 1, is_graduated: false, order: [last_viewed_at]) {
          ${Queries.commonProgram}
          summary
          lessons {
            key
            title
            semantic_type
            is_public
          }
          enrollment{
            is_ready_for_graduation
          }
        }
        nanodegrees(start_index: 0, count: 1, is_graduated: false, order: [last_viewed_at]) {
          ${Queries.commonProgram}
          summary
          is_term_based
          is_ready_for_graduation
          is_graduated
          packaging_options
          cloud_resources_aws_service_id
          cohorts {
            start_at
            end_at
          }
          enrollment {
            service_model_id
            is_ready_for_graduation
          }
          parts(filter_by_enrollment_service_model: true) {
            key
            semantic_type
            is_public
            part_type
            locked_reason
            locked_until
            modules {
              key
              is_public
              lessons {
                key
                is_public
                title
                semantic_type
              }
            }
          }
        }
        current_parts: enrollments(states: [ENROLLED], semantic_types: [PART], order: [last_viewed_at]) {
          includes_student_hub
          includes_knowledge_reviews
          includes_welcome_flow
          service_model_id
          high_touch
          started_at
          state
          is_ready_for_graduation
          node: root_node {
            ${Queries.commonProgram}
            locale
            version
            ... on Part {
              modules {
                key
                is_public
                lessons {
                  key
                  is_public
                  title
                  semantic_type
                }
              }
            }
          }
        }
        graduated_parts: enrollments(states: [GRADUATED], semantic_types: [PART], order: [last_viewed_at]) {
          includes_student_hub
          includes_knowledge_reviews
          includes_welcome_flow
          service_model_id
          high_touch
          started_at
          state
          node: root_node {
            ${Queries.commonProgram}
            locale
            version
            ... on Part {
              modules {
                key
                is_public
                lessons {
                  key
                  is_public
                  title
                  semantic_type
                }
              }
            }
          }
        }
        graduated_nanodegrees_and_courses: nanodegrees_and_courses(
          start_index: 0, is_graduated: true, order: [last_viewed_at, degrees_first]
        ) {
          ${Queries.nanodegreesAndCourses}
        }
        current_nanodegrees_and_courses: nanodegrees_and_courses(
          start_index: 0, is_graduated: false, order: [last_viewed_at, degrees_first]
        ) {
         ${Queries.nanodegreesAndCourses}
        }
      }
    }
  `;
}

var sepaFields = `
  last4
  country
  fingerprint
  mandate_reference
  mandate_url
`;

var sourceOwnerFields = `
  email
`;

var sourceFields = `
  id
  currency
  object_name
  type
  owner {
    ${sourceOwnerFields}
  }
  source_details {
    ...on SepaType {
      ${sepaFields}
    }
  }
`;

function createFetchBillQuery() {
    return `
    query UserBillingQuery {
      user {
        billing {
          term_purchases {
            urn
            provider
            product_key
            product_variant
            name
            status
            amount
            amount_display
            currency
            cohort_id
            term_id
            purchased_at
            started_at
            can_self_cancel
          }
          subscriptions {
            id
            urn
            name
            status
            amount
            amount_display
            invoice_amount
            currency
            current_period_end_at
            current_period_started_at
            cancel_at_period_end
            canceled_at
            coupon {
              percent_off
            }
            metadata {
              github_promo
            }
            trial_end
            refundability
            started_at
            product_key
            provider
            product_variant
            invoice_urn
          }
        }
      }
    }
  `;
}

function createFetchCurrencyQuery() {
    return `
    query UserQuery {
      user {
        currency {
          current
          geolocated
          history
        }
      }
    }
   `;
}

function createUpdateUserEmailMutation({
    email,
    password
}) {
    let input = {
        email,
        password,
    };

    return [
        `
      mutation updateUserEmail($input: InputUpdateUserEmail) {
        updateUserEmail(input: $input) {
          jwt
        }
      }
    `,
        {
            input,
        },
    ];
}

function createUpdateUserMutation({
    firstName,
    lastName,
    language,
    enrollmentUpdate,
}) {
    let input = {
        first_name: firstName,
        last_name: lastName,
        preferred_language: language,
    };

    if (enrollmentUpdate) {
        input.enrollment_update = {
            node_key: enrollmentUpdate.nodeKey,
            version_number: enrollmentUpdate.versionNumber,
        };
    }

    return [
        `
      mutation putUser($input: InputUser) {
        putUser(input: $input) {
          first_name
          last_name
          preferred_language
        }
      }
    `,
        {
            input,
        },
    ];
}

function createUpdateUserSettingsMutation({
    skipClassroomWelcome,
    dismissedUpgradeId,
    onboardingCompletedKey,
    feedbackViewedKey,
    feedbackShareClickKey,
    feedbackShareViewedKey,
}) {
    return [
        `
      mutation putUserSettings($input: InputUserSettings) {
        putUserSettings(input: $input) {
          skip_classroom_welcome
          dismissed_upgrade_ids
          onboarding_completed_keys
          nanodegree_feedback_viewed_counts
          nanodegree_feedback_share_click_keys
          nanodegree_feedback_share_viewed_counts
        }
      }
    `,
        {
            input: {
                skip_classroom_welcome: skipClassroomWelcome,
                dismissed_upgrade_id: dismissedUpgradeId,
                onboarding_completed_key: onboardingCompletedKey,
                nanodegree_feedback_viewed_key: feedbackViewedKey,
                nanodegree_feedback_share_click_key: feedbackShareClickKey,
                nanodegree_feedback_share_viewed_key: feedbackShareViewedKey,
            },
        },
    ];
}

function createRightToAccessRequestMutation() {
    return `mutation CreateRightToAccessRequest {
    requestPersonalData
  }`;
}

function createLanguageMutation({
    language
}) {
    return [
        `
      mutation putUser($input: InputUser) {
        putUser(input: $input) {
          preferred_language
        }
      }
    `,
        {
            input: {
                preferred_language: language,
            },
        },
    ];
}

function createPasswordMutation({
    oldPassword,
    newPassword
}) {
    return [
        `
      mutation putUser($input: InputUser) {
        putUser(input: $input) {
          id
        }
      }
    `,
        {
            input: {
                password: {
                    old: oldPassword,
                    new: newPassword,
                },
            },
        },
    ];
}

function createCancelCourseMutation(courseId) {
    return `
    mutation cancelCourse {
      cancelCourse(key: "${courseId}") {
        status
      }
    }
  `;
}

function createCancelSubscriptionMutation(subscriptionURN, immediately) {
    return `
    mutation cancelSubscription {
      cancelSubscription(subscription_urn: "${subscriptionURN}", immediately: ${immediately}) {
        urn
        canceled_at
      }
    }
  `;
}

function createDefaultSourceMutation(token) {
    return `
    mutation putDefaultSource {
      putDefaultSource(token: "${token}") {
        ${sourceFields}
      }
    }
  `;
}

function createUserBaseQuery() {
    return `
    query UserBaseQuery {
      user {
        ${Queries.userBase}
        nanodegrees: enrollments(start_index: 0, states: [ENROLLED, STATIC_ACCESS], semantic_types: [NANODEGREE], order: [last_viewed_at]) {
          ${Queries.commonEnrollment}
          ${Queries.nanodegreesEnrollment}
          node: root_node {
            ${Queries.idKLV}
            ${Queries.typeTitleState}
          }
        }
        graduated_nanodegrees: enrollments(start_index: 0, states: [GRADUATED], semantic_types: [NANODEGREE], order: [last_viewed_at]) {
          ${Queries.commonEnrollment}
          node: root_node {
            ${Queries.idKLV}
          }
        }
        courses: enrollments(start_index: 0, states: [ENROLLED], semantic_types: [COURSE], order: [last_viewed_at]) {
          ${Queries.commonEnrollment}
          node: root_node {
            ${Queries.idKLV}
            ${Queries.typeTitleState}
          }
        }
        graduated_courses: enrollments(start_index: 0, states: [GRADUATED], semantic_types: [COURSE], order: [last_viewed_at]) {
          ${Queries.commonEnrollment}
          node: root_node {
            ${Queries.idKLV}
          }
        }
        parts: enrollments(start_index: 0, states: [ENROLLED], semantic_types: [PART], order: [last_viewed_at]) {
          ${Queries.commonEnrollment}
          node: root_node {
            ${Queries.idKLV}
            ${Queries.typeTitleState}
          }
        }
        graduated_parts: enrollments(start_index: 0, states: [GRADUATED], semantic_types: [PART], order: [last_viewed_at]) {
          ${Queries.commonEnrollment}
          node: root_node {
            ${Queries.idKLV}
          }
        }
      }
    }
  `;
}

function createDeleteSocialLoginMutation({
    provider
}) {
    return [
        `
      mutation deleteSocialLogin($provider: SocialLoginProviderName!) {
        deleteSocialLogin(provider: $provider) {
          status
        }
      }
    `,
        {
            provider
        },
    ];
}

function createRequestAccountDeleteCodeMutation() {
    return `
    mutation createAccountDeletionRequest {
      requestDeleteAccountCode {
        account_delete_state
        error {
          code
          message
        }
      }
    }
  `;
}

function createAccountDeleteCodeVerificationMutation(code) {
    return `
    mutation createAccountDeletionVerificationRequest {
      verifyDeleteAccountCode(code: "${code}") {
        account_delete_state
        error {
          code
          message
        }
      }
    }
  `;
}

function createAccountDeleteMutation() {
    return `
    mutation AccountDeletion {
      deleteAccount {
        account_delete_state
        error {
          code
          message
        }
      }
    }
  `;
}

function createUpdateProjectDeadlinesMutation({
    enrollment_id,
    deadlines
}) {
    return [
        `
      mutation updateProjectDeadlines($input: InputEnrollmentSchedule!) {
        updateEnrollmentSchedule(input: $input) {
          deadlines {
            due_at
            node_key
            progress_key
          }
        } 
      }
    `,
        {
            input: {
                enrollment_id,
                deadlines
            }
        },
    ];
}

export default {
    fetchLayout() {
        return ApiService.gql(createLayoutQuery()).then((response) => {
            return response.data.user;
        });
    },

    fetchMe() {
        return ApiService.gql(createMeQuery()).then((response) => {
            const user = response.data.user || {};
            user.current_parts = this.transformEnrollments(user.current_parts);
            user.graduated_parts = this.transformEnrollments(user.graduated_parts);
            return user;
        });
    },

    //SXP-124: Change query to enrollment then transform enrollments to legacy type nodes here
    fetchNanodegreesAndCoursesAndParts({
        isGraduated
    }) {
        return ApiService.gql(
            createNanodegreesAndCoursesAndPartsQuery({
                isGraduated,
            })
        ).then((response) => response.data.user.nanodegrees_and_courses);
    },

    fetchSubscribedCourses() {
        return ApiService.gql(
            createCoursesQuery({
                isGraduated: false,
            })
        ).then((response) => response.data.user.courses);
    },

    fetchSubscribedNanodegrees() {
        return ApiService.gql(
            createNanodegreesQuery({
                isGraduated: false,
            })
        ).then((response) => response.data.user.nanodegrees);
    },

    fetchUserBill() {
        return ApiService.gql(createFetchBillQuery()).then((response) => {
            return response.data.user;
        });
    },

    transformEnrollments(enrollments = []) {
        return enrollments.map(this.swapNodeAndEnrollmentFields);
    },

    // Change gql response from an enrollment with a node
    // to a node with an enrollment
    // { ...enrollment, node: {...}} => {...node, enrollment: {...}}
    swapNodeAndEnrollmentFields(enrollment) {
        const nodeFields = enrollment.node;
        delete enrollment.node;
        return {
            ...nodeFields,
            enrollment,
        };
    },

    fetchUserBase() {
        return ApiService.gql(createUserBaseQuery()).then((response) => {
            const user = response.data.user || {};
            user.courses = this.transformEnrollments(user.courses);
            user.graduated_courses = this.transformEnrollments(
                user.graduated_courses
            );
            user.nanodegrees = this.transformEnrollments(user.nanodegrees);
            user.graduated_nanodegrees = this.transformEnrollments(
                user.graduated_nanodegrees
            );
            user.parts = this.transformEnrollments(user.parts);
            user.graduated_parts = this.transformEnrollments(user.graduated_parts);
            return user;
        });
    },

    /**
     * Calls the currency API to determine student's default currency
     */
    fetchUserCurrencies() {
        return ApiService.gql(createFetchCurrencyQuery()).then((response) => {
            const currency = _.at(response, 'data.user.currency')[0] || {};
            return (
                currency.current ||
                currency.geolocated ||
                _.head(currency.history) ||
                Currency.US_DOLLAR
            );
        });
    },

    updateUser({
        firstName,
        lastName,
        language,
        email,
        password,
        enrollmentUpdate,
    }) {
        let returnPromise = Promise.resolve(null);

        if (!_.isEmpty(email) && !_.isEmpty(password)) {
            let locale = i18n.getLocale();
            let fullPath = null;
            let opts = {
                xhrFields: {
                    withCredentials: true,
                },
            };

            returnPromise = returnPromise.then((prevResolveResponse) => {
                return ApiService.gql(
                    ...createUpdateUserEmailMutation({
                        email,
                        password
                    }),
                    locale,
                    fullPath,
                    opts
                ).then((response) => {
                    return _.extend({}, prevResolveResponse, response.data);
                });
            });
        }

        if (!_.isNil(firstName) ||
            !_.isNil(lastName) ||
            !_.isNil(language) ||
            !_.isNil(enrollmentUpdate)
        ) {
            returnPromise = returnPromise.then((prevResolveResponse) => {
                return ApiService.gql(
                    ...createUpdateUserMutation({
                        firstName,
                        lastName,
                        language,
                        enrollmentUpdate,
                    })
                ).then((response) => {
                    return _.extend({}, prevResolveResponse, response.data.putUser);
                });
            });
        }

        return returnPromise;
    },

    updateUserSettings({
        skipClassroomWelcome,
        dismissedUpgradeId,
        onboardingCompletedKey,
        feedbackViewedKey,
        feedbackShareClickKey,
        feedbackShareViewedKey,
    }) {
        return ApiService.gql(
            ...createUpdateUserSettingsMutation({
                skipClassroomWelcome,
                dismissedUpgradeId,
                onboardingCompletedKey,
                feedbackViewedKey,
                feedbackShareClickKey,
                feedbackShareViewedKey,
            })
        ).then((response) => {
            return response.data.putUserSettings;
        });
    },

    updateLanguage({
        language
    }) {
        return ApiService.gql(...createLanguageMutation({
            language
        })).then(
            (response) => {
                window.location.reload();
                return response.data.putUser;
            }
        );
    },

    resetPassword(oldPassword, newPassword) {
        return ApiService.gql(
            ...createPasswordMutation({
                oldPassword,
                newPassword
            })
        ).then((response) => {
            return response.data.putUser;
        });
    },

    cancelCourse(courseId) {
        return ApiService.gql(createCancelCourseMutation(courseId)).then(
            (response) => {
                return response.data.cancelCourse;
            }
        );
    },

    cancelSubscription(subscriptionURN, immediately = false) {
        return ApiService.gql(
            createCancelSubscriptionMutation(subscriptionURN, immediately)
        ).then((response) => {
            return response.data.cancelSubscription;
        });
    },

    updateDefaultSource(token) {
        return ApiService.gql(createDefaultSourceMutation(token)).then(
            (response) => {
                return response.data.putDefaultSource;
            }
        );
    },

    createRightToAccessRequest() {
        return ApiService.gql(createRightToAccessRequestMutation()).then(
            (response) => response
        );
    },

    deleteSocialLogin(provider) {
        return ApiService.gql(
            ...createDeleteSocialLoginMutation({
                provider
            })
        ).then((response) => {
            return response.data.status;
        });
    },

    requestDeleteAccountCode() {
        return ApiService.gql(createRequestAccountDeleteCodeMutation()).then(
            (response) => {
                return response.data.requestDeleteAccountCode;
            }
        );
    },

    verifyDeleteAccountCode(code) {
        return ApiService.gql(
            createAccountDeleteCodeVerificationMutation(code)
        ).then((response) => {
            return response.data.verifyDeleteAccountCode;
        });
    },

    deleteAccount() {
        return ApiService.gql(createAccountDeleteMutation()).then((response) => {
            return response.data.deleteAccount;
        });
    },

    checkForTag(namespace, tag) {
        return ApiService.get('/user/has_tag', {
            namespace,
            tag,
        });
    },

    setTag(namespace, tag) {
        return ApiService.post('/user/set_tag', {
            namespace,
            tag,
        });
    },

    removeTag(namespace, tag) {
        return ApiService.post('/user/remove_tag', {
            namespace,
            tag,
        });
    },

    setProjectDeadlines({
        enrollment_id,
        deadlines
    }) {
        return ApiService.gql(
            ...createUpdateProjectDeadlinesMutation({
                enrollment_id,
                deadlines
            })
        ).then((response) => response.data.updateEnrollmentSchedule.deadlines);
    },

    requestEmailVerification() {
        return ApiService.post(`${CONFIG.userApiUrl}/me/send_verification_email`);
    },
};