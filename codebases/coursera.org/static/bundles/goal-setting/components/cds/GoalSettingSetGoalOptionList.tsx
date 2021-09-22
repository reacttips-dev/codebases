/* @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';
import { Grid, useTheme } from '@coursera/cds-core';

import CML from 'bundles/cml/components/CML';
import CMLUtils from 'bundles/cml/utils/CMLUtils';
import GoalSettingSetGoalOption from 'bundles/goal-setting/components/GoalSettingSetGoalOption';

import { GoalChoice } from '../../types/GoalChoice';

import 'css!bundles/goal-setting/components/__styles__/GoalSettingSetGoalOptionList';

type Props = {
  goalChoices: GoalChoice[];
  onChange: (index: number) => void;
  selectedIndex: number;
};

const GoalSettingSetGoalOptionList: React.FC<Props> = ({ goalChoices, onChange, selectedIndex }) => {
  const theme = useTheme();

  return (
    <Grid
      css={css`
        border: 1px solid ${theme.palette.gray[300]};

        .option-cml p {
          padding: ${theme.spacing(0)};
        }
      `}
      container
      direction="column"
    >
      {goalChoices.map(({ isRecommended, name }, idx) => (
        <Grid
          item
          xs
          css={css`
            border-bottom: 1px solid ${theme.palette.gray[300]};

            &:last-child {
              border: none;
            }
          `}
        >
          <GoalSettingSetGoalOption
            key={CMLUtils.getValue(name)}
            isRecommended={isRecommended}
            checked={idx === selectedIndex}
            onChange={() => onChange(idx)}
          >
            <CML className="option-cml" isCdsEnabled={true} cml={name} />
          </GoalSettingSetGoalOption>
        </Grid>
      ))}
    </Grid>
  );
};

GoalSettingSetGoalOptionList.defaultProps = {
  goalChoices: [],
};

export default GoalSettingSetGoalOptionList;
