import SemanticTypes from 'constants/semantic-types';
import {
    __
} from 'services/localization-service';

export const QUESTION_TYPES = {
    TIME_INPUT: 'TIME_INPUT',
    TEXT_INPUT: 'TEXT_INPUT',
    RADIO: 'RADIO',
};

// These constants are *shared* by the feedback prompts in the
// atomFeedbacks function below. If you're adding a new text string
// *that is shared*, then add it here...otherwise, add it directly
// to the prompt in the atomFeedbacks function.
const CAN_YOU_TELL_US_MORE = __('Can you tell us more?');
const COMMENTS = __('Comments');
const CONTENT_ERROR = __('Error in content');
const QUIZ_ANSWER_ACCEPTED = __('Incorrect answer was accepted');
const QUIZ_ANSWER_REJECTED = __('Correct answer was rejected');
const QUIZ_CONFUSING = __('Quiz is confusing');
const QUIZ_QUESTION_POSED = __('Question that is posed');
const QUIZ_RESPONSES_OFFERED = __('Response choices offered');
const QUIZ_SOLUTION_CORRECT_ANSWER = __('Solution / Correct answer');
const QUIZ_DATASET_OR_RESOURCES = __('Dataset or resources');
const TIME_PLACEHOLDER = __('MM: SS');
const WHAT_IS_CONFUSING = __('What do you find confusing?');
const WHAT_IS_WRONG = __('What error did you encounter?');
const WHAT_CORRECTION_NEEDS_TO_BE_MADE = __(
    'What correction needs to be made?'
);
const WHAT_WAS_SUBMITTED = __('What was submitted?');
const WHAT_WOULD_BE_HELPFUL = __('What would you find helpful here?');

function promptText(prompt, placeholder, required) {
    return {
        prompt,
        placeholder,
        required,
        type: QUESTION_TYPES.TEXT_INPUT,
    };
}

function promptTextRequired(prompt, placeholder = null) {
    return promptText(prompt, placeholder, true);
}

function promptTime(prompt, placeholder, required) {
    return {
        prompt,
        placeholder,
        required,
        type: QUESTION_TYPES.TIME_INPUT,
    };
}

function promptTimeRequired(prompt, placeholder = null) {
    return promptTime(prompt, placeholder, true);
}

const promptRadio = ({
    prompt,
    choices
}) => ({
    prompt,
    choices,
    required: true,
    type: QUESTION_TYPES.RADIO,
});

const radioChoice = (text, prompt) => ({
    text,
    input: prompt,
});

const categoryWithPrompts = (category, subPrompts) => ({
    feedback: category,
    subPrompts,
});

const otherFeedback = categoryWithPrompts(__('Other'), [
    promptRadio({
        prompt: CAN_YOU_TELL_US_MORE,
        choices: [
            radioChoice(__('Something is going well')),
            radioChoice(__('Something can be improved')),
        ],
    }),
    promptTextRequired(COMMENTS),
]);

