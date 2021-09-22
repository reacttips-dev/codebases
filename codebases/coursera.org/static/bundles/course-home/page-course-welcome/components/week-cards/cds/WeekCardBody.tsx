/** @jsx jsx */
import React from 'react';
import { Expandable } from '@coursera/coursera-ui';
import { css, jsx } from '@emotion/react';
import type { Theme } from '@coursera/cds-core';
import { Typography } from '@coursera/cds-core';

import type { Week } from 'bundles/course-v2/types/Week';

import AssignmentSection from 'bundles/course-home/page-course-welcome/components/week-cards/cds/AssignmentSection';
import UngradedItemSection from 'bundles/course-home/page-course-welcome/components/week-cards/cds/UngradedItemSection';

import 'css!./../__styles__/WeekCardBody';

type Props = {
  week: Week;
  weekNumber: number;
  theme: Theme;
};

class WeekCardBody extends React.Component<Props> {
  render() {
    const { week, weekNumber, theme } = this.props;

    return (
      <Expandable hideHeader isOpened isFullBleed hideBorder rootClassName="rc-WeekCardBody">
        <div className="body-content">
          {week.modules.map((module) => (
            <section className="module-section" key={module.id}>
              <Typography
                css={css`
                  margin: ${theme.spacing(8, 0, 24, 0)};
                `}
                className="module-title"
              >
                {module.name}
              </Typography>

              <div className="progress-section-wrapper horizontal-box wrap">
                <UngradedItemSection className="flex-4" module={module} weekNumber={weekNumber} />
                <AssignmentSection className="flex-5" module={module} weekNumber={weekNumber} theme={theme} />
              </div>
            </section>
          ))}
        </div>
      </Expandable>
    );
  }
}

export default WeekCardBody;
