import React, { createContext, useContext, useState } from 'react';
import { SimilarityChecksData } from 'bundles/compound-assessments/components/plagiarism-detection/SimilarityChecks';

export type SimilarityChecksDataMapType = Record<string, SimilarityChecksData | undefined>;

export type PlagiarismDetectionContextType = {
  isReadyForCheck: boolean;
  setIsReadyForCheck: (isReadyForCheck: boolean) => void;
  isPollingTimedOut: boolean;
  setIsPollingTimedOut: (isPollingTimedOut: boolean) => void;
  similarityChecksDataMap: SimilarityChecksDataMapType;
  setSimilarityChecksDataMap: (similarityChecksDataMap: SimilarityChecksDataMapType) => void;
};

const PlagiarismDetectionContext = createContext<PlagiarismDetectionContextType>({
  isReadyForCheck: false,
  setIsReadyForCheck: () => undefined,
  isPollingTimedOut: false,
  setIsPollingTimedOut: () => undefined,
  similarityChecksDataMap: {},
  setSimilarityChecksDataMap: () => undefined,
});

export const usePlagiarismDetectionContext = () => {
  return useContext(PlagiarismDetectionContext);
};

/**
 * This component manages the ready for check context and the overall result data
 * it should be placed on the assignment level component
 */
export const PlagiarismDetectionContextProvider: React.FC<{}> = ({ children }) => {
  const [isReadyForCheck, setIsReadyForCheck] = useState(false);
  const [isPollingTimedOut, setIsPollingTimedOut] = useState(false);
  const [similarityChecksDataMap, setSimilarityChecksDataMap] = useState({});

  return (
    <PlagiarismDetectionContext.Provider
      value={{
        isReadyForCheck,
        setIsReadyForCheck,
        isPollingTimedOut,
        setIsPollingTimedOut,
        similarityChecksDataMap,
        setSimilarityChecksDataMap,
      }}
    >
      {children}
    </PlagiarismDetectionContext.Provider>
  );
};
