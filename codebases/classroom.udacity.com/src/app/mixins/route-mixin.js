import $ from 'jquery';
import PropTypes from 'prop-types';
import RouteHelper from 'helpers/route-helper';
import SemanticTypes from 'constants/semantic-types';

export default {
    contextTypes: {
        course: PropTypes.object,
        nanodegree: PropTypes.object,
        part: PropTypes.object,
        module: PropTypes.object,
        lesson: PropTypes.object,
    },
    /**
     * For the *Path functions, any unspecified keys are pulled from the current context
     */

    /* eslint-disable no-unused-vars */

    marketingHomePath() {
        return RouteHelper.marketingHomePath();
    },

    homePath() {
        return RouteHelper.homePath();
    },

    catalogPath() {
        return RouteHelper.catalogPath();
    },

    profilesPath() {
        return RouteHelper.profilesPath();
    },

    forumsPath() {
        const {
            course,
            nanodegree,
            module
        } = this.context;

        let forumNode;
        if (_.get(module, 'forum_path')) {
            forumNode = module;
        } else {
            forumNode = nanodegree || course;
        }
        return RouteHelper.forumsPath(forumNode);
    },

    settingsPath() {
        return RouteHelper.settingsPath();
    },

    subscriptionsPath() {
        return RouteHelper.settingsPath('subscriptions');
    },

    billingPath() {
        return RouteHelper.settingsPath('billing');
    },

    coursePath({
        courseKey
    }) {
        return RouteHelper.coursePath({
            courseKey
        });
    },

    nanodegreePath({
        nanodegreeKey
    }) {
        return RouteHelper.nanodegreePath({
            nanodegreeKey
        });
    },

    partPath({
        nanodegreeKey,
        partKey
    }) {
        const keys = this._contextMergedKeys(arguments[0]);
        return RouteHelper.partPath(keys);
    },

    syllabusPath({
        nanodegreeKey,
        activePartKey = null,
        activeLessonKey = null,
    }) {
        if (activeLessonKey && !activePartKey) {
            throw 'Must specify an activeParttKey if activeLessonKey is specified';
        }
        const keys = this._contextMergedKeys(arguments[0]);
        let path = RouteHelper.nanodegreePath(keys) + '/syllabus';

        const params = {};
        if (activePartKey) {
            params.activePartKey = activePartKey;
            if (activeLessonKey) {
                params.activeLessonKey = activeLessonKey;
            }
        }

        if (!_.isEmpty(params)) {
            path = path + `?${$.param(params)}`;
        }

        return path;
    },

    _partProjectPath({
        nanodegreeKey,
        partKey,
        courseKey
    }) {
        const keys = this._contextMergedKeys(arguments[0]);
        if (keys.nanodegreeKey) {
            return RouteHelper.partPath(keys) + '/project';
        } else {
            return RouteHelper.coursePath(keys) + '/project';
        }
    },

    _lessonProjectPath({
        nanodegreeKey,
        partKey,
        moduleKey,
        lessonKey
    }) {
        const keys = this._contextMergedKeys(arguments[0]);
        return this._lessonPath(keys) + '/project';
    },

    /* This will call either _lessonProjectPath or _partProjectPath dependent on whether this is
       for a term-based nanodegree or not */
    getProjectPath(keys) {
        keys = this._contextMergedKeys(keys);

        if (keys.lessonKey) {
            return this._lessonProjectPath(keys);
        } else {
            return this._partProjectPath(keys);
        }
    },

    conceptPath({
        courseKey,
        nanodegreeKey,
        partKey,
        moduleKey,
        lessonKey,
        conceptKey,
    }) {
        const keys = this._contextMergedKeys(arguments[0]);
        if (keys.courseKey) {
            return RouteHelper.courseConceptPath(keys);
        } else {
            return RouteHelper.nanodegreeConceptPath(keys);
        }
    },

    paidCourseConceptPath({
        courseKey,
        nanodegreeKey,
        partKey,
        moduleKey,
        lessonKey,
        conceptKey,
    }) {
        const keys = this._contextMergedKeys(arguments[0]);
        if (keys.courseKey) {
            return RouteHelper.paidCourseConceptPath(keys);
        } else {
            return RouteHelper.nanodegreeConceptPath(keys);
        }
    },

    lastViewedPaidCourseConceptPath({
        courseKey,
        nanodegreeKey,
        partKey,
        moduleKey,
        lessonKey,
    }) {
        return this._paidCourseLessonPath(arguments[0]) + '/concepts/last-viewed';
    },

    _paidCourseLessonPath({
        courseKey,
        nanodegreeKey,
        partKey,
        moduleKey,
        lessonKey,
    }) {
        const keys = this._contextMergedKeys(arguments[0]);
        if (keys.courseKey) {
            return RouteHelper.paidCourseLessonPath(keys);
        }
    },

    lastViewedConceptPath({
        courseKey,
        nanodegreeKey,
        partKey,
        moduleKey,
        lessonKey,
    }) {
        return this._lessonPath(arguments[0]) + '/concepts/last-viewed';
    },

    _lessonPath({
        courseKey,
        nanodegreeKey,
        partKey,
        moduleKey,
        lessonKey
    }) {
        const keys = this._contextMergedKeys(arguments[0]);
        if (keys.courseKey) {
            return RouteHelper.courseLessonPath(keys);
        } else {
            return RouteHelper.nanodegreeLessonPath(keys);
        }
    },

    /* eslint-enable no-unused-vars */

    _contextMergedKeys(keys) {
        return _.extend({}, this._extractContextKeys(), keys);
    },

    _extractContextKeys() {
        const context = this.context;
        return {
            conceptKey: _.get(context, 'concept.key'),
            courseKey: _.get(context, 'course.key'),
            lessonKey: _.get(context, 'lesson.key'),
            moduleKey: _.get(context, 'module.key'),
            nanodegreeKey: _.get(context, 'nanodegree.key'),
            partKey: _.get(context, 'part.key'),
        };
    },

    _getRootPath(rootNode) {
        let rootKey = rootNode.key;
        return rootNode.semantic_type === SemanticTypes.NANODEGREE ?
            this.nanodegreePath({
                nanodegreeKey: rootKey
            }) :
            this.coursePath({
                courseKey: rootKey
            });
    },

    validateRouteNode(node, rootNode) {
        if (_.isEmpty(node)) {
            this.context.router.push({
                state: {
                    errorType: '404',
                    returnLink: rootNode ? this._getRootPath(rootNode) : '/me',
                },
                pathname: '/nodeNotFound',
            });
        }
    },

    lessonPreviewPath() {
        return RouteHelper.lessonPreviewPath();
    },
};