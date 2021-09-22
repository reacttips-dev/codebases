/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { debounce } from 'lodash';
import _t from 'i18n!nls/compound-assessments';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/l... Remove this comment to see the full error message
import helpCenterLinks from 'js/lib/coursera.helpcenter'; // eslint-disable-line import/extensions

import { Typography, Theme } from '@coursera/cds-core';

import katexify from 'js/lib/katex';

export type LatexData = {
  message: string;
  warnings: Array<string>;
  success: boolean;
};

/* eslint-disable graphql/template-strings */
const LatexQuery = gql`
  query LatexQuery($userText: String!, $skip: Boolean!) {
    latexData(userText: $userText)
      @skip(if: $skip)
      @rest(type: "LatexData", path: "assess/v1/latex?{args}", method: "GET") {
      message
      warnings
      success
    }
  }
`;
/* eslint-enable graphql/template-strings */

type MathExpressionPreviewViewProps = {
  latexData: LatexData | null;
  isLatexDataLoading: boolean;
};

const styles = {
  root: (theme: Theme) =>
    css({
      padding: theme.spacing(16),
      marginBottom: theme.spacing(12),
      backgroundColor: theme.palette.gray[100],
    }),
  mathExpressionPreview: (theme: Theme) =>
    css({
      paddingLeft: theme.spacing(16),
    }),
};

export const MathExpressionPreviewView: React.FC<MathExpressionPreviewViewProps> = ({
  latexData,
  isLatexDataLoading,
}) => (
  <div css={styles.root} role="alert">
    <Typography variant="body1">
      {isLatexDataLoading && _t('Preview updating...')}
      {!isLatexDataLoading && !latexData && _t('Preview will appear here...')}
      {latexData && !latexData.success && (
        <React.Fragment>
          {_t('Preview unable to update: ')}
          <a target="_blank" rel="noopener noreferrer" href={helpCenterLinks.getMathAssignmentLink()}>
            {latexData.message}
          </a>
        </React.Fragment>
      )}
    </Typography>

    {latexData && latexData.success && !isLatexDataLoading && latexData.message && (
      <div
        css={styles.mathExpressionPreview}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: katexify('$$' + latexData.message + '$$') }}
      />
    )}

    {latexData && latexData.warnings && latexData.warnings.length > 0 && (
      <Typography variant="body1">
        {latexData.warnings.map((msg) => (
          <div key={msg}>{msg}</div>
        ))}
      </Typography>
    )}
  </div>
);

type Props = {
  userText?: string | null;
};

class MathExpressionPreview extends React.Component<Props> {
  // the following function debounce the component update
  // because there might be a lot of changes to userText if the user is typing
  // it is to prevent unnecessary network requests
  shouldComponentUpdate() {
    this.debouncedUpdate();
    return false;
  }

  debouncedUpdate = debounce(this.forceUpdate, 500);

  render() {
    const { userText } = this.props;
    return (
      <Query
        query={LatexQuery}
        variables={{
          userText,
          skip: !userText,
        }}
      >
        {({ loading, data }: $TSFixMe) => (
          <MathExpressionPreviewView isLatexDataLoading={loading} latexData={(data || {}).latexData} />
        )}
      </Query>
    );
  }
}

export default MathExpressionPreview;
