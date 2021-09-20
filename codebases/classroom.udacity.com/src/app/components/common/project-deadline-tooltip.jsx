import {
  getAdjustableDeadlinesExperimentAttributes,
  isEligibleForAdjustableDeadlinesExperiment,
} from 'helpers/project-deadline-helper';
import { ADJUSTABLE_DEADLINE_EXPLANATION } from 'constants/projects';
import { Experiment } from '@udacity/ureact-experiments';
import { IconInfo } from '@udacity/veritas-icons';
import { NanodegreeConsumer } from 'components/nanodegrees/nanodegree-context';
import { Tooltip } from '@udacity/veritas-components';

export const ProjectDeadlineTooltip = () => {
  return (
    <NanodegreeConsumer>
      {(context) => {
        const nanodegree = context && context.nanodegree;
        const experimentAttributes = getAdjustableDeadlinesExperimentAttributes(
          nanodegree
        );
        const canCheckDeadlineExperiment = isEligibleForAdjustableDeadlinesExperiment(
          nanodegree
        );

        return canCheckDeadlineExperiment ? (
          <Experiment
            experimentKey="adjustable-deadlines"
            attributes={experimentAttributes}
          >
            {(variation) =>
              variation !== 'hide' ? (
                <Tooltip
                  content={ADJUSTABLE_DEADLINE_EXPLANATION}
                  trigger={<IconInfo size="sm" color="black" />}
                  direction="end"
                />
              ) : null
            }
          </Experiment>
        ) : null;
      }}
    </NanodegreeConsumer>
  );
};
ProjectDeadlineTooltip.displayName = 'common/project-deadline-tooltip';

export default ProjectDeadlineTooltip;