export function atomFeedbacks() {
    const textAtomFeedbacks = [
        categoryWithPrompts(__('Content contains outdated information'), [
            promptTextRequired(
                __('Which specific piece of text on this page is out-of-date?')
            ),
            promptTextRequired(
                __(
                    'What text would you replace this with? Include any links that will be helpful.'
                )
            ),
        ]),
        categoryWithPrompts(__('Content is not explained well'), [
            promptTextRequired(__('What specific text is not explained well?')),
            promptTextRequired(__('What did you not understand?')),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(__('Content needs more detail'), [
            promptTextRequired(__('What topic needs more detail?')),
            promptTextRequired(__('What additional detail should be included?')),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(
            __('Resource is missing or broken (link, dataset, etc)'), [promptTextRequired(__('What is missing or broken?'))]
        ),
        categoryWithPrompts(CONTENT_ERROR, [
            promptTextRequired(WHAT_IS_WRONG),
            promptTextRequired(__('How did you know this was an error?')),
            promptText(__('Please list any additional resources you reviewed.')),
        ]),
        otherFeedback,
    ];

    const imageAtomFeedbacks = [
        categoryWithPrompts(__('Problem loading image'), [
            promptTextRequired(COMMENTS),
        ]),
        categoryWithPrompts(__('Image contains outdated information'), [
            promptTextRequired(__('What is out-of-date?')),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(__('Image is confusing'), [
            promptTextRequired(WHAT_IS_CONFUSING),
            promptTextRequired(__('What additional information  would be helpful?')),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(__('Image needs more detail'), [
            promptTextRequired(__('What part of the image is lacking details?')),
            promptText(__('What foundational or additional step can be added?')),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(CONTENT_ERROR, [
            promptTextRequired(__('What aspect of the image is inaccurate?')),
            promptText(COMMENTS),
        ]),
        otherFeedback,
    ];

    const videoAtomFeedbacks = [
        categoryWithPrompts(__('Can’t play video'), [
            promptRadio({
                prompt: CAN_YOU_TELL_US_MORE,
                choices: [
                    radioChoice(__('Video does not play at all')),
                    radioChoice(
                        __('Portion of video does not play'),
                        promptTextRequired(
                            __('When does the video stop playing? (e.g. 02:15)'),
                            TIME_PLACEHOLDER
                        )
                    ),
                ],
            }),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(__('Can’t play audio'), [
            promptRadio({
                prompt: CAN_YOU_TELL_US_MORE,
                choices: [
                    radioChoice(__('Audio does not play at all')),
                    radioChoice(
                        __('Portion of audio does not play'),
                        promptTextRequired(
                            __('When does the audio stop playing? (e.g. 02:15)'),
                            TIME_PLACEHOLDER
                        )
                    ),
                ],
            }),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(__('Video transcript is wrong'), [
            promptTextRequired(
                __('At what timestamp is the transcription inaccurate (e.g 02:15)?')
            ),
            promptTextRequired(WHAT_CORRECTION_NEEDS_TO_BE_MADE),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(__('Video contains outdated information'), [
            promptTimeRequired(
                __(
                    'Which section of the video contains outdated information? (e.g. 02:15)'
                )
            ),
            promptTextRequired(__('What information is out-of-date?')),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(__('Video is confusing'), [
            promptTextRequired(
                __('Which section of the video is confusing? (e.g. 02:15)')
            ),
            promptTextRequired(WHAT_IS_CONFUSING),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(__('Video is lacking details'), [
            promptTextRequired(__('What detail is missing?')),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(CONTENT_ERROR, [
            promptTextRequired(
                __('When does an error occur in the video? (e.g. 02:15)')
            ),
            promptTextRequired(__('What is the error?')),
            promptText(COMMENTS),
        ]),
        otherFeedback,
    ];

    const quizAtomUnvalidatedFeedbacks = [
        categoryWithPrompts(__('Error in quiz'), [
            promptRadio({
                prompt: __('What part of the question is wrong?'),
                choices: [
                    radioChoice(QUIZ_QUESTION_POSED),
                    radioChoice(QUIZ_RESPONSES_OFFERED),
                    radioChoice(QUIZ_SOLUTION_CORRECT_ANSWER),
                    radioChoice(QUIZ_DATASET_OR_RESOURCES),
                ],
            }),
            promptTextRequired(__('How can it be fixed?')),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(QUIZ_CONFUSING, [
            promptRadio({
                prompt: __('What part of the question do you find confusing?'),
                choices: [
                    radioChoice(QUIZ_QUESTION_POSED),
                    radioChoice(QUIZ_RESPONSES_OFFERED),
                    radioChoice(QUIZ_SOLUTION_CORRECT_ANSWER),
                    radioChoice(QUIZ_DATASET_OR_RESOURCES),
                ],
            }),
            promptTextRequired(__('Please share ideas for how to improve it.')),
            promptText(COMMENTS),
        ]),
        otherFeedback,
    ];

    const quizAtomFeedbacks = [
        categoryWithPrompts(QUIZ_CONFUSING, [
            promptTextRequired(WHAT_IS_CONFUSING),
            promptTextRequired(WHAT_WOULD_BE_HELPFUL),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(QUIZ_ANSWER_REJECTED, [
            promptTextRequired(WHAT_WAS_SUBMITTED),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(QUIZ_ANSWER_ACCEPTED, [
            promptTextRequired(WHAT_WAS_SUBMITTED),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(__('Solution was not provided'), [
            promptTextRequired(COMMENTS),
        ]),
        categoryWithPrompts(
            __('Quiz feedback was insufficient to get correct answer'), [
                promptTextRequired(__('Suggestion as to how feedback can be improved')),
                promptText(COMMENTS),
            ]
        ),
        categoryWithPrompts(__('Error in quiz, solution, and/or feedback'), [
            promptTextRequired(WHAT_IS_WRONG),
            promptTextRequired(__('Why is this an error?')),
            promptText(COMMENTS),
        ]),
        otherFeedback,
    ];

    const workspaceAtomFeedbacks = [
        categoryWithPrompts(__('Loading problems'), [promptTextRequired(COMMENTS)]),
        categoryWithPrompts(__('Content is confusing'), [
            promptTextRequired(WHAT_IS_CONFUSING),
            promptTextRequired(WHAT_WOULD_BE_HELPFUL),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(QUIZ_ANSWER_REJECTED, [
            promptTextRequired(WHAT_WAS_SUBMITTED),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(QUIZ_ANSWER_ACCEPTED, [
            promptTextRequired(WHAT_WAS_SUBMITTED),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(CONTENT_ERROR, [
            promptTextRequired(__('What is the error?')),
            promptText(WHAT_CORRECTION_NEEDS_TO_BE_MADE),
            promptText(COMMENTS),
        ]),
        categoryWithPrompts(__('Files missing'), [
            promptTextRequired(__('What is missing?')),
            promptText(COMMENTS),
        ]),
        otherFeedback,
    ];

    return {
        [SemanticTypes.IMAGE_ATOM]: imageAtomFeedbacks,
        [SemanticTypes.TEXT_ATOM]: textAtomFeedbacks,
        [SemanticTypes.QUIZ_ATOM]: quizAtomFeedbacks,
        [SemanticTypes.TASKLIST_ATOM]: quizAtomUnvalidatedFeedbacks,
        [SemanticTypes.CHECKBOX_QUIZ_ATOM]: quizAtomFeedbacks,
        [SemanticTypes.MATCHING_QUIZ_ATOM]: quizAtomFeedbacks,
        [SemanticTypes.RADIO_QUIZ_ATOM]: quizAtomFeedbacks,
        [SemanticTypes.VALIDATED_QUIZ_ATOM]: quizAtomFeedbacks,
        [SemanticTypes.VIDEO_ATOM]: videoAtomFeedbacks,
        [SemanticTypes.WORKSPACE_ATOM]: workspaceAtomFeedbacks,
        [SemanticTypes.REFLECT_ATOM]: quizAtomUnvalidatedFeedbacks,
    };
}

export function getFeedbacksForAtomType(semanticType) {
    return atomFeedbacks()[semanticType];
}