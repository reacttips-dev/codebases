import {
    promptTitle,
    promptDescription,
    promptYesLabel,
    promptNoLabel,
    ratingTitle1,
    ratingTitle2,
    ratingTitle3,
    ratingTitle4,
    ratingTitle5,
    moreInfoText,
    calendarSurveyPromptTitle,
    documentPreviewSurveyPromptTitle,
    documentPreviewSurveyRatingQuestion,
    translatorSurveyPromptTitle,
    translatorSurveyPromptSecondLineTwoQuestions,
    translatorPromptYesLabel,
    translatorPromptNoLabel,
    translatorSurveyRatingQuestion,
    translatorDialogSurveyCommentQuestion,
    ratingTitleWithNumber1,
    ratingTitleWithNumber5,
    linkPreviewSurveyPromptTitle,
    linkPreviewSurveyRatingQuestion,
    notesSurveyPromptTitle,
    notesSurveyRatingQuestion,
    pauseInboxSurveyPromptTitle,
    promptSecondLineQuestion2,
    pauseInboxSurveyRatingQuestion,
    consumerGroupsSurveyPromptTitle,
    consumerGroupsSurveyRatingQuestion,
    consumerGroupsSurveyCommentQuestion,
    proofingSurveyPromptTitle,
    proofingSurveyRatingQuestion,
    proofingMoreInfoQuestion,
    oneNoteFeedSurveyPromptTitle,
    oneNoteFeedSurveyRatingQuestion,
    nlqsSurveyPromptTitle,
    nlqsSurveyPromptQuestion,
    nlqsSurveyPromptYesLabel,
    nlqsSurveyPromptNoLabel,
    nlqsSurveyRatingQuestion,
    nlqsSurveyRatingValue2,
    nlqsSurveyRatingValue3,
    nlqsSurveyRatingValue4,
    nlqsSurveyQuestionQuestion,
} from './surveySettingsAndConstants.locstring.json';
import loc from 'owa-localize';
import { isGulpOrBranchingValue } from 'owa-querystring';
import { isFeatureEnabled } from 'owa-feature-flags';

