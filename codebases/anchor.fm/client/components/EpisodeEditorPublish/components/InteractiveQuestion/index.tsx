import React, { useState } from 'react';
import { Global } from '@emotion/core';
import { ThreeDotMenu } from 'components/EpisodeEditorPublish/components/InteractiveQuestion/ThreeDotMenu';
import { useFetchQuestionAndResponses } from 'hooks/useInteractivityQnA';
import { SpotifyLogo } from 'components/svgs/SpotifyLogo';
import { Modal } from 'shared/Modal';
import { InteractiveQuestionForm } from '../InteractiveQuestionForm';
import {
  InteractivePollContainer,
  Title,
  RoundedCard,
  CopyContainer,
  FormContainer,
  OpenModalButton,
  QuestionTitle,
  StatusText,
  Optional,
  TopBarContainer,
  BootstrapModifiers,
  ModalTitle,
} from '../InteractivePoll/styles';

export function InteractiveQuestion({ episodeId }: { episodeId: string }) {
  const { data, status } = useFetchQuestionAndResponses(episodeId);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  if (!data || status === 'loading') return null;

  const { question: { text = '', questionId } = {} } = data;

  const defaultValues = {
    text,
  };

  return (
    <InteractivePollContainer>
      <Global styles={BootstrapModifiers} />
      <Title>Q&amp;A</Title> <Optional>(Only available on Spotify)</Optional>
      <RoundedCard>
        <CopyContainer>
          <TopBarContainer>
            <SpotifyLogo width={63} />
            {questionId && (
              <ThreeDotMenu episodeId={episodeId} questionId={questionId} />
            )}
          </TopBarContainer>
          <QuestionTitle>
            {text ||
              `Engage with listeners directly from your episode with a question`}
          </QuestionTitle>
          {questionId && <StatusText>Status: Published</StatusText>}
        </CopyContainer>
        {!questionId && (
          <>
            <OpenModalButton
              kind="button"
              type="button"
              onClick={() => setIsQuestionModalOpen(!isQuestionModalOpen)}
              color="purple"
            >
              Add a question
            </OpenModalButton>
            {isQuestionModalOpen && (
              <Modal
                isShowing
                isShowingCloseButton
                onClickOutside={() => setIsQuestionModalOpen(false)}
                onClickClose={() => setIsQuestionModalOpen(false)}
                renderContent={() => (
                  <FormContainer>
                    <ModalTitle>Add a question</ModalTitle>
                    <InteractiveQuestionForm
                      onSuccess={() => setIsQuestionModalOpen(false)}
                      defaultValues={defaultValues}
                      episodeId={episodeId}
                    />
                  </FormContainer>
                )}
              />
            )}
          </>
        )}
      </RoundedCard>
    </InteractivePollContainer>
  );
}
