/* @jsx jsx */
import React from 'react';

import { jsx, css } from '@emotion/react';
import { Grid, Theme, Typography, useTheme } from '@coursera/cds-core';

import { DayOfWeek, DAYS_OF_WEEK, DAYS_OF_WEEK_LABELS } from 'bundles/goal-setting/utils/constants';

type Props = {
  selectedDays: DayOfWeek[];
  onChange: (selectedDays: DayOfWeek[]) => void;
};

const GoalSettingSetScheduleDaysStyles = (theme: Theme) => ({
  day: css`
    align-items: center;
    border-radius: 15px;
    border: 1px solid ${theme.palette.gray[300]};
    color: ${theme.palette.gray[700]};
    cursor: pointer;
    display: flex;
    flex-direction: row;
    height: 30px;
    justify-content: center;
    width: 30px;
  `,
  dayInput: css`
    position: absolute;
    top: 0;
    height: 0;
    width: 0;
    left: 0;

    &:focus-visible + label {
      outline: 1px solid ${theme.palette.blue[600]};
    }

    &:checked + label {
      background: ${theme.palette.blue[600]};
      border-color: ${theme.palette.blue[600]};
    }
  `,
});

const GoalSettingSetScheduleDays: React.FC<Props> = ({ onChange, selectedDays }) => {
  const theme = useTheme();
  const styles = GoalSettingSetScheduleDaysStyles(theme);

  const toggleDay = (day: DayOfWeek) => () => {
    if (selectedDays.indexOf(day) > -1) {
      selectedDays = selectedDays.filter((i) => i !== day);
    } else {
      selectedDays = [...selectedDays, day];
    }

    onChange(selectedDays);
  };

  const selected = selectedDays.map((day) => day?.toLowerCase());

  return (
    <div
      css={css`
        margin: ${theme.spacing(4, 0, 16)};
      `}
    >
      <Grid container direction="row" spacing={12}>
        {Object.keys(DAYS_OF_WEEK).map((day) => {
          const isSelected = selected.includes(day);
          return (
            <Grid
              item
              css={css`
                position: relative;
              `}
              key={day}
            >
              <input
                css={styles.dayInput}
                id={`input-${day}`}
                checked={selected.includes(day)}
                type="checkbox"
                onChange={toggleDay(day)}
                aria-label={DAYS_OF_WEEK_LABELS[day]}
              />
              <label htmlFor={`input-${day}`} css={styles.day}>
                <Typography color={isSelected ? 'invertBody' : 'body'} variant="body2">
                  {DAYS_OF_WEEK[day]}
                </Typography>
              </label>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

GoalSettingSetScheduleDays.defaultProps = {
  selectedDays: [],
};

export { GoalSettingSetScheduleDays };

export default GoalSettingSetScheduleDays;
