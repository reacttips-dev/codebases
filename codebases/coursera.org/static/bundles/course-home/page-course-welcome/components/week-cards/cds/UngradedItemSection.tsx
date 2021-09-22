import React from 'react';
import classNames from 'classnames';

import { Module } from 'bundles/course-v2/types/Week';
import { hasGradableItemsOnly } from 'bundles/course-v2/utils/Module';
import { Typography } from '@coursera/cds-core';

import UngradedItemContainer from 'bundles/course-home/page-course-welcome/components/week-cards/cds/UngradedItemContainer';

import Imgix from 'js/components/Imgix';
import path from 'js/lib/path';

import constants from 'pages/open-course/common/constants';

import _t from 'i18n!nls/course-home';

import 'css!./../__styles__/UngradedItemSection';

const ASSET_PATH: string = constants.assets.rootPath;

type Props = {
  module: Module;
  className: string;
  weekNumber: number;
};

class UngradedItemSection extends React.Component<Props> {
  render() {
    const {
      className,
      module,
      module: {
        name,
        moduleTimeProgress: {
          lecturesProgress,
          readingsProgress,
          nonGradedAssessmentsProgress,
          otherNonPassableItemsProgress,
        },
      },
      weekNumber,
    } = this.props;

    if (hasGradableItemsOnly(module)) {
      // TODO: Move into a separate component
      return (
        <div className={classNames('rc-UngradedItemSection', 'vertical-box', 'align-items-absolute-center', className)}>
          <Imgix
            className="only-required-assignments-icon"
            alt={_t('quiz icon')}
            // This gives src(unknown) on mock, even though the string is correct. why?
            src={path.join(ASSET_PATH, 'bundles/ondemand/assets/images/quizIcon.png')}
          />

          <Typography> {_t('Only required assignments')} </Typography>
        </div>
      );
    }

    return (
      <div
        className={classNames('rc-UngradedItemSection', className)}
        aria-label={_t('Week #{weekNumber}: #{name}', { name, weekNumber })}
      >
        <UngradedItemContainer title={_t('Videos')} progress={lecturesProgress} />
        <UngradedItemContainer title={_t('Readings')} progress={readingsProgress} />
        <UngradedItemContainer title={_t('Practice Exercises')} progress={nonGradedAssessmentsProgress} />
        <UngradedItemContainer title={_t('Other')} progress={otherNonPassableItemsProgress} />
      </div>
    );
  }
}

export default UngradedItemSection;
