import { getBposNavBarData } from 'owa-bpos-store';
import { getQueryStringParameter } from 'owa-querystring';

export default function isEdu() {
    const IS_EDUUSER_QUERY_OVERRIDE = 'isEdu';
    if (getQueryStringParameter(IS_EDUUSER_QUERY_OVERRIDE) === '1') {
        return true;
    }

    const bposData = getBposNavBarData();
    if (bposData?.ClientData) {
        const clientData = JSON.parse(bposData.ClientData);
        const activeExperiences = clientData?.ActiveExperiences?.split(',');
        return (
            !!activeExperiences?.includes('Edu') ||
            !!activeExperiences?.includes('EduStudent') ||
            !!activeExperiences?.includes('EduFaculty')
        );
    }

    return false;
}
