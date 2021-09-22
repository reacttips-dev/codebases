import React from 'react';
import classNames from 'classnames';

import type { Module } from 'bundles/course-v2/types/Week';
// eslint-disable-next-line
import { css, jsx } from '@emotion/react';
import type { Theme } from '@coursera/cds-core';
import { Typography } from '@coursera/cds-core';

import { getGradableItemsWithoutHonorsAndOptionalsInModule } from 'bundles/course-v2/utils/Module';
import { getIsAssignmentPartForSplitPeer, getReviewPartFromSplitPeer } from 'bundles/course-v2/utils/Item';

import AssignmentRow from 'bundles/course-home/page-course-welcome/components/week-cards/cds/AssignmentRow';
import { SvgReading } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/course-home';

import 'css!./../__styles__/AssignmentSection';

type Props = {
  module: Module;
  className?: string;
  weekNumber: number;
  theme: Theme;
};

class AssignmentSection extends React.Component<Props> {
  render() {
    const { className, module, weekNumber, theme } = this.props;

    const moduleName = module.name;
    const gradableItemsWithoutHonorsAndOptionals = getGradableItemsWithoutHonorsAndOptionalsInModule(module);

    // TODO: Pull out into its own component
    if (gradableItemsWithoutHonorsAndOptionals.length === 0) {
      return (
        <Typography
          component="div"
          className={classNames('rc-AssignmentSection', 'vertical-box', 'align-items-absolute-center', className)}
        >
          <SvgReading aria-hidden="true" color={theme.palette.black[500]} size={24} />
          {_t('Nothing due')}
        </Typography>
      );
    }

    const sortedGradableItemsWithoutHonorsAndOptionals = gradableItemsWithoutHonorsAndOptionals.sort((a, b) => {
      const { deadline: deadlineA } = a;
      const { deadline: deadlineB } = b;
      if (!deadlineA) {
        return 1;
      } else if (!deadlineB) {
        return -1;
      }
      return deadlineA - deadlineB;
    });

    return (
      <div className={classNames('rc-AssignmentSection', className)}>
        <table className="assignments">
          <caption className="screenreader-only" style={{ position: 'static' }}>
            {_t('Week #{weekNumber}: #{moduleName}', { weekNumber, moduleName })}
          </caption>
          <thead>
            <tr role="row">
              <th scope="col" role="columnheader">
                <Typography
                  component="span"
                  variant="h4bold"
                  color="supportText"
                  css={css`
                    text-transform: uppercase;
                    min-width: 80px;
                    padding: ${theme?.spacing(0, 8, 8, 8)};
                  `}
                >
                  {_t('Required')}
                </Typography>
              </th>
              <th scope="col" role="columnheader">
                <Typography
                  component="span"
                  variant="h4bold"
                  color="supportText"
                  css={css`
                    text-transform: uppercase;
                    min-width: 80px;
                    padding: ${theme?.spacing(0, 8, 8, 8)};
                  `}
                >
                  {_t('Grade')}
                </Typography>
              </th>
              <th scope="col" role="columnheader">
                <Typography
                  component="span"
                  variant="h4bold"
                  color="supportText"
                  css={css`
                    text-transform: uppercase;
                    min-width: 80px;
                    padding: ${theme?.spacing(0, 8, 8, 8)};
                  `}
                >
                  {_t('Due')}
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedGradableItemsWithoutHonorsAndOptionals.map((item) => {
              if (getIsAssignmentPartForSplitPeer(item)) {
                return [
                  <AssignmentRow key={item.id} item={item} />,
                  <AssignmentRow
                    key={`${item.id}ReviewPortion`}
                    // @ts-expect-error TSMIGRATION
                    item={getReviewPartFromSplitPeer(item)}
                  />,
                ];
              }

              return <AssignmentRow key={item.id} item={item} />;
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default AssignmentSection;
