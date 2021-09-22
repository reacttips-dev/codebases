import React from 'react';
import { Route, Redirect, IndexRoute } from 'react-router';
import loadOnRoute from 'bundles/common/components/loadOnRoute';
import { isCDSQuizzesEnabled } from 'bundles/quiz-compound-assessment/CDSFlags';
import { isCDSTMRPageEnabled } from 'bundles/teammate-review/CDSFlags';
import {
  isCdsPluginPageEnabled,
  isCdsLtiPageEnabled,
  isCdsUngradedLabPageEnabled,
  isCdsProgrammingAssignmentPageEnabled,
  isCDSAdoptionQ2ABTestEnabled,
  isCdsItemLecturePageEnabled,
} from 'bundles/course-v2/featureFlags';
import { isCDSReadingsEnabled } from 'bundles/item-reading/CDSFlags';
import { isCdsSgaEnabled } from 'bundles/compound-assessments/CDSFlags';

const ItemPage = loadOnRoute(() => {
  return isCDSAdoptionQ2ABTestEnabled()
    ? import('bundles/item/components/cds/ItemPage')
    : import('bundles/item/components/ItemPage');
});

const WiseFlowItem = loadOnRoute(() => import('bundles/lms-interop/wise-flow-item/WiseFlowItem'));
const LtiItem = loadOnRoute(() =>
  isCdsLtiPageEnabled()
    ? import('bundles/item-lti/components/cds/LtiItem')
    : import('bundles/item-lti/components/LtiItem')
);
const NotebookWorkspaceItem = loadOnRoute(() => import('bundles/item/components/NotebookWorkspaceItem'));
const WorkspaceItem = loadOnRoute(() => import('bundles/item-workspace/components/WorkspaceItem'));
const UngradedLabItem = loadOnRoute(() =>
  isCdsUngradedLabPageEnabled()
    ? import('bundles/item-ungraded-lab/components/cds/UngradedLabItem')
    : import('bundles/item-ungraded-lab/components/UngradedLabItem')
);

const DiscussionPromptWrapper = loadOnRoute(() => import('bundles/item/components/DiscussionPromptWrapper'));
const GradedDiscussionPromptItem = loadOnRoute(
  () => import('bundles/graded-discussion-prompt/components/GradedDiscussionPromptItem')
);

const PlaceholderItem = loadOnRoute(() => import('bundles/item/components/PlaceholderItem'));

const VideoItemContainer = loadOnRoute(() =>
  isCdsItemLecturePageEnabled()
    ? import('bundles/item-lecture/components/cds/VideoItemContainer')
    : import('bundles/item-lecture/components/v1/VideoItemContainer')
);
const WidgetItem = loadOnRoute(() =>
  isCdsPluginPageEnabled()
    ? import('bundles/item-widget/components/cds/WidgetItem')
    : import('bundles/item-widget/components/WidgetItem')
);
const ReadingItem = loadOnRoute(() =>
  isCDSReadingsEnabled()
    ? import('bundles/item-reading/components/cds/ReadingItem')
    : import('bundles/item-reading/components/ReadingItem')
);

const ProgrammingItem = loadOnRoute(() =>
  isCdsProgrammingAssignmentPageEnabled()
    ? import('bundles/item-programming/components/cds/ProgrammingItem')
    : import('bundles/item-programming/components/ProgrammingItem')
);
const ProgrammingSubmission = loadOnRoute(() =>
  isCdsProgrammingAssignmentPageEnabled()
    ? import('bundles/item-programming/components/cds/ProgrammingSubmission')
    : import('bundles/item-programming/components/ProgrammingSubmission')
);
const ProgrammingDiscussions = loadOnRoute(() =>
  isCdsProgrammingAssignmentPageEnabled()
    ? import('bundles/item-programming/components/cds/ProgrammingDiscussions')
    : import('bundles/item-programming/components/ProgrammingDiscussions')
);
const ProgrammingInstructions = loadOnRoute(() =>
  isCdsProgrammingAssignmentPageEnabled()
    ? import('bundles/item-programming/components/cds/ProgrammingInstructions')
    : import('bundles/item-programming/components/ProgrammingInstructions')
);
const ProgrammingLabLearner = loadOnRoute(() =>
  isCdsProgrammingAssignmentPageEnabled()
    ? import('bundles/item-programming/components/cds/ProgrammingLabLearner')
    : import('bundles/item-programming/components/ProgrammingLabLearner')
);

