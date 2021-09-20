import FunctionHelper from 'helpers/function-helper';
import PaymentsHelper from 'helpers/payments-helper';
import ReducerHelper from 'helpers/reducer-helper';
import SemanticTypes from 'constants/semantic-types';
import SettingsHelper from 'helpers/settings-helper';

// Helpers (not exported)
function _getChildProject(state, node) {
    if (node) {
        return getProject(
            state,
            ReducerHelper.getMappedPropertyKey(node, 'project')
        );
    } else {
        return null;
    }
}

function _getChildLab(state, node) {
    if (node) {
        return getLab(state, ReducerHelper.getMappedPropertyKey(node, 'lab'));
    } else {
        return null;
    }
}

const getNodeWithChildren = FunctionHelper.requireAllArgs(function(
    state,
    node,
    childProperty,
    getChild,
    leafType
) {
    const childKeys = ReducerHelper.getMappedPropertyCollectionKeys(
        node,
        childProperty
    );
    return {
        ...node,
        [childProperty]: _.map(childKeys, (key) => getChild(state, key, leafType)),
    };
});

const createGetNode = FunctionHelper.requireAllArgs(function(
    pathToNodeInState,
    childProperty,
    getChild,
    semanticType
) {
    return (state, nodeKey, leafType = semanticType) => {
        const node = _.get(state, [pathToNodeInState, nodeKey]);
        if (leafType === semanticType || !node) {
            return node;
        } else {
            return getNodeWithChildren(
                state,
                node,
                childProperty,
                getChild,
                leafType
            );
        }
    };
});

function createGetChildrenByParentKey(getParent, childProperty, childType) {
    return (state, parentKey, leafType = childType) => {
        return _.get(getParent(state, parentKey, leafType), childProperty);
    };
}

// Singular Getters
export function getAtom(state, atomKey) {
    return state.atoms[atomKey];
}

export const getConcept = createGetNode(
    'concepts',
    'atoms',
    getAtom,
    SemanticTypes.CONCEPT
);
const getLessonWithoutProject = createGetNode(
    'lessons',
    'concepts',
    getConcept,
    SemanticTypes.LESSON
);

export function getLesson(state, lessonKey, leafType) {
    const lesson = getLessonWithoutProject(state, lessonKey, leafType);

    if (lesson) {
        const project = _getChildProject(state, lesson);
        const lab = _getChildLab(state, lesson);
        if (lab) {
            return { ...lesson,
                lab
            };
        }
        if (project) {
            return { ...lesson,
                project
            };
        }
        return lesson;
    } else {
        return null;
    }
}

export const getCourse = createGetNode(
    'courses',
    'lessons',
    getLesson,
    SemanticTypes.COURSE
);
export const getModule = createGetNode(
    'modules',
    'lessons',
    getLesson,
    SemanticTypes.MODULE
);
export const getPart = createGetNode(
    'parts',
    'modules',
    getModule,
    SemanticTypes.PART
);
export const getPartAsCourse = createGetNode(
    'courses',
    'lessons',
    getLesson,
    SemanticTypes.PART
);
export const getNanodegree = createGetNode(
    'nanodegrees',
    'parts',
    getPart,
    SemanticTypes.NANODEGREE
);

export function getProject(state, projectKey) {
    return state.projects[projectKey];
}

export function getLab(state, labId) {
    return state.labs[labId];
}

// Plural Getters
export function getApplications(state) {
    return state.user.applications || [];
}

export function getCourses(state) {
    return _.values(state.courses);
}

export function getConcepts(state) {
    return _.values(state.concepts);
}

export function getProjects(state) {
    return _.values(state.projects);
}

export function getLessons(state) {
    return _.values(state.lessons);
}

export function getModules(state) {
    return _.values(state.modules);
}

export function getParts(state) {
    return _.values(state.parts);
}

export function isPartAsCourse(course) {
    return course.semantic_type === SemanticTypes.PART;
}

export function getPartsAsCourses(state) {
    return _.values(state.courses).filter(isPartAsCourse);
}

export function getNanodegrees(state) {
    return _.values(state.nanodegrees);
}

// XbyY Getters
// TODO: (dcwither) these can probably be deprecated once the deep getters are
// fully integrated
export function getSubscriptionByNanodegreeKey(state, nanodegreeKey) {
    const subscriptions = SettingsHelper.State.getSubscriptions(state) || [];
    return _.find(subscriptions, {
        product_key: nanodegreeKey
    });
}

export function getOrderHistoryByNanodegreeKey(state, nanodegreeKey) {
    const orderHistory = PaymentsHelper.State.getOrderHistory(state);
    return orderHistory.filter(
        (entry) =>
        !!entry.purchased_products.find(
            (product) => product.nanodegree_key === nanodegreeKey
        )
    );
}

export const getPartsByNanodegreeKey = createGetChildrenByParentKey(
    getNanodegree,
    'parts',
    SemanticTypes.PART
);
export const getModulesByPartKey = createGetChildrenByParentKey(
    getPart,
    'modules',
    SemanticTypes.MODULE
);
export const getLessonsByModuleKey = createGetChildrenByParentKey(
    getModule,
    'lessons',
    SemanticTypes.LESSON
);
export const getLessonsByCourseKey = createGetChildrenByParentKey(
    getCourse,
    'lessons',
    SemanticTypes.LESSON
);
export const getConceptsByLessonKey = createGetChildrenByParentKey(
    getLesson,
    'concepts',
    SemanticTypes.CONCEPT
);
export const getAtomsByConceptKey = createGetChildrenByParentKey(
    getConcept,
    'atoms',
    null
);

export function getLessonsByPartKey(
    state,
    partKey,
    leafType = SemanticTypes.LESSON
) {
    const part = getPart(state, partKey, leafType);

    if (part) {
        return _.chain(part.modules).map('lessons').flatten().compact().value();
    } else {
        return null;
    }
}

export function getProjectByPartKey(state, partKey) {
    const part = getPart(state, partKey);
    return _getChildProject(state, part);
}

export function getProjectByCourseKey(state, courseKey) {
    const course = getCourse(state, courseKey);
    return _getChildProject(state, course);
}

export function getProjectByLessonKey(state, lessonKey) {
    const lesson = getLesson(state, lessonKey);
    return _getChildProject(state, lesson);
}