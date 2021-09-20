import AssessmentHelper from 'helpers/assessment-helper';
import LabHelper from 'helpers/lab-helper';
import LessonHelper from 'helpers/lesson-helper';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import NodeHelper from 'helpers/node-helper';
import {
    PartLockedReason
} from 'constants/part';
import {
    PartTypes
} from 'constants/part';
import ProjectHelper from 'helpers/project-helper';
import {
    __
} from 'services/localization-service';

const PartHelper = {
    getFirstModuleKey(part) {
        return (part._modules_keys || [])[0];
    },

    isCore(part) {
        return part.part_type === PartTypes.CORE;
    },

    isElective(part) {
        return part.part_type === PartTypes.ELECTIVE;
    },

    isCareer(part) {
        return part.part_type === PartTypes.CAREER;
    },

    getLessons(part) {
        return _.chain(part).get('modules').flatMap('lessons').value();
    },

    getProjects(part) {
        return LessonHelper.getProjectsFromLessons(PartHelper.getLessons(part));
    },

    getLabs(part) {
        return LessonHelper.getLabsFromLessons(PartHelper.getLessons(part));
    },

    getCoreParts(nanodegree, parts) {
        if (NanodegreeHelper.isCareerND(nanodegree)) {
            return _.filter(
                parts,
                (part) => PartHelper.isCore(part) || PartHelper.isCareer(part)
            );
        } else {
            return _.filter(parts, PartHelper.isCore);
        }
    },

    getExtracurricularParts(nanodegree, parts) {
        if (NanodegreeHelper.isCareerND(nanodegree)) {
            return _.filter(parts, PartHelper.isElective);
        } else {
            return _.filter(
                parts,
                (part) => PartHelper.isElective(part) || PartHelper.isCareer(part)
            );
        }
    },

    getPosition(curriculum, part) {
        return NodeHelper.getPosition(curriculum, part);
    },

    getGroupedParts(nanodegree, parts) {
        // maintain order of career, core, and extracurricular parts
        return {
            core: PartHelper.getCoreParts(nanodegree, parts),
            extracurricular: PartHelper.getExtracurricularParts(nanodegree, parts),
        };
    },

    getPartIndexInGroup(nanodegree, parts, partKey) {
        const {
            core,
            extracurricular
        } = PartHelper.getGroupedParts(
            nanodegree,
            parts
        );

        const coreIndex = _.findIndex(core, {
            key: partKey
        });
        const extracurricularIndex = _.findIndex(extracurricular, {
            key: partKey
        });

        switch (true) {
            case coreIndex >= 0:
                return coreIndex;
            case extracurricularIndex >= 0:
                return extracurricularIndex;
            default:
                return -1;
        }
    },

    getPartIndexByType({
        part,
        nanodegree,
        parts
    }) {
        const {
            core,
            extracurricular
        } = PartHelper.getGroupedParts(
            nanodegree,
            parts
        );

        if (NodeHelper.includes(core, part)) {
            return NodeHelper.getPosition(core, part);
        } else {
            return NodeHelper.getPosition(extracurricular, part);
        }
    },

    getLengthOfGroupByPart({
        part,
        nanodegree,
        parts
    }) {
        const {
            core,
            extracurricular
        } = PartHelper.getGroupedParts(
            nanodegree,
            parts
        );
        if (NodeHelper.includes(core, part)) {
            return _.size(core);
        } else {
            return _.size(extracurricular);
        }
    },

    isLocked(part) {
        return part.locked_reason !== PartLockedReason.NOT_LOCKED;
    },

    getFirstUnlockedPart(parts) {
        return _.find(parts, (part) => !PartHelper.isLocked(part));
    },

    metRequirements({
        part,
        projects
    }) {
        const derivedProjects = projects || PartHelper.getProjects(part);
        const labs = PartHelper.getLabs(part);

        if (derivedProjects.length > 0) {
            return ProjectHelper.areAllCompleted(derivedProjects);
        } else if (labs.length > 0) {
            return LabHelper.areAllCompleted(labs);
        } else {
            return NodeHelper.isCompleted(part);
        }
    },

    getFirstUnsubmittedAssessment(part) {
        const assessments = LessonHelper.getAssessmentsFromLessons(
            PartHelper.getLessons(part)
        );

        return _.find(
            assessments,
            (assessment) => !AssessmentHelper.isSubmitted(assessment)
        );
    },

    getPartLabel(partType) {
        switch (partType) {
            case PartTypes.CORE:
                return __('Core Curriculum');
            case PartTypes.ELECTIVE:
                return __('Extracurricular');
            default:
                return null;
        }
    },

    getParentPart(parts, lessonKey) {
        const modules = _.chain(parts).flatMap('modules').value();
        const parentModule = _.find(modules, (module) => {
            const lessons = _.keyBy(module.lessons, 'key');
            return lessons[lessonKey];
        });
        const moduleKey = _.get(parentModule, 'key');
        const parentPart = _.find(parts, (part) => {
            const modules = _.keyBy(part.modules, 'key');
            return modules[moduleKey];
        });
        return parentPart;
    },
};

export default PartHelper;