import React from 'react';

import { withProps } from 'recompose';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

import _t from 'i18n!nls/custom-labels';

import { CustomLabelsV2 } from './__generated__/CustomLabelsV2';
import { ReplaceCustomContent, FormattingOptions } from '../types/CustomLabels';

const capitalizeEachWord = (str: string | undefined): string | undefined => {
  if (!str) {
    return undefined;
  }

  return str.replace(/\w\S*/g, (word) => word.replace(/^\w/, (char) => char.toUpperCase()));
};

type OuterProps = {
  customLabelsV2?: CustomLabelsV2;
};

type InnerProps = {
  replaceCustomContent: ReplaceCustomContent;
};

export const getCustomCourseTerm = (courseraCourse?: string | null, capitalize?: boolean): string | undefined => {
  let customTerm;
  if (!courseraCourse) {
    customTerm = _t('course');
  } else if (courseraCourse === 'guided project') {
    customTerm = _t('guided project');
  } else {
    customTerm = courseraCourse;
  }

  return capitalize ? capitalizeEachWord(customTerm) : customTerm;
};

export const getCustomWeekTerm = (courseraWeek?: string | null, capitalize?: boolean): string | undefined => {
  let customTerm;
  if (!courseraWeek) {
    customTerm = _t('week');
  } else if (courseraWeek === 'project') {
    customTerm = _t('project');
  } else {
    customTerm = courseraWeek;
  }

  return capitalize ? capitalizeEachWord(customTerm) : customTerm;
};

export default <PropsFromCaller extends OuterProps>(Component: React.ComponentType<PropsFromCaller & InnerProps>) =>
  withProps<InnerProps, PropsFromCaller>(({ customLabelsV2 }) => {
    const defaultCourseTerm = getCustomCourseTerm();
    const defaultWeekTerm = getCustomWeekTerm();
    const defaultCapitalizedCourseTerm = capitalizeEachWord(defaultCourseTerm);
    const defaultCapitalizedWeekTerm = capitalizeEachWord(defaultWeekTerm);

    const getNumberedWeekTerms = (weekNumber: number) => {
      let weekWithNumber = _t('week #{weekNumber}', {
        weekNumber,
      });

      let capitalizedWeekWithNumber = _t('Week #{weekNumber}', {
        weekNumber,
      });

      if (customLabelsV2) {
        const { namings, moduleNames, isRhyme } = customLabelsV2;
        const { courseraWeek } = namings;

        const courseraWeekWithCapitalization = capitalizeEachWord(courseraWeek);

        if (isRhyme) {
          weekWithNumber = courseraWeek;
          capitalizedWeekWithNumber = courseraWeekWithCapitalization ?? '';
        } else if (moduleNames) {
          const { moduleName } = moduleNames.find(({ weekNumber: week }) => week === weekNumber) ?? {};

          if (moduleName) {
            weekWithNumber = moduleName;
            capitalizedWeekWithNumber = moduleName;
          }
        } else {
          weekWithNumber = _t('#{courseraWeek} #{weekNumber}', { courseraWeek, weekNumber });
          capitalizedWeekWithNumber = _t('#{courseraWeekWithCapitalization} #{weekNumber}', {
            courseraWeekWithCapitalization,
            weekNumber,
          });
        }
      }

      return {
        weekWithNumber,
        capitalizedWeekWithNumber,
      };
    };

    // Provide a replacement function as a prop to be used by consumers
    //
    // NOTE: these function signatures must match the ReplaceCustomContent signature in types/CustomLabels.ts
    // They use the 'function' syntax over the arrow syntax to support effective method overloading.
    // Without the overload the conditional return type specified by ReplaceCustomContent
    // will not work and TypeScript will not know how to cast the return values.
    //
    // For more info see:
    // - https://stackoverflow.com/questions/56109614/typescript-overload-arrow-function-is-not-working
    // - https://stackoverflow.com/questions/55059436/typescript-conditional-return-type-based-on-string-argument
    //
    function replaceCustomContent<T extends boolean>(
      message: string,
      options?: FormattingOptions<T>
    ): T extends true ? string : JSX.Element;
    function replaceCustomContent(message: string, options?: FormattingOptions<boolean>) {
      const { additionalVariables = {}, weekNumber, returnsString = false } = options ?? {};

      let labelOverrides = {};

      if (customLabelsV2) {
        const { courseraCourse, courseraWeek } = customLabelsV2.namings;

        const courseraCourseWithCapitalization = capitalizeEachWord(courseraCourse);
        const courseraWeekWithCapitalization = capitalizeEachWord(courseraWeek);

        labelOverrides = {
          ...additionalVariables,
          course: courseraCourse,
          week: courseraWeek,
          capitalizedCourse: courseraCourseWithCapitalization,
          capitalizedWeek: courseraWeekWithCapitalization,
        };
      }

      const variables = {
        ...additionalVariables,
        course: defaultCourseTerm,
        week: defaultWeekTerm,
        capitalizedCourse: defaultCapitalizedCourseTerm,
        capitalizedWeek: defaultCapitalizedWeekTerm,
        ...labelOverrides,
        ...(weekNumber && getNumberedWeekTerms(weekNumber)),
      };

      if (returnsString) {
        return _t(message, variables);
      } else {
        return <FormattedMessage message={message} {...variables} />;
      }
    }

    return {
      replaceCustomContent,
    };
  })(Component);
