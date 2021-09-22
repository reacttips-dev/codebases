import epic from 'bundles/epic/client';
import cookie from 'js/lib/cookie';

export const isFullStoryEnabled = () => epic.get('FullStory', 'enableFullstoryOnDegreeHome');
export const isZendeskWidgetEnabled = () => epic.get('Flex', 'enableDegreeHomeZendeskWidget');

const DEGREE_HOME_V2_COOKIE_NAME = 'degreehome_showv2';
export const hasDegreeHomeV2Cookie = (): boolean => cookie.get(DEGREE_HOME_V2_COOKIE_NAME) != null;
export const setDegreeHomeV2Cookie = (): string => cookie.set(DEGREE_HOME_V2_COOKIE_NAME, true, { days: 180 });
export const removeDegreeHomeV2Cookie = (): void => cookie.remove(DEGREE_HOME_V2_COOKIE_NAME);

export const isDegreeHomeV2EpicEnabled = (degreeSlug: string | undefined) => {
  if (degreeSlug) {
    const parameterValue = epic.get('Degrees', 'showDegreeHomeV2');
    return (
      parameterValue?.enabled &&
      parameterValue?.excludedDegreeSlugs &&
      !parameterValue.excludedDegreeSlugs.includes(degreeSlug)
    );
  }
  return false;
};

export const isDegreeHomeV2Enabled = (degreeSlug: string | undefined) => {
  return hasDegreeHomeV2Cookie() && isDegreeHomeV2EpicEnabled(degreeSlug);
};

export const isStudentHomeV2Beta1Enabled = () => epic.get('Degrees', 'showStudentHomeV2Beta1');