const enum StringsPlaceHolders {
    SEA_Prompt_Title = 'SEA_Prompt_Title',
    SEA_Prompt_Question = 'SEA_Prompt_Question',
    SEA_Prompt_YesLabel = 'SEA_Prompt_YesLabel',
    SEA_Prompt_NoLabel = 'SEA_Prompt_NoLabel',
    SEA_Rating_Question = 'SEA_Rating_Question',
    SEA_Rating_Values_1 = 'SEA_Rating_Values_1',
    SEA_Rating_Values_2 = 'SEA_Rating_Values_2',
    SEA_Rating_Values_3 = 'SEA_Rating_Values_3',
    SEA_Rating_Values_4 = 'SEA_Rating_Values_4',
    SEA_Rating_Values_5 = 'SEA_Rating_Values_5',
    SEA_Question_Question = 'SEA_Question_Question',
    CAL_Prompt_Title = 'CAL_Prompt_Title',
    CAL_Prompt_Question = 'CAL_Prompt_Question',
    CAL_Prompt_YesLabel = 'CAL_Prompt_YesLabel',
    CAL_Prompt_NoLabel = 'CAL_Prompt_NoLabel',
    CAL_Rating_Question = 'CAL_Rating_Question',
    CAL_Rating_Values_1 = 'CAL_Rating_Values_1',
    CAL_Rating_Values_2 = 'CAL_Rating_Values_2',
    CAL_Rating_Values_3 = 'CAL_Rating_Values_3',
    CAL_Rating_Values_4 = 'CAL_Rating_Values_4',
    CAL_Rating_Values_5 = 'CAL_Rating_Values_5',
    CAL_Question_Question = 'CAL_Question_Question',
    DOC_Prompt_Title = 'DOC_Prompt_Title',
    DOC_Prompt_Question = 'DOC_Prompt_Question',
    DOC_Prompt_YesLabel = 'DOC_Prompt_YesLabel',
    DOC_Prompt_NoLabel = 'DOC_Prompt_NoLabel',
    DOC_Rating_Question = 'DOC_Rating_Question',
    DOC_Rating_Values_1 = 'DOC_Rating_Values_1',
    DOC_Rating_Values_2 = 'DOC_Rating_Values_2',
    DOC_Rating_Values_3 = 'DOC_Rating_Values_3',
    DOC_Rating_Values_4 = 'DOC_Rating_Values_4',
    DOC_Rating_Values_5 = 'DOC_Rating_Values_5',
    DOC_Question_Question = 'DOC_Question_Question',
    TRA_Prompt_Title = 'TRA_Prompt_Title',
    TRA_Prompt_Question = 'TRA_Prompt_Question',
    TRA_Prompt_YesLabel = 'TRA_Prompt_YesLabel',
    TRA_Prompt_NoLabel = 'TRA_Prompt_NoLabel',
    TRA_Rating_Question = 'TRA_Rating_Question',
    TRA_Question_Question = 'TRA_Question_Question',
    TRA_Rating_Values_1 = 'TRA_Rating_Values_1',
    TRA_Rating_Values_2 = 'TRA_Rating_Values_2',
    TRA_Rating_Values_3 = 'TRA_Rating_Values_3',
    TRA_Rating_Values_4 = 'TRA_Rating_Values_4',
    TRA_Rating_Values_5 = 'TRA_Rating_Values_5',
    LINK_Prompt_Title = 'LINK_Prompt_Title',
    LINK_Prompt_Question = 'LINK_Prompt_Question',
    LINK_Prompt_YesLabel = 'LINK_Prompt_YesLabel',
    LINK_Prompt_NoLabel = 'LINK_Prompt_NoLabel',
    LINK_Rating_Question = 'LINK_Rating_Question',
    LINK_Rating_Values_1 = 'LINK_Rating_Values_1',
    LINK_Rating_Values_2 = 'LINK_Rating_Values_2',
    LINK_Rating_Values_3 = 'LINK_Rating_Values_3',
    LINK_Rating_Values_4 = 'LINK_Rating_Values_4',
    LINK_Rating_Values_5 = 'LINK_Rating_Values_5',
    LINK_Question_Question = 'LINK_Question_Question',
    NOTES_Prompt_Title = 'NOTES_Prompt_Title',
    NOTES_Prompt_Question = 'NOTES_Prompt_Question',
    NOTES_Prompt_YesLabel = 'NOTES_Prompt_YesLabel',
    NOTES_Prompt_NoLabel = 'NOTES_Prompt_NoLabel',
    NOTES_Rating_Question = 'NOTES_Rating_Question',
    NOTES_Rating_Values_1 = 'NOTES_Rating_Values_1',
    NOTES_Rating_Values_2 = 'NOTES_Rating_Values_2',
    NOTES_Rating_Values_3 = 'NOTES_Rating_Values_3',
    NOTES_Rating_Values_4 = 'NOTES_Rating_Values_4',
    NOTES_Rating_Values_5 = 'NOTES_Rating_Values_5',
    NOTES_Question_Question = 'NOTES_Question_Question',
    PAUSE_INBOX_Prompt_Title = 'PAUSE_INBOX_Prompt_Title',
    PAUSE_INBOX_Prompt_Question = 'PAUSE_INBOX_Prompt_Question',
    PAUSE_INBOX_Prompt_YesLabel = 'PAUSE_INBOX_Prompt_YesLabel',
    PAUSE_INBOX_Prompt_NoLabel = 'PAUSE_INBOX_Prompt_NoLabel',
    PAUSE_INBOX_Rating_Question = 'PAUSE_INBOX_Rating_Question',
    PAUSE_INBOX_Rating_Values_1 = 'PAUSE_INBOX_Rating_Values_1',
    PAUSE_INBOX_Rating_Values_2 = 'PAUSE_INBOX_Rating_Values_2',
    PAUSE_INBOX_Rating_Values_3 = 'PAUSE_INBOX_Rating_Values_3',
    PAUSE_INBOX_Rating_Values_4 = 'PAUSE_INBOX_Rating_Values_4',
    PAUSE_INBOX_Rating_Values_5 = 'PAUSE_INBOX_Rating_Values_5',
    PAUSE_INBOX_Question_Question = 'PAUSE_INBOX_Question_Question',
    CONSUMER_GROUPS_Prompt_Title = 'CONSUMER_GROUPS_Prompt_Title',
    CONSUMER_GROUPS_Prompt_Question = 'CONSUMER_GROUPS_Prompt_Question',
    CONSUMER_GROUPS_Prompt_YesLabel = 'CONSUMER_GROUPS_Prompt_YesLabel',
    CONSUMER_GROUPS_Prompt_NoLabel = 'CONSUMER_GROUPS_Prompt_NoLabel',
    CONSUMER_GROUPS_Rating_Question = 'CONSUMER_GROUPS_Rating_Question',
    CONSUMER_GROUPS_Rating_Values_1 = 'CONSUMER_GROUPS_Rating_Values_1',
    CONSUMER_GROUPS_Rating_Values_2 = 'CONSUMER_GROUPS_Rating_Values_2',
    CONSUMER_GROUPS_Rating_Values_3 = 'CONSUMER_GROUPS_Rating_Values_3',
    CONSUMER_GROUPS_Rating_Values_4 = 'CONSUMER_GROUPS_Rating_Values_4',
    CONSUMER_GROUPS_Rating_Values_5 = 'CONSUMER_GROUPS_Rating_Values_5',
    CONSUMER_GROUPS_Question_Question = 'CONSUMER_GROUPS_Question_Question',
    PROOFING_Prompt_Title = 'PROOFING_Prompt_Title',
    PROOFING_Prompt_Question = 'PROOFING_Prompt_Question',
    PROOFING_Question_Question = 'PROOFING_Question_Question',
    PROOFING_Rating_Question = 'PROOFING_GROUPS_Rating_Question',
    PROOFING_Rating_Values_1 = 'PROOFING_GROUPS_Rating_Values_1',
    PROOFING_Rating_Values_2 = 'PROOFING_GROUPS_Rating_Values_2',
    PROOFING_Rating_Values_3 = 'PROOFING_GROUPS_Rating_Values_3',
    PROOFING_Rating_Values_4 = 'PROOFING_GROUPS_Rating_Values_4',
    PROOFING_Rating_Values_5 = 'PROOFING_GROUPS_Rating_Values_5',
    ONENOTE_FEED_Prompt_Title = 'ONENOTE_FEED_Prompt_Title',
    ONENOTE_FEED_Prompt_Question = 'ONENOTE_FEED_Prompt_Question',
    ONENOTE_FEED_Prompt_YesLabel = 'NOTES_Prompt_YesLabel',
    ONENOTE_FEED_Prompt_NoLabel = 'ONENOTE_FEED_Prompt_NoLabel',
    ONENOTE_FEED_Rating_Question = 'ONENOTE_FEED_Rating_Question',
    ONENOTE_FEED_Rating_Values_1 = 'ONENOTE_FEED_Rating_Values_1',
    ONENOTE_FEED_Rating_Values_2 = 'ONENOTE_FEED_Rating_Values_2',
    ONENOTE_FEED_Rating_Values_3 = 'ONENOTE_FEED_Rating_Values_3',
    ONENOTE_FEED_Rating_Values_4 = 'ONENOTE_FEED_Rating_Values_4',
    ONENOTE_FEED_Rating_Values_5 = 'ONENOTE_FEED_Rating_Values_5',
    ONENOTE_FEED_Question_Question = 'ONENOTE_FEED_Question_Question',
    NLQS_Prompt_Title = 'NLQS_Prompt_Title',
    NLQS_Prompt_Question = 'NLQS_Prompt_Question',
    NLQS_Prompt_YesLabel = 'NLQS_Prompt_YesLabel',
    NLQS_Prompt_NoLabel = 'NLQS_Prompt_NoLabel',
    NLQS_Rating_Question = 'NLQS_Rating_Question',
    NLQS_Rating_Values_1 = 'NLQS_Rating_Values_1',
    NLQS_Rating_Values_2 = 'NLQS_Rating_Values_2',
    NLQS_Rating_Values_3 = 'NLQS_Rating_Values_3',
    NLQS_Rating_Values_4 = 'NLQS_Rating_Values_4',
    NLQS_Rating_Values_5 = 'NLQS_Rating_Values_5',
    NLQS_Question_Question = 'NLQS_Question_Question',
}

