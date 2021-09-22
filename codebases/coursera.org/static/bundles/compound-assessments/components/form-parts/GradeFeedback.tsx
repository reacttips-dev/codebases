/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import { CMLOrHTMLContent } from 'bundles/compound-assessments/types/FormParts';
import {
  QuestionGradeFeedbackInfo,
  GradeFeedbackStrings,
} from 'bundles/compound-assessments/lib/utils/getQuestionGradeFeedbackInfo';
import cmlObjectContainsValue from 'bundles/compound-assessments/lib/utils/cmlObjectContainsValue';

import { Caption, View } from '@coursera/coursera-ui';
import { SvgClear, SvgCheck } from '@coursera/coursera-ui/svg';
import CMLOrHTML from 'bundles/cml/components/CMLOrHTML';
import { Theme, useTheme } from '@coursera/cds-core';

const styles = {
  root: (theme: Theme, type: string, renderGrayIncorrect: boolean) => {
    let bgColor = '';
    switch (type) {
      case GradeFeedbackStrings.SUCCESS:
        bgColor = theme.palette.green[50];
        break;
      case GradeFeedbackStrings.FAILURE:
        bgColor = renderGrayIncorrect ? theme.palette.gray[100] : theme.palette.red[50];
        break;
      default:
        bgColor = '#F5F5F5';
    }
    return css({
      marginTop: '18px',
      padding: '14px 18px',
      display: 'flex',
      backgroundColor: bgColor,
    });
  },
  iconContainer: css({
    marginRight: '8px',
    textAlign: 'center',
  }),
  infoContainer: css({
    width: '100%',
  }),
  caption: css({
    margin: '5px 0',
    display: 'block',
    fontWeight: 'bold',
  }),
  feedbackText: (theme: Theme) =>
    css({
      color: theme.palette.black[500],
    }),
  info: (type: string) => css({ marginLeft: type === GradeFeedbackStrings.PARTIAL ? '20px' : 0 }),
};

const ICON_SIZE = 28;

type Props = QuestionGradeFeedbackInfo & {
  questionType?: string;
  renderGrayIncorrect?: boolean;
};

// TODO refine display to present reflective feedback as "Feedback" instead of "Correct"
const GradeFeedback: React.FC<Props> = ({ type, notificationInfo, questionType, renderGrayIncorrect = false }) => {
  const theme = useTheme();
  const typeToIcon = {
    [GradeFeedbackStrings.SUCCESS]: <SvgCheck size={ICON_SIZE} color={theme.palette.green[700]} />,
    [GradeFeedbackStrings.FAILURE]: (
      <SvgClear size={ICON_SIZE} color={renderGrayIncorrect ? theme.palette.black[500] : theme.palette.red[700]} />
    ),
  };
  // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  const icon = typeToIcon[type] || null;
  return (
    <div css={styles.root(theme, type, renderGrayIncorrect)} data-test={`GradeFeedback-${type}`}>
      {icon && (
        <div css={styles.iconContainer} data-test="GradeFeedback-icon">
          {icon}
        </div>
      )}
      {notificationInfo && (
        <div css={styles.infoContainer}>
          {notificationInfo.map(({ label, description }) => (
            <div css={styles.info(type)} key={label || undefined} data-test="GradeFeedback-info">
              {label && (
                <Caption css={styles.caption} tag="div" data-test="GradeFeedback-caption">
                  {label}
                </Caption>
              )}
              {description && (
                <View css={styles.feedbackText(theme)}>
                  <FeedbackContent description={description} questionType={questionType} />
                </View>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const FeedbackContent = ({
  description,
  questionType,
}: {
  description?: string | CMLOrHTMLContent | null;
  questionType?: string;
}) => {
  if (description && cmlObjectContainsValue(description)) {
    const content = Object.prototype.hasOwnProperty.call(description, 'typeName') ? (
      <CMLOrHTML value={description} display="inline-block" />
    ) : (
      <span>{description}</span>
    );
    return questionType === 'codeExpression' ? <pre>{content}</pre> : content;
  }
  return null;
};

export default GradeFeedback;
