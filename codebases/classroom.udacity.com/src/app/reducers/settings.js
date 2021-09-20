import Actions from 'actions';
import ReducerHelper from 'helpers/reducer-helper';
import _ from 'lodash';
import update from 'immutability-helper';

const initialState = {
    user: {
        subscribedNanodegreesCount: 0,
        subscribedCoursesCount: 0,
        subscribedPartsCount: 0,
        graduatedNanodegreesCount: 0,
        graduatedCoursesCount: 0,
    },
    connectSession: {},
    accountCreditTotal: null,
};

export default function(state = initialState, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.FETCH_BILL_COMPLETED:
            var billing = _.get(action, 'payload.billing') || {};
            state = ReducerHelper.merge({}, state, {
                subscriptions: _.get(billing, 'subscriptions') || [],
                termPurchases: _.get(billing, 'term_purchases') || [],
            });
            break;

        case Actions.Types.FETCH_CONNECT_ENROLLMENT_COMPLETED:
            state = ReducerHelper.merge({}, state, {
                connectSession: action.payload,
            });
            break;

        case Actions.Types.FETCH_CONNECT_PROGRESS_COMPLETED:
            state = ReducerHelper.merge({}, state, {
                connectSession: {
                    ndProgress: action.payload,
                },
            });
            break;
        case Actions.Types.FETCH_USER_BASE_COMPLETED:
        case Actions.Types.UPDATE_USER_COMPLETED:
        case Actions.Types.FETCH_HUB_USER_COMPLETED:
        case Actions.Types.UPDATE_HUB_USER_COMPLETED:
            {
                const user = _.omit(action.payload, 'showToast');
                state = ReducerHelper.merge({}, state, {
                    user
                });
                break;
            }

        case Actions.Types.NOTIFY_PHONE_VERIFICATION_COMPLETE:
            const {
                phoneNumber
            } = action.payload;
            state = ReducerHelper.merge({}, state, {
                user: {
                    phone_number: phoneNumber,
                    is_phone_number_verified: true,
                },
            });
            break;

        case Actions.Types.FETCH_ME_COMPLETED:
            let me = action.payload;
            //SXP-124: Optionally sort by date last viewed
            var nanodegreesAndCoursesAndParts = {
                current: [...me.current_nanodegrees_and_courses, ...me.current_parts],
                graduated: [
                    ...me.graduated_nanodegrees_and_courses,
                    ...me.graduated_parts,
                ],
            };

            state = ReducerHelper.merge({}, state, {
                user: {
                    subscribedNanodegreesCount: me.subscribed_nanodegrees_count,
                    subscribedCoursesCount: me.subscribed_courses_count,
                    subscribedPartsCount: me.current_parts.length,
                    graduatedNanodegreesCount: me.graduated_nanodegrees_count,
                    graduatedCoursesCount: me.graduated_courses_count,
                    graduatedPartsCount: me.graduated_parts_count,
                    nanodegreesAndCoursesAndParts,
                },
            });
            break;

        case Actions.Types
        .FETCH_CURRENT_NANODEGREES_AND_COURSES_AND_PARTS_COMPLETED:
            const fetchedCurrentNanodegreesAndCoursesAndParts = action.payload;
            const stateCurrentNanodegreesAndCoursesAndParts =
                state.user.nanodegreesAndCoursesAndParts.current;

            var nanodegreesAndCoursesAndParts = {
                current: _.concat(
                    stateCurrentNanodegreesAndCoursesAndParts,
                    fetchedCurrentNanodegreesAndCoursesAndParts
                ),
            };

            state = ReducerHelper.merge({}, state, {
                user: {
                    nanodegreesAndCoursesAndParts,
                },
            });
            break;

        case Actions.Types
        .FETCH_GRADUATED_NANODEGREES_AND_COURSES_AND_PARTS_COMPLETED:
            var fetchedGraduatedNanodegreesAndCoursesAndParts = action.payload;
            var stateGraduatedNanodegreesAndCoursesAndParts =
                state.user.nanodegreesAndCoursesAndParts.graduated;
            var nanodegreesAndCoursesAndParts = {
                graduated: _.concat(
                    stateGraduatedNanodegreesAndCoursesAndParts,
                    fetchedGraduatedNanodegreesAndCoursesAndParts
                ),
            };
            state = ReducerHelper.merge({}, state, {
                user: {
                    nanodegreesAndCoursesAndParts,
                },
            });
            break;

        case Actions.Types.FETCH_USER_CURRENCY_COMPLETED:
            var currency = action.payload;
            state = {
                ...state,
                currency,
            };
            break;

        case Actions.Types.UPDATE_USER_SETTINGS_COMPLETED:
            var settings = action.payload;
            state = ReducerHelper.merge({}, state, {
                user: {
                    settings
                }
            });
            break;

        case Actions.Types.UPDATE_LANGUAGE_COMPLETED:
            {
                const user = action.payload;
                state = ReducerHelper.merge({}, state, {
                    user
                });
                break;
            }

        case Actions.Types.CANCEL_SUBSCRIPTION_COMPLETED:
            {
                const subscription = action.payload;
                const idx = _.findIndex(state.subscriptions, {
                    urn: subscription.urn
                });
                if (idx >= 0) {
                    state = update(state, {
                        subscriptions: {
                            [idx]: {
                                $merge: subscription
                            }
                        },
                    });
                }
                break;
            }

        case Actions.Types.CANCEL_TERM_PURCHASE_COMPLETED:
            {
                const term_purchase = action.payload;
                const idx = _.findIndex(state.termPurchases, {
                    urn: term_purchase.urn
                });
                if (idx >= 0) {
                    state = update(state, {
                        termPurchases: {
                            [idx]: {
                                $merge: term_purchase
                            }
                        },
                    });
                }
                break;
            }

        case Actions.Types.FETCH_FACEBOOK_NAME_COMPLETED:
            var facebookName = action.payload;
            state = {
                ...state,
                facebookName,
            };
            break;

        case Actions.Types.FETCH_GOOGLE_NAME_COMPLETED:
            var googleName = action.payload;
            state = {
                ...state,
                googleName,
            };
            break;

        case Actions.Types.FETCH_ACCOUNT_CREDIT_TOTAL_COMPLETED:
            const accountCreditTotal = action.payload.amount;
            state = {
                ...state,
                accountCreditTotal,
            };
            break;
    }

    return state;
}