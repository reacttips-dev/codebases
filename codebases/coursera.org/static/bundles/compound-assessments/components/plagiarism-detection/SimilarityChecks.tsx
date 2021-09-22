import React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import user from 'js/lib/user';

/* eslint-disable graphql/template-strings */
export const similarityChecksQuery = gql`
  query SimilarityChecksQuery($body: String!, $urlParamString: String!, $skip: Boolean!) {
    similarityChecksData(body: $body, urlParamString: $urlParamString)
      @skip(if: $skip)
      @rest(
        type: "RestSimilarityChecksdata"
        path: "similarityChecks.v1{args.urlParamString}"
        method: "POST"
        bodyKey: "body"
      ) {
      status
      result
      elements
    }
  }
`;

/* eslint-enable graphql/template-strings */

export const SimilarityChecksStatuses = {
  COMPLETE: 'COMPLETE',
  IN_PROGRESS: 'IN_PROGRESS',
} as const;

export type SimilarityChecksStatus = typeof SimilarityChecksStatuses[keyof typeof SimilarityChecksStatuses];

export type SimilarityChecksErrors =
  | 'UNSUPPORTED_FILETYPE'
  | 'PROCESSING_ERROR'
  | 'TOO_LITTLE_TEXT'
  | 'TOO_MUCH_TEXT'
  | 'CANNOT_EXTRACT_TEXT'
  | 'TOO_MANY_PAGES'
  | 'FILE_LOCKED'
  | 'CORRUPT_FILE';

export type SimilarityChecksResult = {
  orgCourseraSimilaritycheckSimilarityCheckSuccess?: {
    score: number;
    url: string;
  };
  orgCourseraSimilaritycheckSimilarityCheckFailure?: {
    errorMsg: SimilarityChecksErrors;
  };
};

export type SimilarityChecksData = {
  status: SimilarityChecksStatus;
  result?: SimilarityChecksResult;
  elements?: Array<{ id: string }>;
};

type SimilarityChecksQuery = {
  similarityChecksData: SimilarityChecksData;
};

type SimilarityChecksQueryVariables = {
  urlParamString: string;
  body: {
    requestType: 'SUBMIT_AND_GENERATE';
    requesterId: number;
    authorId: number;
    courseId: string;
    questionResponseId: string;
    itemId: string;
    useDraft: boolean;
  };
  skip: boolean;
};

type SimilarityChecksWithIdQueryVariables = {
  urlParamString: string;
  body: {};
  skip: boolean;
};

type Props = {
  courseId: string;
  itemId: string;
  authorId: number;
  questionResponseId: string;
  skip: boolean;
  children: (x0: {
    similarityChecksData?: SimilarityChecksData;
    loading: boolean;
    refetchReport: () => Promise<{}>;
    submitForCheck: () => Promise<{}>;
  }) => React.ReactNode;
};

export const SimilarityChecks = ({ courseId, itemId, authorId, questionResponseId, children, skip }: Props) => {
  const args = {
    requestType: 'SUBMIT_AND_GENERATE' as const,
    requesterId: user.get().id,
    authorId,
    courseId,
    questionResponseId,
    itemId,
    useDraft: true,
  };
  return (
    <Query<SimilarityChecksQuery, SimilarityChecksQueryVariables>
      query={similarityChecksQuery}
      notifyOnNetworkStatusChange={true}
      fetchPolicy="network-only"
      variables={{ body: args, urlParamString: '?action=read', skip }}
    >
      {({ loading, data, refetch }) => {
        const submitForCheck = () => refetch({ body: args, urlParamString: '', skip: false });
        const refetchReport = () => refetch({ body: args, urlParamString: '?action=read', skip: false });
        if (loading || !data) {
          return children({ refetchReport, submitForCheck, loading });
        }

        const { similarityChecksData } = data;

        return children({
          // the field elements is only returned for request without ?action=read
          // it is used to check if it is in progress
          similarityChecksData: similarityChecksData?.elements
            ? {
                status: 'IN_PROGRESS',
              }
            : similarityChecksData,
          refetchReport,
          submitForCheck,
          loading,
        });
      }}
    </Query>
  );
};

export const SimilarityChecksWithId = ({
  id,
  children,
}: {
  id: string;
  children: (x0: {
    similarityChecksData?: SimilarityChecksData;
    loading: boolean;
    refetchReport: () => Promise<{}>;
  }) => React.ReactNode;
}) => {
  return (
    <Query<SimilarityChecksQuery, SimilarityChecksWithIdQueryVariables>
      query={similarityChecksQuery}
      notifyOnNetworkStatusChange={true}
      fetchPolicy="network-only"
      variables={{ body: {}, urlParamString: `?action=readById&id=${id}`, skip: false }}
    >
      {({ loading, data, refetch }) => {
        if (loading || !data) {
          return children({ refetchReport: refetch, loading });
        }

        const { similarityChecksData } = data;

        return children({
          similarityChecksData,
          refetchReport: refetch,
          loading,
        });
      }}
    </Query>
  );
};

export default SimilarityChecks;
