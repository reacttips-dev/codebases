import NanodegreeHelper from 'helpers/nanodegree-helper';

const ForumHelper = {
    /**
     * Sugar method to accept context and return if the current page should have
     * a forum enabled or not.
     */
    isForumEnabled(context) {
        const {
            nanodegree,
            course
        } = context;
        let enabled = true;

        if (nanodegree) {
            enabled = ForumHelper.isNDForumEnabled(nanodegree);
        } else if (course) {
            enabled = ForumHelper.isCourseForumEnabled(course);
        }

        return enabled;
    },

    /**
     * Check if this course is on a forum black list.
     */
    isCourseForumEnabled(course) {
        const excludedCourseCodes = [
            'ud208',
            'nd001',
            'nd018-preview',
            'nd101-preview',
            'nd100-preview',
            'nd009_preview',
            'ud011',
        ];

        // If the course isn't in the blacklist, return `true` that forums are enabled (default state).
        const isBlacklisted = _.includes(excludedCourseCodes, _.get(course, 'key'));

        return !isBlacklisted;
    },

    /**
     * Check if this nanodegree is on a forum black list.
     */
    isNDForumEnabled(nanodegree) {
        const excludedNDCodes = [
            'nd201',
            'nd124',
            'nd117',
            'nd787',
            'nd025',
            'nd089',
            'nd891',
            'nd892',
            'nd898',
            'nd002-airbus',
            'nd002-wgu',
        ];

        // Pattern for Enterprise with -ent nanodegrees
        const entPattern = new RegExp('-ent');
        // If the ND isn't in the blacklist, return `true` that forums are enabled (default state).
        const ndKey = _.get(nanodegree, 'key');
        const isBlacklisted =
            _.includes(excludedNDCodes, ndKey) ||
            entPattern.test(ndKey) ||
            NanodegreeHelper.isStatic(nanodegree);

        return !isBlacklisted;
    },
};

export default ForumHelper;