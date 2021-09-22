/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import CenteredLoadingSpinner from 'bundles/assess-common/components/CenteredLoadingSpinner';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';

import SimilarityChecks, {
  SimilarityChecksData,
} from 'bundles/compound-assessments/components/plagiarism-detection/SimilarityChecks';
import { usePlagiarismDetectionContext } from 'bundles/compound-assessments/components/plagiarism-detection/v3/PlagiarismDetectionContext';
import PlagiarismDetectionResult from 'bundles/compound-assessments/components/plagiarism-detection/v3/PlagiarismDetectionResult';

export const ASSIGNMENT_TYPES = {
  STAFF: 'STAFF',
  PEER: 'PEER',
} as const;

type AssignmentType = typeof ASSIGNMENT_TYPES[keyof typeof ASSIGNMENT_TYPES];

export type InputProps = {
  courseId: string;
  itemId: string;
  authorId: number;
  assignmentType: AssignmentType;
  responseId: string;
  hasContent?: boolean;
  hasUnsavedChanges?: boolean;
};

type PropsFromContainer = {
  similarityChecksData?: SimilarityChecksData;
  loading: boolean;
  responseId: string;
  refetchReport: () => Promise<{}>;
  submitForCheck: () => Promise<{}>;
};

/**
 * This hook is used for exponential refetching of the similarity report from turnitin
 * The fetching interval is 10s, 10s, 20s, 20s, 1min, 1min, 1min
 * @param refetch refetch function
 * @param similarityChecksDataRef ref for similarity Check data
 */
const useExponentialRefetching = (
  refetch: () => Promise<{}>,
  similarityChecksDataRef: React.MutableRefObject<SimilarityChecksData | undefined>
) => {
  // exponential fetching
  // 10s, 10s, 20s, 20s, 1min, 1min, 1min
  const waitTimeRef = useRef([10 * 1000, 10 * 1000, 20 * 1000, 20 * 1000, 60 * 1000, 60 * 1000, 60 * 1000]);

  const { setIsPollingTimedOut } = usePlagiarismDetectionContext();

  const startRefetching = (isManuallyTriggered: boolean) => {
    const { result, status } = similarityChecksDataRef.current || {};
    const waitTime = waitTimeRef.current.splice(0, 1);
    if (waitTime.length === 0 || !!result) {
      if (waitTime.length === 0) {
        setIsPollingTimedOut(true);
      }
      return;
    }
    setTimeout(() => {
      // only refetch when there is no result
      if ((!result && status) || isManuallyTriggered) {
        refetch();
        startRefetching(isManuallyTriggered);
      }
    }, waitTime[0]);
  };

  return startRefetching;
};
/**
 * Component primarily for prompt level results display and updating the prompt plagiarism data
 * in the PlagiarismDetectionContext
 */
export const PlagiarismDetectionContainerV3: React.FC<PropsFromContainer> = (props) => {
  const { submitForCheck, refetchReport, similarityChecksData, loading, responseId } = props;

  const {
    isReadyForCheck,
    setIsReadyForCheck,
    similarityChecksDataMap,
    setSimilarityChecksDataMap,
  } = usePlagiarismDetectionContext();

  const similarityChecksDataRef = useRef(similarityChecksData);

  // hook for syncing the similarityChecksDataRef
  useEffect(() => {
    similarityChecksDataRef.current = similarityChecksData;
  }, [similarityChecksData]);

  const startRefetching = useExponentialRefetching(refetchReport, similarityChecksDataRef);

  // mount trigger for exponential refetching
  useEffect(() => {
    startRefetching(false);
  }, []);

  // hook for triggering the check
  useEffect(() => {
    // this context is toggled once the assignment level check action is triggered
    if (isReadyForCheck && !similarityChecksDataRef.current?.result) {
      submitForCheck().then(() => {
        setIsReadyForCheck(false);
      });

      // button trigger for exponential refetching
      startRefetching(true);
    }
  }, [isReadyForCheck]);

  // hook for storing the similarity data in the context
  useEffect(() => {
    if (similarityChecksData) {
      setSimilarityChecksDataMap({ ...similarityChecksDataMap, [responseId]: similarityChecksData });
    }
  }, [similarityChecksData]);

  if (loading) {
    return <CenteredLoadingSpinner />;
  }

  const { result, status } = similarityChecksData || {};

  if ((!result && !status) || !status) {
    // 204 no content
    // returned when check for plagiarism has not been requested
    // or when hasContent is false(query would be skipped)
    return null;
  }

  return <PlagiarismDetectionResult result={result} status={status} refetch={refetchReport} />;
};

const PlagiarismDetectionContainerV3Container: React.FC<InputProps> = (props) => {
  const { courseId, itemId, authorId, assignmentType, responseId, hasContent, hasUnsavedChanges } = props;
  const questionResponseId = tupleToStringKey([assignmentType, responseId]);

  const { similarityChecksDataMap, setSimilarityChecksDataMap } = usePlagiarismDetectionContext();

  // hook for initializing the plagiarism results map
  useEffect(() => {
    setSimilarityChecksDataMap({ ...similarityChecksDataMap, [responseId]: undefined });
  }, [responseId]);

  if (hasUnsavedChanges || !hasContent) {
    return null;
  }

  return (
    <SimilarityChecks
      courseId={courseId}
      authorId={authorId}
      itemId={itemId}
      questionResponseId={questionResponseId}
      skip={!hasContent}
    >
      {({ similarityChecksData, refetchReport, submitForCheck, loading }) => {
        return (
          <PlagiarismDetectionContainerV3
            loading={loading}
            submitForCheck={submitForCheck}
            similarityChecksData={similarityChecksData}
            refetchReport={refetchReport}
            responseId={responseId}
          />
        );
      }}
    </SimilarityChecks>
  );
};

export default PlagiarismDetectionContainerV3Container;