export const SurveyStringMap: { [stringPlaceHolder: string]: () => string } = {
    [StringsPlaceHolders.SEA_Prompt_Title]: () => loc(promptTitle),
    [StringsPlaceHolders.SEA_Prompt_Question]: () => loc(promptDescription),
    [StringsPlaceHolders.SEA_Prompt_YesLabel]: () => loc(promptYesLabel),
    [StringsPlaceHolders.SEA_Prompt_NoLabel]: () => loc(promptNoLabel),
    [StringsPlaceHolders.SEA_Rating_Question]: () => ' ', // We cannot omit this property (or pass empty string).
    [StringsPlaceHolders.SEA_Rating_Values_1]: () => loc(ratingTitle1),
    [StringsPlaceHolders.SEA_Rating_Values_2]: () => loc(ratingTitle2),
    [StringsPlaceHolders.SEA_Rating_Values_3]: () => loc(ratingTitle3),
    [StringsPlaceHolders.SEA_Rating_Values_4]: () => loc(ratingTitle4),
    [StringsPlaceHolders.SEA_Rating_Values_5]: () => loc(ratingTitle5),
    [StringsPlaceHolders.SEA_Question_Question]: () => loc(moreInfoText),
    [StringsPlaceHolders.CAL_Prompt_Title]: () => loc(calendarSurveyPromptTitle),
    [StringsPlaceHolders.CAL_Prompt_Question]: () => loc(promptDescription),
    [StringsPlaceHolders.CAL_Prompt_YesLabel]: () => loc(promptYesLabel),
    [StringsPlaceHolders.CAL_Prompt_NoLabel]: () => loc(promptNoLabel),
    [StringsPlaceHolders.CAL_Rating_Question]: () => ' ', // We cannot omit this property (or pass empty string).
    [StringsPlaceHolders.CAL_Rating_Values_1]: () => loc(ratingTitle1),
    [StringsPlaceHolders.CAL_Rating_Values_2]: () => loc(ratingTitle2),
    [StringsPlaceHolders.CAL_Rating_Values_3]: () => loc(ratingTitle3),
    [StringsPlaceHolders.CAL_Rating_Values_4]: () => loc(ratingTitle4),
    [StringsPlaceHolders.CAL_Rating_Values_5]: () => loc(ratingTitle5),
    [StringsPlaceHolders.CAL_Question_Question]: () => loc(moreInfoText),
    [StringsPlaceHolders.DOC_Prompt_Title]: () => loc(documentPreviewSurveyPromptTitle),
    [StringsPlaceHolders.DOC_Prompt_Question]: () => loc(promptDescription),
    [StringsPlaceHolders.DOC_Prompt_YesLabel]: () => loc(promptYesLabel),
    [StringsPlaceHolders.DOC_Prompt_NoLabel]: () => loc(promptNoLabel),
    [StringsPlaceHolders.DOC_Rating_Question]: () => loc(documentPreviewSurveyRatingQuestion),
    [StringsPlaceHolders.DOC_Rating_Values_1]: () => loc(ratingTitle1),
    [StringsPlaceHolders.DOC_Rating_Values_2]: () => loc(ratingTitle2),
    [StringsPlaceHolders.DOC_Rating_Values_3]: () => loc(ratingTitle3),
    [StringsPlaceHolders.DOC_Rating_Values_4]: () => loc(ratingTitle4),
    [StringsPlaceHolders.DOC_Rating_Values_5]: () => loc(ratingTitle5),
    [StringsPlaceHolders.DOC_Question_Question]: () => loc(moreInfoText),
    [StringsPlaceHolders.TRA_Prompt_Title]: () => loc(translatorSurveyPromptTitle),
    [StringsPlaceHolders.TRA_Prompt_Question]: () =>
        loc(translatorSurveyPromptSecondLineTwoQuestions),
    [StringsPlaceHolders.TRA_Prompt_YesLabel]: () => loc(translatorPromptYesLabel),
    [StringsPlaceHolders.TRA_Prompt_NoLabel]: () => loc(translatorPromptNoLabel),
    [StringsPlaceHolders.TRA_Rating_Question]: () => loc(translatorSurveyRatingQuestion),
    [StringsPlaceHolders.TRA_Question_Question]: () => loc(translatorDialogSurveyCommentQuestion),
    [StringsPlaceHolders.TRA_Rating_Values_1]: () => loc(ratingTitleWithNumber1),
    [StringsPlaceHolders.TRA_Rating_Values_2]: () => '2',
    [StringsPlaceHolders.TRA_Rating_Values_3]: () => '3',
    [StringsPlaceHolders.TRA_Rating_Values_4]: () => '4',
    [StringsPlaceHolders.TRA_Rating_Values_5]: () => loc(ratingTitleWithNumber5),
    [StringsPlaceHolders.LINK_Prompt_Title]: () => loc(linkPreviewSurveyPromptTitle),
    [StringsPlaceHolders.LINK_Prompt_Question]: () => loc(promptDescription),
    [StringsPlaceHolders.LINK_Prompt_YesLabel]: () => loc(promptYesLabel),
    [StringsPlaceHolders.LINK_Prompt_NoLabel]: () => loc(promptNoLabel),
    [StringsPlaceHolders.LINK_Rating_Question]: () => loc(linkPreviewSurveyRatingQuestion),
    [StringsPlaceHolders.LINK_Rating_Values_1]: () => loc(ratingTitle1),
    [StringsPlaceHolders.LINK_Rating_Values_2]: () => loc(ratingTitle2),
    [StringsPlaceHolders.LINK_Rating_Values_3]: () => loc(ratingTitle3),
    [StringsPlaceHolders.LINK_Rating_Values_4]: () => loc(ratingTitle4),
    [StringsPlaceHolders.LINK_Rating_Values_5]: () => loc(ratingTitle5),
    [StringsPlaceHolders.LINK_Question_Question]: () => loc(moreInfoText),
    [StringsPlaceHolders.NOTES_Prompt_Title]: () => loc(notesSurveyPromptTitle),
    [StringsPlaceHolders.NOTES_Prompt_Question]: () => loc(promptDescription),
    [StringsPlaceHolders.NOTES_Prompt_YesLabel]: () => loc(promptYesLabel),
    [StringsPlaceHolders.NOTES_Prompt_NoLabel]: () => loc(promptNoLabel),
    [StringsPlaceHolders.NOTES_Rating_Question]: () => loc(notesSurveyRatingQuestion),
    [StringsPlaceHolders.NOTES_Rating_Values_1]: () => loc(ratingTitleWithNumber1),
    [StringsPlaceHolders.NOTES_Rating_Values_2]: () => '2',
    [StringsPlaceHolders.NOTES_Rating_Values_3]: () => '3',
    [StringsPlaceHolders.NOTES_Rating_Values_4]: () => '4',
    [StringsPlaceHolders.NOTES_Rating_Values_5]: () => loc(ratingTitleWithNumber5),
    [StringsPlaceHolders.NOTES_Question_Question]: () => loc(moreInfoText),
    [StringsPlaceHolders.PAUSE_INBOX_Prompt_Title]: () => loc(pauseInboxSurveyPromptTitle),
    [StringsPlaceHolders.PAUSE_INBOX_Prompt_Question]: () => loc(promptSecondLineQuestion2),
    [StringsPlaceHolders.PAUSE_INBOX_Prompt_YesLabel]: () => loc(promptYesLabel),
    [StringsPlaceHolders.PAUSE_INBOX_Prompt_NoLabel]: () => loc(promptNoLabel),
    [StringsPlaceHolders.PAUSE_INBOX_Rating_Question]: () => loc(pauseInboxSurveyRatingQuestion),
    [StringsPlaceHolders.PAUSE_INBOX_Rating_Values_1]: () => loc(ratingTitleWithNumber1),
    [StringsPlaceHolders.PAUSE_INBOX_Rating_Values_2]: () => '2',
    [StringsPlaceHolders.PAUSE_INBOX_Rating_Values_3]: () => '3',
    [StringsPlaceHolders.PAUSE_INBOX_Rating_Values_4]: () => '4',
    [StringsPlaceHolders.PAUSE_INBOX_Rating_Values_5]: () => loc(ratingTitleWithNumber5),
    [StringsPlaceHolders.PAUSE_INBOX_Question_Question]: () => loc(moreInfoText),
    [StringsPlaceHolders.CONSUMER_GROUPS_Prompt_Title]: () => loc(consumerGroupsSurveyPromptTitle),
    [StringsPlaceHolders.CONSUMER_GROUPS_Prompt_Question]: () => loc(promptSecondLineQuestion2),
    [StringsPlaceHolders.CONSUMER_GROUPS_Prompt_YesLabel]: () => loc(promptYesLabel),
    [StringsPlaceHolders.CONSUMER_GROUPS_Prompt_NoLabel]: () => loc(promptNoLabel),
    [StringsPlaceHolders.CONSUMER_GROUPS_Rating_Question]: () =>
        loc(consumerGroupsSurveyRatingQuestion),
    [StringsPlaceHolders.CONSUMER_GROUPS_Rating_Values_1]: () => loc(ratingTitleWithNumber1),
    [StringsPlaceHolders.CONSUMER_GROUPS_Rating_Values_2]: () => '2',
    [StringsPlaceHolders.CONSUMER_GROUPS_Rating_Values_3]: () => '3',
    [StringsPlaceHolders.CONSUMER_GROUPS_Rating_Values_4]: () => '4',
    [StringsPlaceHolders.CONSUMER_GROUPS_Rating_Values_5]: () => loc(ratingTitleWithNumber5),
    [StringsPlaceHolders.CONSUMER_GROUPS_Question_Question]: () =>
        loc(consumerGroupsSurveyCommentQuestion),
    [StringsPlaceHolders.PROOFING_Prompt_Title]: () => loc(proofingSurveyPromptTitle),
    [StringsPlaceHolders.PROOFING_Prompt_Question]: () => ' ', // We cannot omit this property (or pass empty string).
    [StringsPlaceHolders.PROOFING_Rating_Question]: () => loc(proofingSurveyRatingQuestion),
    [StringsPlaceHolders.PROOFING_Rating_Values_1]: () => loc(ratingTitleWithNumber1),
    [StringsPlaceHolders.PROOFING_Rating_Values_2]: () => '2',
    [StringsPlaceHolders.PROOFING_Rating_Values_3]: () => '3',
    [StringsPlaceHolders.PROOFING_Rating_Values_4]: () => '4',
    [StringsPlaceHolders.PROOFING_Rating_Values_5]: () => loc(ratingTitleWithNumber5),
    [StringsPlaceHolders.PROOFING_Question_Question]: () => loc(proofingMoreInfoQuestion),
    [StringsPlaceHolders.ONENOTE_FEED_Prompt_Title]: () => loc(oneNoteFeedSurveyPromptTitle),
    [StringsPlaceHolders.ONENOTE_FEED_Prompt_Question]: () => loc(promptDescription),
    [StringsPlaceHolders.ONENOTE_FEED_Prompt_YesLabel]: () => loc(promptYesLabel),
    [StringsPlaceHolders.ONENOTE_FEED_Prompt_NoLabel]: () => loc(promptNoLabel),
    [StringsPlaceHolders.ONENOTE_FEED_Rating_Question]: () => loc(oneNoteFeedSurveyRatingQuestion),
    [StringsPlaceHolders.ONENOTE_FEED_Rating_Values_1]: () => loc(ratingTitleWithNumber1),
    [StringsPlaceHolders.ONENOTE_FEED_Rating_Values_2]: () => '2',
    [StringsPlaceHolders.ONENOTE_FEED_Rating_Values_3]: () => '3',
    [StringsPlaceHolders.ONENOTE_FEED_Rating_Values_4]: () => '4',
    [StringsPlaceHolders.ONENOTE_FEED_Rating_Values_5]: () => loc(ratingTitleWithNumber5),
    [StringsPlaceHolders.ONENOTE_FEED_Question_Question]: () => loc(moreInfoText),
    [StringsPlaceHolders.NLQS_Prompt_Title]: () => loc(nlqsSurveyPromptTitle),
    [StringsPlaceHolders.NLQS_Prompt_Question]: () => loc(nlqsSurveyPromptQuestion),
    [StringsPlaceHolders.NLQS_Prompt_YesLabel]: () => loc(nlqsSurveyPromptYesLabel),
    [StringsPlaceHolders.NLQS_Prompt_NoLabel]: () => loc(nlqsSurveyPromptNoLabel),
    [StringsPlaceHolders.NLQS_Rating_Question]: () => loc(nlqsSurveyRatingQuestion),
    [StringsPlaceHolders.NLQS_Rating_Values_1]: () => loc(ratingTitle1),
    [StringsPlaceHolders.NLQS_Rating_Values_2]: () => loc(nlqsSurveyRatingValue2),
    [StringsPlaceHolders.NLQS_Rating_Values_3]: () => loc(nlqsSurveyRatingValue3),
    [StringsPlaceHolders.NLQS_Rating_Values_4]: () => loc(nlqsSurveyRatingValue4),
    [StringsPlaceHolders.NLQS_Rating_Values_5]: () => loc(ratingTitle5),
    [StringsPlaceHolders.NLQS_Question_Question]: () => loc(nlqsSurveyQuestionQuestion),
};