const PeerItemPage = loadOnRoute(() => import('bundles/peer/components/page/PeerItemPage'));
const PeerItemGiveFeedback = loadOnRoute(() => import('bundles/peer/components/PeerItemGiveFeedback'));
const PeerItemInstructions = loadOnRoute(() => import('bundles/peer/components/PeerItemInstructions'));
const PeerItemReview = loadOnRoute(() => import('bundles/peer/components/PeerItemReview'));
const PeerItemReviewNext = loadOnRoute(() => import('bundles/peer/components/PeerItemReviewNext'));
const PeerItemRubricPreview = loadOnRoute(() => import('bundles/peer/components/PeerItemRubricPreview'));
const PeerItemSubmit = loadOnRoute(() => import('bundles/peer/components/PeerItemSubmit'));

const PeerItemDiscussionsContainer = loadOnRoute(
  () => import('bundles/assess-common/components/PeerItemDiscussionsContainer')
);

const TeammateReviewItem = loadOnRoute(() =>
  isCDSTMRPageEnabled()
    ? import('bundles/teammate-review/components/cds/TeammateReviewItem')
    : import('bundles/teammate-review/components/TeammateReviewItem')
);
const TeammateReviewCover = loadOnRoute(() =>
  isCDSTMRPageEnabled()
    ? import('bundles/teammate-review/components/cover/cds/TeammateReviewCover')
    : import('bundles/teammate-review/components/cover/TeammateReviewCover')
);
const TeammateReview = loadOnRoute(() =>
  isCDSTMRPageEnabled()
    ? import('bundles/teammate-review/components/review/cds/TeammateReview')
    : import('bundles/teammate-review/components/review/TeammateReview')
);
const TeammateReviewGrades = loadOnRoute(() =>
  isCDSTMRPageEnabled()
    ? import('bundles/teammate-review/components/grades/cds/TMRGrades')
    : import('bundles/teammate-review/components/grades/TMRGrades')
);

const QuizCoverPage = loadOnRoute(() =>
  isCDSQuizzesEnabled()
    ? import('bundles/quiz-compound-assessment/components/cds/QuizCoverPage')
    : import('bundles/quiz-compound-assessment/components/QuizCoverPage')
);
const PracticeQuizCoverPage = loadOnRoute(() =>
  isCDSQuizzesEnabled()
    ? import('bundles/quiz-compound-assessment/components/cds/PracticeQuizCoverPage')
    : import('bundles/quiz-compound-assessment/components/PracticeQuizCoverPage')
);
const QuizAttemptPage = loadOnRoute(() =>
  isCDSQuizzesEnabled()
    ? import('bundles/quiz-compound-assessment/components/cds/AttemptPage')
    : import('bundles/quiz-compound-assessment/components/AttemptPage')
);
const PracticeQuizAttemptPage = loadOnRoute(() =>
  isCDSQuizzesEnabled()
    ? import('bundles/quiz-compound-assessment/components/cds/PracticeQuizAttemptPage')
    : import('bundles/quiz-compound-assessment/components/PracticeQuizAttemptPage')
);
const SubmittedQuizAttemptPage = loadOnRoute(() =>
  isCDSQuizzesEnabled()
    ? import('bundles/quiz-compound-assessment/components/cds/SubmittedAttemptPage')
    : import('bundles/quiz-compound-assessment/components/SubmittedAttemptPage')
);
const SubmittedPracticeQuizAttemptPage = loadOnRoute(() =>
  isCDSQuizzesEnabled()
    ? import('bundles/quiz-compound-assessment/components/cds/SubmittedPracticeQuizAttemptPage')
    : import('bundles/quiz-compound-assessment/components/SubmittedPracticeQuizAttemptPage')
);

