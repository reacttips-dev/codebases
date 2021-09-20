import PartHelper from 'helpers/part-helper';
import SettingsHelper from 'helpers/settings-helper';
import StateHelper from 'helpers/state-helper';

function checkForUdacityEmail(email) {
    var re = /@udacity\.com$/i;
    if (email) {
        return re.test(email);
    }
}

function getNanodegreePath(nanodegreeKey) {
    return `/programs/${nanodegreeKey}`;
}

function getFreeCoursePath(courseKey) {
    return `/free-courses/${courseKey}`;
}

function getSingleCoursePath(courseKey) {
    return `/libraries/courses/${courseKey}`;
}

function getPartPath(partKey) {
    return `/courses/${partKey}`;
}

function getLessonPath(lessonKey) {
    return `/lessons/${lessonKey}`;
}

function getPagesPath(conceptKey) {
    return `/pages/${conceptKey}`;
}

const CocoHelper = {
    hasUdacityEmail(state) {
        var user = SettingsHelper.State.getUser(state);
        return checkForUdacityEmail(user.email);
    },

    getNanodegreeLocaleVersion(nanodegreeKey, currentNanodegree) {
        let locale = 'en-us';
        let version;

        if (currentNanodegree) {
            locale = currentNanodegree.locale;
            version = currentNanodegree.version;
        }

        return {
            locale,
            version
        };
    },

    getCourseLocaleVersion(courseKey, currentCourse) {
        let locale = 'en-us';
        let version;

        if (currentCourse) {
            locale = currentCourse.locale;
            version = currentCourse.version;
        }

        return {
            locale,
            version
        };
    },

    getLastViewedChildKey(currentNode) {
        var childNodeKey = '';

        if (currentNode['_aggregated_state']) {
            childNodeKey = currentNode['_aggregated_state']['last_viewed_child_key'];
        }
        return childNodeKey;
    },

    getMochaPath(routeParams) {
        var {
            nanodegree,
            course,
            part,
            lesson,
            concept,
            locale,
            version,
        } = routeParams;

        var mochaPath,
            programPath = '';
        var partPath = part ? getPartPath(part.key) : null;
        var lessonPath = getLessonPath(lesson.key);
        var pagePath = getPagesPath(concept.key);

        var localePath = `/${locale}`;
        var versionPath = `/${version}`;

        if (nanodegree.key) {
            programPath = getNanodegreePath(nanodegree.key);
            mochaPath =
                programPath +
                localePath +
                versionPath +
                partPath +
                lessonPath +
                pagePath;
        } else if (course.key && course.semantic_type === 'Part') {
            programPath = getSingleCoursePath(course.key);
            mochaPath =
                programPath + localePath + versionPath + lessonPath + pagePath;
        } else if (course.key && course.semantic_type === 'Course') {
            programPath = getFreeCoursePath(course.key);
            mochaPath =
                programPath + localePath + versionPath + lessonPath + pagePath;
        }

        return mochaPath;
    },

    getRouteParams(state) {
        var nanodegree = StateHelper.getNanodegrees(state)[0] || {};
        var course = StateHelper.getCourses(state)[0] || {};

        var partKey, part, moduleKey, module, lessonKey, lesson;

        let locale, version;

        if (nanodegree.key) {
            var nanodegreeLocaleVersion = this.getNanodegreeLocaleVersion(
                nanodegree.key,
                nanodegree
            );

            locale = nanodegreeLocaleVersion.locale;
            version = nanodegreeLocaleVersion.version;

            partKey = this.getLastViewedChildKey(nanodegree) || '';
            part = StateHelper.getPart(state, partKey) || {};

            moduleKey = PartHelper.getFirstModuleKey(part) || '';
            module = StateHelper.getModule(state, moduleKey) || {};

            lessonKey = this.getLastViewedChildKey(module) || '';
            lesson = StateHelper.getLesson(state, lessonKey) || {};
        }

        if (course.key) {
            var courseLocaleVersion = this.getCourseLocaleVersion(course.key, course);

            locale = courseLocaleVersion.locale;
            version = courseLocaleVersion.version;

            lessonKey = this.getLastViewedChildKey(course) || '';
            lesson = StateHelper.getLesson(state, lessonKey) || {};
        }

        var conceptKey = this.getLastViewedChildKey(lesson) || '';
        var concept = StateHelper.getConcept(state, conceptKey) || {};

        return {
            locale,
            version,
            nanodegree,
            course,
            part,
            module,
            lesson,
            concept,
        };
    },

    createMochaUrl(routeParams) {
        var mochaPath = this.getMochaPath(routeParams);
        return `${CONFIG.cocoUrl}/mocha${mochaPath}`;
    },
};

export default CocoHelper;