/**
 * For documentation and definition of the campaigns for floodgate, please see documentation at:
 * https://microsoft.sharepoint.com/teams/Office_CLE/officecustomervoice/SitePages/Office%20Feedback%20SDK%20-%20Web%20-%20Floodgate.aspx
 * https://microsoft.sharepoint.com/teams/Office_CLE/officecustomervoice/SitePages/Office%20Floodgate%20SDK.aspx
 */
export const surveryCampaignDefinitions = [
    {
        CampaignId: '2297b804-90bb-44c4-a0d4-73a8da24b81c',
        StartTimeUtc: '2018-06-01T00:00:00Z',
        EndTimeUtc: '2023-06-01T00:00:00Z',
        GovernedChannelType: 0,
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('sea-floodgateSurveySDFSampling')
                    ? 100
                    : 5,
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'SearchExecuted',
                        Count: 1,
                        IsAggregate: true,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.SEA_Prompt_Title,
                    Question: StringsPlaceHolders.SEA_Prompt_Question,
                    YesLabel: StringsPlaceHolders.SEA_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.SEA_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.SEA_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.SEA_Rating_Values_1,
                        StringsPlaceHolders.SEA_Rating_Values_2,
                        StringsPlaceHolders.SEA_Rating_Values_3,
                        StringsPlaceHolders.SEA_Rating_Values_4,
                        StringsPlaceHolders.SEA_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.SEA_Question_Question },
            },
        },
    },
    {
        CampaignId: '67e861da-9c21-4cc3-aaed-dc87c39a6e99',
        StartTimeUtc: '2018-07-01T00:00:00Z',
        EndTimeUtc: '2023-07-01T00:00:00Z',
        GovernedChannelType: 0,
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('cal-surveyCreateApptBucket') ? 100 : 0,
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'AppointmentCreated',
                        Count: 2,
                        IsAggregate: true,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.CAL_Prompt_Title,
                    Question: StringsPlaceHolders.CAL_Prompt_Question,
                    YesLabel: StringsPlaceHolders.CAL_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.CAL_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.CAL_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.CAL_Rating_Values_1,
                        StringsPlaceHolders.CAL_Rating_Values_2,
                        StringsPlaceHolders.CAL_Rating_Values_3,
                        StringsPlaceHolders.CAL_Rating_Values_4,
                        StringsPlaceHolders.CAL_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.CAL_Question_Question },
            },
        },
    },
    {
        CampaignId: '579612b7-b210-43d2-b7d6-7251f316beed',
        StartTimeUtc: '2018-07-01T00:00:00Z',
        EndTimeUtc: '2023-07-01T00:00:00Z',
        GovernedChannelType: 0,
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('cal-surveyCreateMeetBucket') ? 100 : 0,
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'MeetingCreated',
                        Count: 2,
                        IsAggregate: true,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.CAL_Prompt_Title,
                    Question: StringsPlaceHolders.CAL_Prompt_Question,
                    YesLabel: StringsPlaceHolders.CAL_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.CAL_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.CAL_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.CAL_Rating_Values_1,
                        StringsPlaceHolders.CAL_Rating_Values_2,
                        StringsPlaceHolders.CAL_Rating_Values_3,
                        StringsPlaceHolders.CAL_Rating_Values_4,
                        StringsPlaceHolders.CAL_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.CAL_Question_Question },
            },
        },
    },
    {
        CampaignId: '90c124f5-fd59-4711-9857-5892e4a76281',
        StartTimeUtc: '2018-07-01T00:00:00Z',
        EndTimeUtc: '2023-07-01T00:00:00Z',
        GovernedChannelType: 0,
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('cal-surveyUpdateApptBucket') ? 100 : 0,
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'AppointmentUpdated',
                        Count: 1,
                        IsAggregate: true,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.CAL_Prompt_Title,
                    Question: StringsPlaceHolders.CAL_Prompt_Question,
                    YesLabel: StringsPlaceHolders.CAL_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.CAL_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.CAL_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.CAL_Rating_Values_1,
                        StringsPlaceHolders.CAL_Rating_Values_2,
                        StringsPlaceHolders.CAL_Rating_Values_3,
                        StringsPlaceHolders.CAL_Rating_Values_4,
                        StringsPlaceHolders.CAL_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.CAL_Question_Question },
            },
        },
    },
    {
        CampaignId: '1d342f09-77ae-414c-8f11-790d087f9529',
        StartTimeUtc: '2018-07-01T00:00:00Z',
        EndTimeUtc: '2023-07-01T00:00:00Z',
        GovernedChannelType: 0,
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('cal-surveyUpdateMeetBucket') ? 100 : 0,
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'MeetingUpdated',
                        Count: 2,
                        IsAggregate: true,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.CAL_Prompt_Title,
                    Question: StringsPlaceHolders.CAL_Prompt_Question,
                    YesLabel: StringsPlaceHolders.CAL_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.CAL_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.CAL_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.CAL_Rating_Values_1,
                        StringsPlaceHolders.CAL_Rating_Values_2,
                        StringsPlaceHolders.CAL_Rating_Values_3,
                        StringsPlaceHolders.CAL_Rating_Values_4,
                        StringsPlaceHolders.CAL_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.CAL_Question_Question },
            },
        },
    },
    {
        CampaignId: 'dfdee7bb-9c94-43b0-85c6-edd17aa0f6ab',
        StartTimeUtc: '2018-07-01T00:00:00Z',
        EndTimeUtc: '2023-07-01T00:00:00Z',
        GovernedChannelType: 0,
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('cal-surveyCancelMeetBucket') ? 100 : 0,
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'MeetingCanceled',
                        Count: 1,
                        IsAggregate: true,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.CAL_Prompt_Title,
                    Question: StringsPlaceHolders.CAL_Prompt_Question,
                    YesLabel: StringsPlaceHolders.CAL_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.CAL_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.CAL_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.CAL_Rating_Values_1,
                        StringsPlaceHolders.CAL_Rating_Values_2,
                        StringsPlaceHolders.CAL_Rating_Values_3,
                        StringsPlaceHolders.CAL_Rating_Values_4,
                        StringsPlaceHolders.CAL_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.CAL_Question_Question },
            },
        },
    },
    {
        CampaignId: 'b173aebc-cb92-43bd-96d7-3300c35e68b7',
        StartTimeUtc: '2018-07-01T00:00:00Z',
        EndTimeUtc: '2023-07-01T00:00:00Z',
        GovernedChannelType: 0,
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('cal-surveyViewEventBucket') ? 100 : 0,
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'EventViewed',
                        Count: 2,
                        IsAggregate: true,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.CAL_Prompt_Title,
                    Question: StringsPlaceHolders.CAL_Prompt_Question,
                    YesLabel: StringsPlaceHolders.CAL_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.CAL_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.CAL_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.CAL_Rating_Values_1,
                        StringsPlaceHolders.CAL_Rating_Values_2,
                        StringsPlaceHolders.CAL_Rating_Values_3,
                        StringsPlaceHolders.CAL_Rating_Values_4,
                        StringsPlaceHolders.CAL_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.CAL_Question_Question },
            },
        },
    },
    {
        CampaignId: 'e38a3d7f-4f23-4551-8cbd-f02b0bf0d1c3',
        StartTimeUtc: '2019-01-01T00:00:00Z',
        EndTimeUtc: '2023-01-01T00:00:00Z',
        GovernedChannelType: 0,
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('sea-floodgateSurveySDFSampling')
                    ? 100
                    : 5, // Sample 100% of SDF (always left it as SDF flight) then 5% of upper rings.
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'DocumentViewed',
                        Count: 1,
                        IsAggregate: true,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.DOC_Prompt_Title,
                    Question: StringsPlaceHolders.DOC_Prompt_Question,
                    YesLabel: StringsPlaceHolders.DOC_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.DOC_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.DOC_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.DOC_Rating_Values_1,
                        StringsPlaceHolders.DOC_Rating_Values_2,
                        StringsPlaceHolders.DOC_Rating_Values_3,
                        StringsPlaceHolders.DOC_Rating_Values_4,
                        StringsPlaceHolders.DOC_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.DOC_Question_Question },
            },
        },
    },
    {
        CampaignId: 'c376b98d-aa70-4d46-b9ff-a370cea8e438',
        StartTimeUtc: '2018-06-01T00:00:00Z',
        EndTimeUtc: '2021-06-01T00:00:00Z',
        GovernedChannelType: 0,
        AdditionalDataRequested: ['EmailAddress'],
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('sea-floodgateSurveySDFSampling')
                    ? 100
                    : 10, // Sample 100% of SDF (always left it as SDF flight) then 10% of upper rings.,
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'TranslationCompleted',
                        Count: 1,
                        IsAggregate: false,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.TRA_Prompt_Title,
                    Question: StringsPlaceHolders.TRA_Prompt_Question,
                    YesLabel: StringsPlaceHolders.TRA_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.TRA_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.TRA_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.TRA_Rating_Values_1,
                        StringsPlaceHolders.TRA_Rating_Values_2,
                        StringsPlaceHolders.TRA_Rating_Values_3,
                        StringsPlaceHolders.TRA_Rating_Values_4,
                        StringsPlaceHolders.TRA_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.TRA_Question_Question },
            },
        },
    },
    {
        CampaignId: 'cfa827d8-3c47-42cd-a896-39cf2cc0c11e',
        StartTimeUtc: '2019-10-09T00:00:00Z',
        EndTimeUtc: '2023-10-09T00:00:00Z',
        GovernedChannelType: 0,
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('sea-floodgateSurveySDFSampling')
                    ? 100
                    : 5, // Sample 100% of SDF (always left it as SDF flight) then 5% of upper rings.
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'LinkViewed',
                        Count: 1,
                        IsAggregate: true,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.LINK_Prompt_Title,
                    Question: StringsPlaceHolders.LINK_Prompt_Question,
                    YesLabel: StringsPlaceHolders.LINK_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.LINK_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.LINK_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.LINK_Rating_Values_1,
                        StringsPlaceHolders.LINK_Rating_Values_2,
                        StringsPlaceHolders.LINK_Rating_Values_3,
                        StringsPlaceHolders.LINK_Rating_Values_4,
                        StringsPlaceHolders.LINK_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.LINK_Question_Question },
            },
        },
    },
    {
        CampaignId: 'a083e8e1-f15f-4aa0-98ef-cd36c14f6e20',
        StartTimeUtc: '2019-11-07T00:00:00Z',
        EndTimeUtc: '2023-11-07T00:00:00Z',
        GovernedChannelType: 0,
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('notes-folder-view') ? 100 : 0, // Sample 100% of users with notes folder view enabled.
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'NoteCreatedOrUpdated',
                        Count: 1,
                        IsAggregate: true,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.NOTES_Prompt_Title,
                    Question: StringsPlaceHolders.NOTES_Prompt_Question,
                    YesLabel: StringsPlaceHolders.NOTES_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.NOTES_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.NOTES_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.NOTES_Rating_Values_1,
                        StringsPlaceHolders.NOTES_Rating_Values_2,
                        StringsPlaceHolders.NOTES_Rating_Values_3,
                        StringsPlaceHolders.NOTES_Rating_Values_4,
                        StringsPlaceHolders.NOTES_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.NOTES_Question_Question },
            },
        },
    },
    {
        CampaignId: 'd577841e-f137-43b3-9a5c-bd55c93715bb',
        StartTimeUtc: '2019-12-13T00:00:00Z',
        EndTimeUtc: '2023-12-18T00:00:00Z',
        GovernedChannelType: 0,
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('tri-pauseInbox') ? 100 : 0, // Sample 100% of users with pause inbox enabled
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'InboxUnpausedFromPaused',
                        Count: 1,
                        IsAggregate: true,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.PAUSE_INBOX_Prompt_Title,
                    Question: StringsPlaceHolders.PAUSE_INBOX_Prompt_Question,
                    YesLabel: StringsPlaceHolders.PAUSE_INBOX_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.PAUSE_INBOX_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.PAUSE_INBOX_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.PAUSE_INBOX_Rating_Values_1,
                        StringsPlaceHolders.PAUSE_INBOX_Rating_Values_2,
                        StringsPlaceHolders.PAUSE_INBOX_Rating_Values_3,
                        StringsPlaceHolders.PAUSE_INBOX_Rating_Values_4,
                        StringsPlaceHolders.PAUSE_INBOX_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.PAUSE_INBOX_Question_Question },
            },
        },
    },
    {
        CampaignId: '94b508a2-9008-4a6c-9a84-4c147444bdd8',
        StartTimeUtc: '2020-04-01T00:00:00Z',
        EndTimeUtc: '2023-04-01T00:00:00Z',
        GovernedChannelType: 0,
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('tri-floodgateForConsumerGroups')
                    ? 100
                    : 0,
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'ConsumerGroupsClicked',
                        Count: 3,
                        IsAggregate: true,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.CONSUMER_GROUPS_Prompt_Title,
                    Question: StringsPlaceHolders.CONSUMER_GROUPS_Prompt_Question,
                    YesLabel: StringsPlaceHolders.CONSUMER_GROUPS_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.CONSUMER_GROUPS_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.CONSUMER_GROUPS_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.CONSUMER_GROUPS_Rating_Values_1,
                        StringsPlaceHolders.CONSUMER_GROUPS_Rating_Values_2,
                        StringsPlaceHolders.CONSUMER_GROUPS_Rating_Values_3,
                        StringsPlaceHolders.CONSUMER_GROUPS_Rating_Values_4,
                        StringsPlaceHolders.CONSUMER_GROUPS_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.CONSUMER_GROUPS_Question_Question },
            },
        },
    },
    {
        CampaignId: '49bbf72d-4283-471b-af23-9a47bc4b7e4f',
        StartTimeUtc: '2020-06-23T00:00:00Z',
        EndTimeUtc: '2023-06-23T00:00:00Z',
        GovernedChannelType: 0,
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('mc-officeEditorFloodgateSurvey')
                    ? 100
                    : 0,

            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 94608000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 94608000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'ProofingRefinementClicked',
                        Count: 5,
                        IsAggregate: true,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.PROOFING_Prompt_Title,
                    Question: StringsPlaceHolders.PROOFING_Prompt_Question,
                    YesLabel: StringsPlaceHolders.DOC_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.DOC_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.PROOFING_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.PROOFING_Rating_Values_1,
                        StringsPlaceHolders.PROOFING_Rating_Values_2,
                        StringsPlaceHolders.PROOFING_Rating_Values_3,
                        StringsPlaceHolders.PROOFING_Rating_Values_4,
                        StringsPlaceHolders.PROOFING_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.PROOFING_Question_Question },
            },
        },
    },
    {
        // Non-Samsung note users
        CampaignId: '057bd571-0079-4037-9f39-3ea33030f07f',
        StartTimeUtc: '2020-10-20T00:00:00Z',
        EndTimeUtc: '2023-10-20T00:00:00Z',
        GovernedChannelType: 0,
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('notes-noteFeedSidePanel') ? 100 : 0, // Sample 100% of users with OneNote feed enabled.
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'OneNoteFeedStickyNoteViewed',
                        Count: 1,
                        IsAggregate: true,
                    },
                    {
                        Type: 0,
                        Activity: 'OneNoteFeedStickyNoteEdited',
                        Count: 1,
                        IsAggregate: true,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.ONENOTE_FEED_Prompt_Title,
                    Question: StringsPlaceHolders.ONENOTE_FEED_Prompt_Question,
                    YesLabel: StringsPlaceHolders.ONENOTE_FEED_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.ONENOTE_FEED_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.ONENOTE_FEED_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.ONENOTE_FEED_Rating_Values_1,
                        StringsPlaceHolders.ONENOTE_FEED_Rating_Values_2,
                        StringsPlaceHolders.ONENOTE_FEED_Rating_Values_3,
                        StringsPlaceHolders.ONENOTE_FEED_Rating_Values_4,
                        StringsPlaceHolders.ONENOTE_FEED_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.ONENOTE_FEED_Question_Question },
            },
        },
    },
    {
        // Samsung note users
        CampaignId: '045a163d-d48b-49f9-a59d-56f40d4419a8',
        StartTimeUtc: '2020-11-20T00:00:00Z',
        EndTimeUtc: '2023-11-20T00:00:00Z',
        GovernedChannelType: 0,
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('notes-noteFeedSidePanel') ? 100 : 0, // Sample 100% of users with OneNote feed enabled.
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
        },
        SurveyTemplate: {
            Type: 2, // FPS
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'SamsungNotesSynced',
                        Count: 1,
                        IsAggregate: true,
                    },
                    {
                        Type: 0,
                        Activity: 'OneNoteFeedConnectedNoteViewed',
                        Count: 1,
                        IsAggregate: true,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.ONENOTE_FEED_Prompt_Title,
                    Question: StringsPlaceHolders.ONENOTE_FEED_Prompt_Question,
                    YesLabel: StringsPlaceHolders.ONENOTE_FEED_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.ONENOTE_FEED_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.ONENOTE_FEED_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.ONENOTE_FEED_Rating_Values_1,
                        StringsPlaceHolders.ONENOTE_FEED_Rating_Values_2,
                        StringsPlaceHolders.ONENOTE_FEED_Rating_Values_3,
                        StringsPlaceHolders.ONENOTE_FEED_Rating_Values_4,
                        StringsPlaceHolders.ONENOTE_FEED_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.ONENOTE_FEED_Question_Question },
            },
        },
    },
    {
        CampaignId: '240bd454-983d-44a1-b6af-986361983735',
        StartTimeUtc: '2020-12-10T00:00:00Z',
        EndTimeUtc: '2023-06-23T00:00:00Z',
        GovernedChannelType: 0,
        Scope: {
            Languages: [
                { Type: 0, Value: 'en-GB' },
                { Type: 0, Value: 'es-ES' },
                { Type: 0, Value: 'es-MX' },
                { Type: 0, Value: 'fr-FR' },
                { Type: 0, Value: 'nl-NL' },
                { Type: 0, Value: 'pt-BR' },
                { Type: 0, Value: 'tr-TR' },
            ],
            Type: 1,
        },
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('sea-floodgateSurveySDFSampling')
                    ? 100
                    : 1, // Sample 100% of SDF (always left it as SDF flight) then 10% of upper rings.
            PercentageDenominator: 100,
            NominationPeriod: {
                Type: 0,
                IntervalSeconds: 2592000,
            },
            CooldownPeriod: {
                Type: 0,
                IntervalSeconds: 7776000,
            },
            FallbackSurveyDurationSeconds: 120,
        },
        SurveyTemplate: {
            Type: 3,
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'AppUsageTime',
                        IsAggregate: true,
                        Count: 300,
                    },
                    {
                        Type: 0,
                        Activity: 'AppResume',
                        IsAggregate: false,
                        Count: 1,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.NLQS_Prompt_Title,
                    Question: StringsPlaceHolders.NLQS_Prompt_Question,
                    YesLabel: StringsPlaceHolders.NLQS_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.NLQS_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.NLQS_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.NLQS_Rating_Values_1,
                        StringsPlaceHolders.NLQS_Rating_Values_2,
                        StringsPlaceHolders.NLQS_Rating_Values_3,
                        StringsPlaceHolders.NLQS_Rating_Values_4,
                        StringsPlaceHolders.NLQS_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.NLQS_Question_Question },
            },
        },
    },
    {
        CampaignId: '240bd454-983d-44a1-b6af-986361983735',
        StartTimeUtc: '2020-12-10T00:00:00Z',
        EndTimeUtc: '2023-06-23T00:00:00Z',
        GovernedChannelType: 0,
        Scope: {
            Languages: [
                { Type: 0, Value: 'ar-SA' },
                { Type: 0, Value: 'da-DK' },
                { Type: 0, Value: 'de-DE' },
                { Type: 0, Value: 'el-GR' },
                { Type: 0, Value: 'fi-FL' },
                { Type: 0, Value: 'it-IT' },
                { Type: 0, Value: 'ja-JP' },
                { Type: 0, Value: 'nb-NO' },
                { Type: 0, Value: 'pl-PL' },
                { Type: 0, Value: 'pt-PT' },
                { Type: 0, Value: 'ru-RU' },
                { Type: 0, Value: 'sv-SE' },
                { Type: 0, Value: 'th-TH' },
                { Type: 0, Value: 'zh-CN' },
                { Type: 0, Value: 'zh-TW' },
            ],
            Type: 1,
        },
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('sea-floodgateSurveySDFSampling')
                    ? 100
                    : 10, // Sample 100% of SDF (always left it as SDF flight) then 10% of upper rings.
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 2592000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 7776000 },
            FallbackSurveyDurationSeconds: 120,
        },
        SurveyTemplate: {
            Type: 3,
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'AppUsageTime',
                        Count: 300,
                        IsAggregate: true,
                    },
                    {
                        Type: 0,
                        Activity: 'AppResume',
                        Count: 1,
                        IsAggregate: false,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.NLQS_Prompt_Title,
                    Question: StringsPlaceHolders.NLQS_Prompt_Question,
                    YesLabel: StringsPlaceHolders.NLQS_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.NLQS_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.NLQS_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.NLQS_Rating_Values_1,
                        StringsPlaceHolders.NLQS_Rating_Values_2,
                        StringsPlaceHolders.NLQS_Rating_Values_3,
                        StringsPlaceHolders.NLQS_Rating_Values_4,
                        StringsPlaceHolders.NLQS_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.NLQS_Question_Question },
            },
        },
    },
    {
        CampaignId: '240bd454-983d-44a1-b6af-986361983735',
        StartTimeUtc: '2020-12-10T00:00:00Z',
        EndTimeUtc: '2023-06-23T00:00:00Z',
        GovernedChannelType: 0,
        Scope: {
            Languages: [
                { Type: 0, Value: 'af-ZA' },
                { Type: 0, Value: 'am-ET' },
                { Type: 0, Value: 'as-IN' },
                { Type: 0, Value: 'az-Latn-AZ' },
                { Type: 0, Value: 'bg-BG' },
                { Type: 0, Value: 'bn-IN' },
                { Type: 0, Value: 'ca-ES' },
                { Type: 0, Value: 'fr-CA' },
                { Type: 0, Value: 'cs-CZ' },
                { Type: 0, Value: 'cy-GB' },
                { Type: 0, Value: 'et-EE' },
                { Type: 0, Value: 'fa-IR' },
                { Type: 0, Value: 'ga-IE' },
                { Type: 0, Value: 'gb-GB' },
                { Type: 0, Value: 'gl-ES' },
                { Type: 0, Value: 'gu-IN' },
                { Type: 0, Value: 'he-IL' },
                { Type: 0, Value: 'hi-IN' },
                { Type: 0, Value: 'hr-HR' },
                { Type: 0, Value: 'hy-AM' },
                { Type: 0, Value: 'id-ID' },
                { Type: 0, Value: 'is-IS' },
                { Type: 0, Value: 'ka-GE' },
                { Type: 0, Value: 'kk-KZ' },
                { Type: 0, Value: 'ko-KR' },
                { Type: 0, Value: 'lb-LU' },
                { Type: 0, Value: 'lt-LT' },
                { Type: 0, Value: 'lv-LV' },
                { Type: 0, Value: 'mk-MK' },
                { Type: 0, Value: 'ml-IN' },
                { Type: 0, Value: 'mr-IN' },
                { Type: 0, Value: 'mt-MT' },
                { Type: 0, Value: 'ne-NP' },
                { Type: 0, Value: 'nn-NO' },
                { Type: 0, Value: 'or-IN' },
                { Type: 0, Value: 'pa-IN' },
                { Type: 0, Value: 'ro-RO' },
                { Type: 0, Value: 'sk-SK' },
                { Type: 0, Value: 'sl-SL' },
                { Type: 0, Value: 'sq-AL' },
                { Type: 0, Value: 'sr-Cyrl-BA' },
                { Type: 0, Value: 'sr-Latn-CS' },
                { Type: 0, Value: 'ta-IN' },
                { Type: 0, Value: 'te-IN' },
                { Type: 0, Value: 'ug-CN' },
                { Type: 0, Value: 'uk-UA' },
                { Type: 0, Value: 'ur-PK' },
                { Type: 0, Value: 'uz-Latn-UZ' },
                { Type: 0, Value: 'vi-VN' },
            ],
            Type: 1,
        },
        NominationScheme: {
            Type: 0,
            PercentageNumerator:
                isGulpOrBranchingValue || isFeatureEnabled('sea-floodgateSurveySDFSampling')
                    ? 100
                    : 50, // Sample 100% of SDF (always left it as SDF flight) then 50% of upper rings.
            PercentageDenominator: 100,
            NominationPeriod: { Type: 0, IntervalSeconds: 5184000 },
            CooldownPeriod: { Type: 0, IntervalSeconds: 15552000 },
            FallbackSurveyDurationSeconds: 120,
        },
        SurveyTemplate: {
            Type: 3,
            ActivationEvent: {
                Type: 1,
                Sequence: [
                    {
                        Type: 0,
                        Activity: 'AppUsageTime',
                        IsAggregate: true,
                        Count: 300,
                    },
                    {
                        Type: 0,
                        Activity: 'AppResume',
                        IsAggregate: false,
                        Count: 1,
                    },
                ],
            },
            Content: {
                Prompt: {
                    Title: StringsPlaceHolders.NLQS_Prompt_Title,
                    Question: StringsPlaceHolders.NLQS_Prompt_Question,
                    YesLabel: StringsPlaceHolders.NLQS_Prompt_YesLabel,
                    NoLabel: StringsPlaceHolders.NLQS_Prompt_NoLabel,
                },
                Rating: {
                    Question: StringsPlaceHolders.NLQS_Rating_Question,
                    RatingValuesAscending: [
                        StringsPlaceHolders.NLQS_Rating_Values_1,
                        StringsPlaceHolders.NLQS_Rating_Values_2,
                        StringsPlaceHolders.NLQS_Rating_Values_3,
                        StringsPlaceHolders.NLQS_Rating_Values_4,
                        StringsPlaceHolders.NLQS_Rating_Values_5,
                    ],
                },
                Question: { Question: StringsPlaceHolders.NLQS_Question_Question },
            },
        },
    },
];
