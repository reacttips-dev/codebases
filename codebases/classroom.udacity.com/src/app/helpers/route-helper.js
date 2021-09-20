import ReducerHelper from 'helpers/reducer-helper';
import SemanticTypes from 'constants/semantic-types';
import StateHelper from 'helpers/state-helper';
import {
    __
} from 'services/localization-service';

var NODE_FETCHERS = [
    StateHelper.getLessons,
    StateHelper.getModules,
    StateHelper.getParts,
    StateHelper.getNanodegrees,
    StateHelper.getCourses,
];

var SEMANTIC_TYPE_TO_ROUTE_PARAM_KEY = {
    [SemanticTypes.COURSE]: 'courseKey',
    [SemanticTypes.NANODEGREE]: 'nanodegreeKey',
    [SemanticTypes.PART]: 'partKey',
    [SemanticTypes.MODULE]: 'moduleKey',
    [SemanticTypes.LESSON]: 'lessonKey',
    [SemanticTypes.CONCEPT]: 'conceptKey',
};

function _getRouteParamKey(semanticType) {
    return SEMANTIC_TYPE_TO_ROUTE_PARAM_KEY[semanticType];
}

function _getParent(state, node) {
    for (var i = 0; i < NODE_FETCHERS.length; i++) {
        var parentFetcher = NODE_FETCHERS[i];
        var nodes = parentFetcher(state);
        for (var j = 0; j < nodes.length; j++) {
            var possibleParent = nodes[j];
            if (_hasChild(possibleParent, node)) {
                return possibleParent;
            }
        }
    }

    return null;
}

function _getAncestorPath(state, node) {
    var path = [];
    path.push(node);

    var parent;
    while ((parent = _getParent(state, node))) {
        path.push(parent);
        node = parent;
    }

    return path;
}

/* Iterates through all property collections of `parent` to see if `child` is in one of them */
function _hasChild(parent, child) {
    var propertyCollectionKeys = _.filter(
        _.keys(parent),
        ReducerHelper.isPropertyCollectionKey
    );

    for (var i = 0; i < propertyCollectionKeys.length; i++) {
        if (parent[propertyCollectionKeys[i]].indexOf(child.key) !== -1) {
            return true;
        }
    }

    return false;
}

