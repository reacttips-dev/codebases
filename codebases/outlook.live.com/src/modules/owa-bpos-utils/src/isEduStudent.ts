import { getBposNavBarData } from 'owa-bpos-store';

/**
 * Checks to see if the user is a student on an EDU tenant
 * @returns true if the user is a student on an EDU tenant (as opposed to EduFaculty for example).
 * @remarks used to show different UI strings for students as opposed to workers on an EDU tenant;
 * For example, students will see strings such as 'school week' instead of 'work week'
 */
export default function isEduStudent() {
    const bposData = getBposNavBarData();
    if (bposData?.ClientData) {
        const clientData = JSON.parse(bposData.ClientData);
        return activeExperiencesIncludesEduStudent(clientData?.ActiveExperiences);
    }

    return false;
}

function activeExperiencesIncludesEduStudent(activeExperiences: string | undefined): boolean {
    return !!activeExperiences && activeExperiences.split(',').includes('EduStudent');
}
