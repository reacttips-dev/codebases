/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import { CMLOrHTMLContent } from 'bundles/compound-assessments/types/FormParts';
import {
  QuestionGradeFeedbackInfo,
  GradeFeedbackStrings,
} from 'bundles/compound-assessments/lib/utils/getQuestionGradeFeedbackInfo';
import cmlObjectContainsValue from 'bundles/compound-assessments/lib/utils/cmlObjectContainsValue';

import { SuccessOutlineIcon, FailIcon } from '@coursera/cds-icons';
import CMLOrHTML from 'bundles/cml/components/CMLOrHTML';
import { Theme, useTheme, Typography } from '@coursera/cds-core';

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
      marginTop: '16px',
      padding: '12px',
      display: 'flex',
      backgroundColor: bgColor,
    });
  },
  iconContainer: css({
    marginRight: '8px',
    height: '20px',
  }),
  infoContainer: css({
    width: '100%',
  }),
  info: (type: string) => css({ marginLeft: type === GradeFeedbackStrings.PARTIAL ? '20px' : 0 }),
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

type Props = QuestionGradeFeedbackInfo & {
  questionType?: string;
  renderGrayIncorrect?: boolean;
};

// TODO refine display to present reflective feedback as "Feedback" instead of "Correct"
// https://coursera.atlassian.net/browse/CP-4419
const GradeFeedback: React.FC<Props> = ({ type, notificationInfo, questionType, renderGrayIncorrect = false }) => {
  const theme = useTheme();
  const typeToIcon = {
    [GradeFeedbackStrings.SUCCESS]: <SuccessOutlineIcon color="success" />,
    [GradeFeedbackStrings.FAILURE]: <FailIcon color="error" />,
  };
  // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  const icon = typeToIcon[type] || null;

  let labelColor: React.ComponentProps<typeof Typography>['color'] = 'body';
  if (type === GradeFeedbackStrings.SUCCESS) {
    labelColor = 'success';
  } else if (type === GradeFeedbackStrings.FAILURE) {
    labelColor = 'error';
  }

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
                <Typography color={labelColor} variant="h4bold" component="div" data-test="GradeFeedback-caption">
                  {label}
                </Typography>
              )}
              {description && (
                <Typography variant="body2" component="div">
                  <FeedbackContent description={description} questionType={questionType} />
                </Typography>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GradeFeedback;