const Cover = loadOnRoute(() =>
  isCdsSgaEnabled()
    ? import('bundles/compound-assessments/components/cover/cds/CoverRoute')
    : import('bundles/compound-assessments/components/cover/CoverRoute')
);

const StepPage = loadOnRoute(() =>
  isCdsSgaEnabled()
    ? import('bundles/compound-assessments/components/steps/cds/StepPage')
    : import('bundles/compound-assessments/components/steps/StepPage')
);

// We now prefix all questions with the path "threads" so add a redirect from old routes.
const generateDiscussionsThreadsRedirect = () => {
  return (
    <Route>
      <Redirect from=":question_id" to="threads/:question_id" />
      <Redirect from=":question_id/replies/:answer_id" to="threads/:question_id/replies/:answer_id" />
      <Redirect
        from=":question_id/replies/:answer_id/comments/:comment_id"
        to="threads/:question_id/replies/:answer_id/comments/:comment_id"
      />
    </Route>
  );
};

export default [
  // routes at top to get component in blank page and avoid ItemPage layout
  <Route path="programming/:itemId(/:slug)/lab" name="programmingLab" getComponent={ProgrammingLabLearner} />,
  <Route path="ungradedLab/:itemId(/:slug)/lab" name="programmingLab" getComponent={ProgrammingLabLearner} />,
  <Route getComponent={ItemPage}>
    <Route path="peer/:item_id/" name="peer" getComponent={PeerItemPage}>
      <Route path=":slug">
        <IndexRoute name="peer.instructions" getComponent={PeerItemInstructions} />
        <Route path="submit" name="peer.submit" getComponent={PeerItemSubmit} />
        <Route path="rubric-preview" name="peer.rubricPreview" getComponent={PeerItemRubricPreview} />
        <Route path="give-feedback" name="peer.give-feedback" getComponent={PeerItemGiveFeedback} />
        <Route path="review-next" name="peer.review-next" getComponent={PeerItemReviewNext} />
        <Route path="review/:submission_id(/admin)" name="peer.review" getComponent={PeerItemReview} />

        <Route path="discussions" name="peer.discussions">
          <IndexRoute getComponent={PeerItemDiscussionsContainer} />
          <Route path="threads/:question_id" getComponent={PeerItemDiscussionsContainer} />
          <Route path="threads/:question_id/replies/:answer_id" getComponent={PeerItemDiscussionsContainer} />
          <Route
            path="threads/:question_id/replies/:answer_id/comments/:comment_id"
            getComponent={PeerItemDiscussionsContainer}
          />

          {generateDiscussionsThreadsRedirect()}
        </Route>
      </Route>
    </Route>

    <Redirect from="team/:item_id" to="irt/:item_id" />
    <Redirect from="team/:item_id/:slug(/:extra)" to="irt/:item_id/:slug" />

    <Route path="discussionPrompt/:item_id(/:slug)" name="discussionPrompt" getComponent={DiscussionPromptWrapper} />

    <Route
      path="gradedDiscussionPrompt/:item_id(/:slug)"
      name="gradedDiscussionPrompt"
      getComponent={GradedDiscussionPromptItem}
    />
    <Route path="ungradedWidget/:item_id(/:slug)" name="widget" getComponent={WidgetItem} />
    <Route path="supplement/:item_id(/:slug)" name="reading" getComponent={ReadingItem} />
    <Route path="wiseFlow/:item_id(/:slug)" name="wiseFlow" getComponent={WiseFlowItem} />
    <Route path="gradedLti/:item_id(/:slug)" name="gradedLti" getComponent={LtiItem} />
    <Route path="ungradedLti/:item_id(/:slug)" name="ungradedLti" getComponent={LtiItem} />
    <Route path="notebook/:item_id(/:slug)" name="notebook" getComponent={NotebookWorkspaceItem} />
    <Route path="workspace/:item_id(/:slug)" name="workspace" getComponent={WorkspaceItem} />
    <Route path="workspace/:item_id(/:slug)" name="workspace" getComponent={WorkspaceItem} />
    <Route path="ungradedLab/:item_id(/:slug)" name="ungradedLab" getComponent={UngradedLabItem} />
    <Route path="programming/:item_id(/:slug)" name="programming" getComponent={ProgrammingItem}>
      <IndexRoute name="programmingDefault" getComponent={ProgrammingInstructions} />
      <Route path="instructions" name="programmingInstructions" getComponent={ProgrammingInstructions} />
      <Route path="submission" name="programmingSubmission" getComponent={ProgrammingSubmission} />
      <Route path="discussions" name="programming.discussions">
        <IndexRoute getComponent={ProgrammingDiscussions} />
        <Route path="threads/:question_id" getComponent={ProgrammingDiscussions} />
        <Route path="threads/:question_id/replies/:answer_id" getComponent={ProgrammingDiscussions} />
        <Route
          path="threads/:question_id/replies/:answer_id/comments/:comment_id"
          getComponent={ProgrammingDiscussions}
        />

        {generateDiscussionsThreadsRedirect()}
      </Route>
    </Route>
    <Route />
    <Route ignoreScrollBehavior name="lecture">
      <Route path="lecture/:item_id(/:slug)" getComponent={VideoItemContainer} />
      <Route path="lecture/:item_id/:slug/discussions(/:question_id)" getComponent={VideoItemContainer} />
      <Route
        path="lecture/:item_id/:slug/discussions/:question_id/replies/:answer_id"
        getComponent={VideoItemContainer}
      />

      <Route
        path="lecture/:item_id/:slug/discussions/:question_id/replies/:answer_id/comments/:comment_id"
        getComponent={VideoItemContainer}
      />
    </Route>

    {/* On course week page links to items are provided by BE. TMR items have wrong */}
    {/* path: `teammateReview` instead of `teammate-review`. This is a temporary */}
    {/* redirect until we will fix it on BE. */}
    <Redirect from="teammateReview/:item_id(/:slug)" to="teammate-review/:item_id(/:slug)" />

    <Route path="teammate-review/:item_id(/:slug)" name="teammate-review-item" getComponent={TeammateReviewItem}>
      <IndexRoute name="teammate-review-cover" getComponent={TeammateReviewCover} />
      <Route path="review/:teammateId" name="teammate-review-review" getComponent={TeammateReview} />
      <Route path="grades" name="teammate-review-grades" getComponent={TeammateReviewGrades} />
    </Route>

    <Route path="irt/:item_id(/:slug)" name="ca-cover" getComponent={Cover}>
      <Route path=":stepNum/:stepSlug(/:stepParam)" name="ca-step" getComponent={StepPage} />
    </Route>
    <Route path="exam/:item_id(/:slug)" name="quiz-cover" getComponent={QuizCoverPage}>
      <Route path="attempt" name="quiz-attempt" getComponent={QuizAttemptPage} />
      <Route path="view-attempt" name="quiz-view-attempt" getComponent={SubmittedQuizAttemptPage} />
    </Route>
    <Route path="quiz/:item_id(/:slug)" name="practice-quiz-cover" getComponent={PracticeQuizCoverPage}>
      <Route path="attempt" name="practice-quiz-attempt" getComponent={PracticeQuizAttemptPage} />
      <Route path="view-attempt" name="practice-quiz-view-attempt" getComponent={SubmittedPracticeQuizAttemptPage} />
    </Route>

    <Route path="placeholder/:item_id(/:slug)" name="placeholder" getComponent={PlaceholderItem} />
  </Route>,
];
