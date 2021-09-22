import React from 'react';
import { CardV2, CardSection, StyleSheet, placeholder, css } from '@coursera/coursera-ui';
import CML from 'bundles/cml/components/CML';
import CMLUtils from 'bundles/cml/utils/CMLUtils';
import ProgressTracker from 'bundles/skills-common/private/progress-tracker/ProgressTracker';
import GoldStarSvg from 'bundles/skills-common/private/star-symbol/GoldStarSvg';

import 'css!./__styles__/TSPSummaryCard';

const styles = StyleSheet.create({
  placeholderTitle: {
    width: '100%',
    opacity: 0.5,
  },
  placeholderDescription: {
    marginBottom: 6,
    opacity: 0.5,
  },
});

type TargetSkillProfeciencyProp = {
  skillId: string;
  skillName: string;
  targetProficiency: number;
};

type LearnerSkillScoreProp = {
  [skillId: string]: {
    readableScore: number;
  };
};

export type Props = {
  title: string;
  description?: {
    cml?: {
      dtdId: string;
      value: string;
    };
  } | null;
  skillsListHeading: string;
  targetSkillProficiencies: TargetSkillProfeciencyProp[];
  learnerSkillScores?: LearnerSkillScoreProp;
  children?: JSX.Element;
  saveSkillSetButton?: JSX.Element;
  contentBelowSkillBars?: JSX.Element;
};

type PropsForPlaceholder = Pick<Props, 'skillsListHeading' | 'children'>;

const TSPSummaryCard = ({
  title,
  description,
  skillsListHeading,
  targetSkillProficiencies,
  learnerSkillScores,
  saveSkillSetButton,
  contentBelowSkillBars,
  children,
}: Props) => {
  return (
    <CardV2 rootClassName="rc-TSPSummaryCard main-container">
      <CardSection rootClassName="p-a-0 horizontal-box">
        <div className="left-container">
          <div className="title-container">
            <div className="icon-title-group">
              <GoldStarSvg />
              <h2 className="heading bold">{title}</h2>
            </div>
          </div>
          <CML cml={description?.cml ? CMLUtils.create(description.cml.value, description.cml.dtdId) : undefined} />
          {children}
        </div>
        <div className="right-container">
          <div className="skills-description-container">
            <h3 className="skills-description bold">{skillsListHeading}</h3>
            {saveSkillSetButton}
          </div>
          <div className="target-skills-list">
            {targetSkillProficiencies.map((targetSkillProficiency) => (
              <div key={targetSkillProficiency.skillId} className="target-skill-item">
                <ProgressTracker
                  headerSize="sm"
                  skillName={targetSkillProficiency.skillName}
                  target={targetSkillProficiency.targetProficiency}
                  score={learnerSkillScores?.[targetSkillProficiency.skillId]?.readableScore ?? 0}
                />
              </div>
            ))}
          </div>
          {contentBelowSkillBars}
        </div>
      </CardSection>
    </CardV2>
  );
};

TSPSummaryCard.Placeholder = ({ skillsListHeading, children }: PropsForPlaceholder): JSX.Element => (
  <CardV2 rootClassName="rc-TSPSummaryCard">
    <CardSection rootClassName="p-a-0 horizontal-box">
      <div aria-busy className="left-container">
        <div className="title-container">
          <div className="icon-title-group">
            <GoldStarSvg />
            <p className="heading bold">
              <div aria-hidden className={css(placeholder.styles.shimmer, styles.placeholderTitle).className}>
                &nbsp;
              </div>
            </p>
          </div>
        </div>
        <div className="description-placeholder">
          <div aria-hidden className={css(placeholder.styles.shimmer, styles.placeholderDescription).className}>
            &nbsp;
          </div>
          <div aria-hidden className={css(placeholder.styles.shimmer, styles.placeholderDescription).className}>
            &nbsp;
          </div>
          <div aria-hidden className={css(placeholder.styles.shimmer, styles.placeholderDescription).className}>
            &nbsp;
          </div>
        </div>
        {children}
      </div>
      <div className="right-container">
        <div className="skills-description-container">
          <p className="skills-description bold">{skillsListHeading}</p>
        </div>
        <div className="target-skills-list">
          <div className="target-skill-item">
            <ProgressTracker.Placeholder headerSize="sm" />
          </div>
          <div className="target-skill-item">
            <ProgressTracker.Placeholder headerSize="sm" />
          </div>
          <div className="target-skill-item">
            <ProgressTracker.Placeholder headerSize="sm" />
          </div>
        </div>
      </div>
    </CardSection>
  </CardV2>
);

export default TSPSummaryCard;
