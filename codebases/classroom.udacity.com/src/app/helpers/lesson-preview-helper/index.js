export {
    retrieveGDocId
}
from './document-helpers';
export {
    generateImportCode
}
from './parser';
export const nanodegreeKey = 'xd001';
export const nanodegreeId = 1;
export const partKey = 'pd001';
export const moduleKey = 'md001';

export const dummyUser = {
    id: '1234567890',
    first_name: 'Lesson',
    last_name: 'Previewer',
    email: 'lessonpreviewer@none.com',
    phone_number: null,
    is_phone_number_verified: false,
    nickname: 'Previewer',
    preferred_language: 'en-US',
    affiliate_program_key: null,
    can_see_professional_profile: false,
    can_edit_content: false,
    email_preferences: {
        receive_marketing: false
    },
    settings: {
        skip_classroom_welcome: true,
        dismissed_upgrade_ids: [],
        onboarding_completed_keys: [],
        nanodegree_feedback_viewed_counts: null,
        nanodegree_feedback_share_click_keys: [],
        nanodegree_feedback_share_viewed_counts: null,
    },
    social_logins: [],
    user_tags: [],
    nanodegrees: [],
    graduated_courses: [],
};

function loadData(data) {
    const nanodegree = {
        id: nanodegreeId,
        key: nanodegreeKey,
        locale: 'zh-cn',
        title: 'Test Virtual Nanodegree',
        color_scheme: 'color_scheme2',
        aggregated_state: {
            part_aggregated_states: [],
        },
        is_public: true,
        is_term_based: true,
        semantic_type: 'Degree',
        parts: [{
            id: 1,
            key: partKey,
            locale: 'zh-cn',
            title: 'Test Part 1',
            part_type: 'Core',
            is_public: true,
            locked_reason: 'not_locked',
            semantic_type: 'Part',
            modules: [{
                id: 1,
                key: moduleKey,
                locale: 'zh-cn',
                semantic_type: 'Module',
                lessons: [data],
            }, ],
        }, ],
    };

    return nanodegree;
}

export function createFakeNanodegree(data) {
    return loadData(data);
}