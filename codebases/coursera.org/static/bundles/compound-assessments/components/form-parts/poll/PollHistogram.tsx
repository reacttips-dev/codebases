import React from 'react';
import classNames from 'classnames';

import CMLOrHTML from 'bundles/cml/components/CMLOrHTML';
import FloatToPercent from 'bundles/primitive-formatting/components/FloatToPercent';

import { FormattedMessage, FormattedNumber } from 'js/lib/coursera.react-intl';
import { Box } from '@coursera/coursera-ui';
import type { Option, PollHistogram as Histogram } from 'bundles/compound-assessments/types/FormParts';

import 'css!bundles/compound-assessments/components/form-parts/poll/__styles__/PollHistogram';

import _t from 'i18n!nls/compound-assessments';

type Props = {
  histogram: Histogram;
  options: Option[];
  responses?: string[];
};

const PollHistogram: React.SFC<Props> = ({ histogram, responses, options }) => {
  const data = histogram
    .map(({ id, count }) => ({
      id,
      count,
      display: options.find((option) => option.id === id)?.display,
    }))
    .sort((a, b) => b.count - a.count);

  const total = histogram.reduce((acc, cur) => acc + cur.count, 0);

  return (
    <Box rootClassName="rc-PollHistogram" flexDirection="column" justifyContent="start">
      {data.map(({ display, id, count }) => {
        const percentage = count / total;

        return (
          <div>
            <CMLOrHTML value={display} />
            <Box
              rootClassName={classNames('progress-bar', { active: responses?.includes(id) })}
              flexDirection="row"
              justifyContent="start"
              alignItems="center"
            >
              <div className="progress" style={{ width: `${percentage * 100}%` }} />
              <span className="progress-label">
                <FloatToPercent value={percentage} />
              </span>
            </Box>
          </div>
        );
      })}
      <div className="responses-count">
        <FormattedNumber value={total} />
        <FormattedMessage
          message={_t(' {responseCount, plural, =0 {responses} one {response} other {responses}}')}
          responseCount={total}
        />
      </div>
    </Box>
  );
};

export default PollHistogram;