const RouteHelper = {
    marketingHomePath() {
        return __('https://www.udacity.com');
    },

    homePath() {
        return '/me';
    },

    settingsPath(path = 'personal-info') {
        return `/settings/${path}`;
    },

    profilesPath() {
        return __('https://profiles.udacity.com');
    },

    catalogPath() {
        return __('https://www.udacity.com/courses/all');
    },

    classroomPath() {
        return __('https://classroom.udacity.com');
    },

    coursePath({
        courseKey
    }) {
        return `/courses/${courseKey}`;
    },

    paidCoursePath({
        courseKey
    }) {
        return `/paid-courses/${courseKey}`;
    },

    courseLessonPath({
        lessonKey,
        ...rest
    }) {
        return `${RouteHelper.coursePath(rest)}/lessons/${lessonKey}`;
    },

    paidCourseLessonPath({
        lessonKey,
        ...rest
    }) {
        return `${RouteHelper.paidCoursePath(rest)}/lessons/${lessonKey}`;
    },

    courseConceptPath({
        conceptKey,
        ...rest
    }) {
        return `${RouteHelper.courseLessonPath(rest)}/concepts/${conceptKey}`;
    },

    paidCourseConceptPath({
        conceptKey,
        ...rest
    }) {
        return `${RouteHelper.paidCourseLessonPath(rest)}/concepts/${conceptKey}`;
    },

    courseProjectPath(params) {
        return `${RouteHelper.coursePath(params)}/project`;
    },

    //NOTE: course projects are deprecated, lesson projects are supported
    paidCourseProjectPath(params) {
        return `${RouteHelper.paidCoursePath(params)}/project`;
    },

    courseLessonProjectPath(params) {
        return `${RouteHelper.courseLessonPath(params)}/project`;
    },

    nanodegreePath({
        nanodegreeKey
    }) {
        return `/nanodegrees/${nanodegreeKey}`;
    },

    dashboardPath(params) {
        return `${RouteHelper.nanodegreePath(params)}/dashboard`;
    },

    syllabusPath(params) {
        return `${RouteHelper.nanodegreePath(params)}/syllabus`;
    },

    nanodegreeDashboardPath(params) {
        return `${RouteHelper.nanodegreePath(params)}/dashboard`;
    },

    coreCurriculumPath(params) {
        return `${RouteHelper.syllabusPath(params)}/core-curriculum`;
    },

    extracurricularPath(params) {
        return `${RouteHelper.syllabusPath(params)}/extracurricular`;
    },

    syllabusWelcomePath(params) {
        return `${RouteHelper.nanodegreePath(params)}/syllabus-welcome`;
    },

    nanodegreeLockedPath(params) {
        return `${RouteHelper.nanodegreePath(params)}/locked`;
    },

    nanodegreeOnboardingPath(params) {
        return `${RouteHelper.nanodegreePath(params)}/onboarding`;
    },

    courseOnboardingPath(params) {
        return `${RouteHelper.paidCoursePath(params)}/onboarding`;
    },

    partPath({
        partKey,
        ...rest
    }) {
        return `${RouteHelper.nanodegreePath(rest)}/parts/${partKey}`;
    },

    partLockedPath(params) {
        return `${RouteHelper.partPath(params)}/locked`;
    },

    nanodegreeLessonPath({
        moduleKey,
        lessonKey,
        ...rest
    }) {
        return `${RouteHelper.partPath(
      rest
    )}/modules/${moduleKey}/lessons/${lessonKey}`;
    },

    nanodegreeProjectPath(params) {
        return `${RouteHelper.nanodegreeLessonPath(params)}/project`;
    },

    nanodegreeLabPath(params) {
        return `${RouteHelper.nanodegreeLessonPath(params)}/lab`;
    },

    nanodegreeConceptPath({
        conceptKey,
        ...rest
    }) {
        return `${RouteHelper.nanodegreeLessonPath(rest)}/concepts/${conceptKey}`;
    },

    // These functions are designed primarily for use with the `withRoutes` HOC which passes through context
    // These split between different paths depending on the context
    conceptPath(params) {
        if (params.courseKey) {
            return RouteHelper.courseConceptPath(params);
        } else {
            return RouteHelper.nanodegreeConceptPath(params);
        }
    },

    lessonPath(params) {
        if (params.courseKey) {
            return RouteHelper.courseLessonPath(params);
        } else {
            return RouteHelper.nanodegreeLessonPath(params);
        }
    },

    projectPath(params) {
        if (params.courseKey) {
            if (params.lessonKey) {
                return RouteHelper.courseLessonProjectPath(params);
            } else {
                return RouteHelper.courseProjectPath(params);
            }
        } else {
            return RouteHelper.nanodegreeProjectPath(params);
        }
    },

    projectPathForPaidCourseLesson(params) {
        return `${RouteHelper.paidCourseLessonPath(params)}/project`;
    },

    // Decide between the part syllabus and the course page
    lessonListPath(params) {
        if (params.courseKey) {
            return RouteHelper.coursePath(params);
        } else {
            return RouteHelper.partPath(params);
        }
    },

    // Decide between the part syllabus and the course page
    paidCourseLessonListPath(params) {
        if (params.courseKey) {
            return RouteHelper.paidCoursePath(params);
        } else {
            return RouteHelper.partPath(params);
        }
    },

    // TODO: (dcwither) remove when ending Search Experiment
    getRouteParams(state, node) {
        var ancestorPath = _getAncestorPath(state, node);

        return _.reduce(
            ancestorPath,
            (result, pathNode) => {
                result[_getRouteParamKey(pathNode.semantic_type)] = pathNode.key;
                return result;
            }, {}
        );
    },

    isPathSubpath(subpath, path) {
        return _.startsWith(subpath, _.trimEnd(path, '/'));
    },

    forumsPath(node) {
        if (node && node.forum_path && node.forum_path !== '') {
            // If the forum_path starts with 'http' or 'c/http',
            const regex = /^(c\/)?http.*$/;
            if (regex.test(node.forum_path)) {
                return node.forum_path.replace(/^c\//, '');
            }
        }
        return CONFIG.knowledgeWebUrl;
    },

    forumPathForModule({
        module,
        root
    }) {
        const forumNode = _.get(module, 'forum_path') ? module : root;
        return RouteHelper.forumsPath(forumNode);
    },

    lessonPreviewPath() {
        return '/preview';
    },
};

export default RouteHelper;