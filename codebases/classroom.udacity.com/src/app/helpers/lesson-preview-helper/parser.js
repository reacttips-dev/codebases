import {
    Document
} from './classes';
import {
    getTableHeading
} from './utils';
import {
    getTableType
} from './utils';
import {
    getTableUUID
} from './utils';
import {
    struct
} from './utils';

const SUPPORTED_VERSIONS = [7, 8, 9];

/**
 * Verifies that every Concept has a heading.
 * @param {Document} doc
 */
function validateConceptHeadingsExist(doc) {
    var numErrors = 0;

    doc
        .getTables()
        .filter(tableIsConcept)
        .forEach(function(table) {
            const name = getTableHeading(table);

            if (name.length <= 1) {
                numErrors += 1;
            }
        });

    if (numErrors > 0) {
        throw new Error(
            numErrors +
            (numErrors === 1 ?
                ' Concept needs a title. Fix the Concept table that has a red background.' :
                ' Concepts need titles. Fix the Concept tables that have a red background.')
        );
    }
}

/**
 * Verifies that Concept headings are unique.
 */
function validateConceptHeadingsAreUnique(doc) {
    var numErrors = 0;

    const conceptTables = doc.getTables().filter(tableIsConcept);

    conceptTables.reduce(function(accumulator, conceptTable) {
        var conceptTitle = getTableHeading(conceptTable);

        if (!accumulator[conceptTitle]) {
            accumulator[conceptTitle] = 1;
        } else {
            accumulator[conceptTitle] += 1;
            numErrors += 1;
        }

        return accumulator;
    }, {});

    if (numErrors > 0) {
        throw new Error(
            'Non-unique Concept heading found! ' +
            numErrors +
            (numErrors === 1 ?
                ' Concept has a duplicate name. Rename the Concept table that has a red background.' :
                ' Concepts have duplicate names. Rename the Concept tables that have a red background.')
        );
    }
}

/**
 * Creates the object structure for a lesson.
 * @param {Document} doc
 * @returns {Object} An object representation of a lesson.
 */
function buildLessonObject(lessonTable) {
    const {
        uuid,
        title,
        summary,
        duration
    } = extractLessonFields(lessonTable);

    return {
        key: uuid,
        locale: 'en-us',
        version: '1.0.0',
        title: title,
        semantic_type: 'Lesson',
        __typename: '',
        is_public: true,
        image: null,
        video: null,
        lab: null,
        project: null,
        summary: summary,
        duration: duration,
        is_project_lesson: false,
    };
}

/**
 * Creates the object structure for a Concept.
 *
 * @param {string} name The name of a Concept.
 * @returns {Object} An object representation of a Concept.
 */
function buildConceptObject(conceptTable, lessonMajorVersion) {
    const {
        uuid,
        title
    } = extractConceptFields(
        conceptTable,
        lessonMajorVersion
    );

    return {
        key: uuid,
        locale: 'en-us',
        version: '1.0.0',
        title: title,
        semantic_type: 'Concept',
        __typename: '',
        is_public: true,
        resources: null,
    };
}

/**
 * Creates the object structure for an Atom.
 *
 * @param {string} type The Atom's type field.
 * @param {Table} atomTable The Atom table.
 * @params {integer} lessonMajorVersion the lesson doc major version (7 and 8 are supported)
 * @returns {Object} An object representation of an Atom.
 */
function buildAtomObject(type, atomTable, lessonMajorVersion) {
    const title = getTableHeading(atomTable);

    if (type === 'VideoAtom') {
        return buildAtomObjectVideo(title, atomTable, lessonMajorVersion);
    } else if (type === 'ImageAtom') {
        return buildAtomObjectImage(title, atomTable, lessonMajorVersion);
    } else if (type === 'TextAtom') {
        return buildAtomObjectText(title, atomTable, lessonMajorVersion);
    } else if (type === 'CheckboxQuizAtom') {
        return buildAtomObjectQuizCheckbox(title, atomTable, lessonMajorVersion);
    } else if (type === 'RadioQuizAtom') {
        return buildAtomObjectQuizRadio(title, atomTable, lessonMajorVersion);
    } else if (type === 'TaskListAtom') {
        return buildAtomObjectQuizTaskList(title, atomTable, lessonMajorVersion);
    } else if (type === 'ReflectAtom') {
        return buildAtomObjectQuizReflect(title, atomTable, lessonMajorVersion);
    } else if (type === 'ValidatedQuizAtom') {
        return buildAtomObjectQuizRegex(title, atomTable, lessonMajorVersion);
    } else if (type === 'MatchingQuizAtom') {
        return buildAtomObjectQuizMatching(title, atomTable, lessonMajorVersion);
    }

    return buildAtomUnknown(getTableTitle(atomTable));
}

/**
 * Creates a Text Atom Object for an unknown Atom type.
 *
 * @param {string} title The title of the Atom.
 * @returns {Object} An object representation for an unknown Atom.
 */
function buildAtomUnknown(title) {
    return {
        locale: 'en-us',
        version: '1.0.0',
        title: null,
        semantic_type: 'TextAtom',
        is_public: true,
        text: '## Unknown Atom Type: ' +
            title +
            '\n\n (this is not an error, just manually replace this Atom with the correct one right here in CoCo)',
        instructor_notes: '',
        resources: null,
    };
}

/**
 * Creates the object structure for a Video Atom.
 *
 * @param {string} title The Atom's title.
 * @returns {Object} An object representation of a video.
 */
function buildAtomObjectVideo(title, atomTable, lessonMajorVersion) {
    let {
        json
    } =
    lessonMajorVersion === 7 ?
        extractAtomFieldsVideo_v7(atomTable) :
        extractAtomFieldsVideo_v8(atomTable);
    json = json || '{}';

    let videoObject = {};
    try {
        videoObject = JSON.parse(json);
    } catch (error) {
        videoObject = {};
    }
    const topher_id = _.get(videoObject, 'topher_id');
    const youtube_id = _.get(videoObject, 'youtube_id', 'FUvJZrfMv0I');
    const transcodings = _.get(videoObject, 'transcodings', {
        uri_480p_mp4: 'http://video.udacity-staging-data.com.s3.amazonaws.com/topher/2018/February/5a84e568_placeholder-video/placeholder-video_480p.mp4',
        uri_480p_1000kbps_mp4: 'http://video.udacity-staging-data.com.s3.amazonaws.com/topher/2018/February/5a84e568_placeholder-video/placeholder-video_480p_1000kbps.mp4',
        uri_480p_ogg: 'http://video.udacity-staging-data.com.s3.amazonaws.com/topher/2018/February/5a84e568_placeholder-video/placeholder-video_480p.ogg',
        uri_720p_mp4: 'http://video.udacity-staging-data.com.s3.amazonaws.com/topher/2018/February/5a84e568_placeholder-video/placeholder-video_720p.mp4',
        uri_hls: 'http://video.udacity-staging-data.com.s3.amazonaws.com/topher/2018/February/5a84e568_placeholder-video/hls/playlist.m3u8',
    });

    return {
        key: getTableUUID(atomTable, lessonMajorVersion),
        locale: 'en-us',
        version: '1.0.0',
        title: title,
        semantic_type: 'VideoAtom',
        __typename: 'VideoAtom',
        is_public: true,
        tags: [],
        instructor_notes: '',
        video: {
            id: '1286',
            topher_id: topher_id,
            youtube_id: youtube_id,
            subtitles: [],
            transcodings: transcodings,
        },
        resources: null,
    };
}

/**
 * Creates the object structure for an Image Atom.
 *
 * @param {string} title The Atom's title.
 * @param {Table} atomTable The Atom table.
 * @returns {Object} An object representation of an image.
 */
function buildAtomObjectImage(_title, atomTable, lessonMajorVersion) {
    const {
        uuid,
        title,
        altText,
        caption,
        url
    } =
    lessonMajorVersion === 7 ?
        extractAtomFieldsImage_v7(atomTable) :
        extractAtomFieldsImage_v8(atomTable);

    return {
        key: uuid,
        locale: 'en-us',
        version: '1.0.0',
        title,
        semantic_type: 'ImageAtom',
        __typename: 'ImageAtom',
        is_public: true,
        url: url ||
            'https://s3.amazonaws.com/video.udacity-staging-data.com/topher/2018/February/5a84e5bd_placeholder-image/placeholder-image.jpg',
        width: 787,
        height: 512,
        alt: altText,
        caption: caption,
        resources: null,
        instructor_notes: null,
    };
}

/**
 * Creates the object structure for a Text Atom.
 *
 * @param {string} title The Atom's title.
 * @param {Table} atomTable The Atom table.
 * @returns {Object} An object representation of a text box.
 */
function buildAtomObjectText(_title, atomTable, lessonMajorVersion) {
    const {
        uuid,
        title,
        text
    } =
    lessonMajorVersion === 7 ?
        extractAtomFieldsText_v7(atomTable) :
        extractAtomFieldsText_v8(atomTable);

    return {
        key: uuid,
        locale: 'en-us',
        version: '1.0.0',
        title,
        semantic_type: 'TextAtom',
        __typename: 'TextAtom',
        is_public: true,
        text: text,
        instructor_notes: '',
        resources: null,
    };
}

/**
 * Creates the object structure for a Checkbox Quiz Atom.
 *
 * @param {string} title The Atom's title.
 * @param {Table} atomTable The Atom table.
 * @returns {Object} An object representation of a checkbox quiz.
 */
function buildAtomObjectQuizCheckbox(_title, atomTable, lessonMajorVersion) {
    const {
        uuid,
        title,
        prompt,
        correctFeedback,
        negativeFeedback,
        answers
    } =
    lessonMajorVersion === 7 ?
        extractAtomFieldsCheckbox_v7(atomTable) :
        extractAtomFieldsCheckbox_v8(atomTable);

    return {
        key: uuid,
        locale: 'en-us',
        version: '1.0.0',
        title: title,
        semantic_type: 'CheckboxQuizAtom',
        __typename: 'CheckboxQuizAtom',
        is_public: true,
        question: {
            prompt: prompt,
            correct_feedback: correctFeedback,
            video_feedback: null,
            default_feedback: negativeFeedback,
            answers: answers,
        },
    };
}

/**
 * Creates the object structure for Radio Quiz Atom.
 *
 * @param {string} title The Atom's title.
 * @param {Table} atomTable The Atom table.
 * @returns {Object} An object representation of a radio quiz.
 */
function buildAtomObjectQuizRadio(_title, atomTable, lessonMajorVersion) {
    const {
        uuid,
        title,
        prompt,
        correctFeedback,
        negativeFeedback,
        answers,
    } = extractAtomFieldsRadio(atomTable, lessonMajorVersion);

    return {
        key: uuid,
        locale: 'en-us',
        version: '1.0.0',
        title: title,
        semantic_type: 'RadioQuizAtom',
        __typename: 'RadioQuizAtom',
        is_public: true,
        question: {
            prompt: prompt,
            correct_feedback: correctFeedback,
            video_feedback: null,
            default_feedback: negativeFeedback,
            answers: answers,
        },
    };
}

/**
 * Creates the object structure for TaskList Quiz Atom.
 *
 * @param {string} title The Atom's title.
 * @param {Table} atomTable The Atom table.
 * @returns {Object} An object representation of a TaskList quiz.
 */
function buildAtomObjectQuizTaskList(_title, atomTable, lessonMajorVersion) {
    const {
        uuid,
        title,
        prompt,
        tasks,
        feedback
    } =
    lessonMajorVersion === 7 ?
        extractAtomFieldsTaskList_v7(atomTable) :
        extractAtomFieldsTaskList_v8(atomTable);

    return {
        key: uuid,
        locale: 'en-us',
        version: '1.0.0',
        title,
        semantic_type: 'TaskListAtom',
        __typename: 'TaskListAtom',
        is_public: true,
        tasks: tasks,
        positive_feedback: feedback,
        video_feedback: null,
        description: prompt,
    };
}

/**
 * Creates the object structure for Free Response Quiz Atom.
 *
 * @param {string} title The Atom's title.
 * @param {Table} atomTable The Atom table.
 * @returns {Object} An object representation of a free response quiz.
 */
function buildAtomObjectQuizReflect(_title, atomTable, lessonMajorVersion) {
    const {
        uuid,
        title,
        prompt,
        quizTitle,
        feedback
    } =
    lessonMajorVersion === 7 ?
        extractAtomFieldsReflect_v7(atomTable) :
        extractAtomFieldsReflect_v8(atomTable);

    return {
        key: uuid,
        locale: 'en-us',
        version: '1.0.0',
        title: title,
        semantic_type: 'ReflectAtom',
        __typename: 'ReflectAtom',
        is_public: true,
        instructor_notes: null,
        resources: null,
        question: {
            title: quizTitle,
            semantic_type: 'TextQuestion',
            evaluation_id: null,
            text: prompt,
        },
        answer: {
            text: feedback,
            video: null,
        },
    };
}

/**
 * Creates the object structure for Regular Expression Quiz Atom.
 *
 * @param {string} title The Atom's title.
 * @param {Table} atomTable The Atom table.
 * @returns {Object} An object representation of a free response quiz.
 */
function buildAtomObjectQuizRegex(_title, atomTable, lessonMajorVersion) {
    const {
        uuid,
        title,
        prompt,
        correctFeedback,
        negativeFeedback,
        matchers
    } =
    lessonMajorVersion === 7 ?
        extractAtomFieldsRegex_v7(atomTable) :
        extractAtomFieldsRegex_v8(atomTable);

    return {
        key: uuid,
        is_public: true,
        locale: 'en-us',
        semantic_type: 'ValidatedQuizAtom',
        __typename: 'ValidatedQuizAtom',
        title: title,
        question: {
            correct_feedback: correctFeedback,
            default_feedback: negativeFeedback,
            matchers: matchers,
            prompt: prompt,
            video_feedback: null,
        },
    };
}

/**
 * Creates the object structure for Matching Quiz Atom.
 *
 * @param {string} title The Atom's title.
 * @param {Table} atomTable The Atom table.
 * @returns {Object} An object representation of a free response quiz.
 */
function buildAtomObjectQuizMatching(_title, atomTable, lessonMajorVersion) {
    if (lessonMajorVersion === 7) {
        return buildAtomUnknown(getTableTitle(atomTable));
    }

    const {
        uuid,
        title,
        correctFeedback,
        negativeFeedback,
        answers,
        concepts,
        complex_prompt,
        concepts_label,
        answers_label,
    } = extractAtomFieldsMatching(atomTable);

    return {
        key: uuid,
        is_public: true,
        locale: 'en-us',
        semantic_type: 'MatchingQuizAtom',
        __typename: 'MatchingQuizAtom',
        title: title,
        question: {
            correct_feedback: correctFeedback,
            default_feedback: negativeFeedback,
            answers: answers,
            concepts: concepts,
            complex_prompt,
            concepts_label,
            answers_label,
        },
    };
}

/*eslint-disable  no-unused-vars*/
function buildAtomObjectWorkspace(atomTable) {
    const {
        uuid,
        title
    } = extractAtomFieldsWorkspace(atomTable);

    return {
        key: uuid,
        is_public: true,
        locale: 'en-us',
        semantic_type: 'WorkspaceAtom',
        __typename: 'WorkspaceAtom',
        title: title,
    };
}
/**
 * Gets the dynamic fields for the Lesson.
 *
 * @returns {Array} The title, summary, and duration fields.
 */
function extractLessonFields(lessonTable) {
    const tableRows = lessonTable.getNumRows();
    const lesson = {};

    for (let i = 1; i < tableRows; i++) {
        const cellText = lessonTable.getCell(i, 0).getText();

        if (cellText.indexOf(struct.lessonTableTitle) >= 0) {
            lesson.title = lessonTable.getCell(i, 1).getText();
        } else if (cellText.indexOf(struct.lessonTableDescription) >= 0) {
            lesson.summary = lessonTable.getCell(i, 1).getText();
        } else if (cellText.indexOf(struct.lessonTableDuration) >= 0) {
            lesson.duration = lessonTable.getCell(i, 1).getText();
        } else if (cellText.indexOf(struct.lessonSheetName) >= 0) {
            lesson.sheetName = lessonTable.getCell(i, 1).getText();
        } else if (cellText.indexOf(struct.lessonTableUUID) >= 0) {
            lesson.uuid = lessonTable.getCell(i, 1).getText().replace('\n', '');
        }
    }

    return lesson;
}

/**
 * Gets the dynamic fields for the Concept table.
 *
 * @param {Table} conceptTable The Concept table
 * @returns {Array} The required fields.
 */
function extractConceptFields(conceptTable, lessonMajorVersion) {
    const concept = getTableTitle(conceptTable);
    const uuid = getTableUUID(conceptTable, lessonMajorVersion);
    const title = getTableHeading(conceptTable);

    return {
        concept: concept,
        uuid: uuid,
        title: title,
    };
}

/**
 * Gets the dynamic fields from a single-column video Atom.
 *
 * @param {Table} atomTable The Atom table.
 * @returns {Object} Details about the table.
 */
/*eslint-disable  no-unused-vars*/
function extractVideoSingleColumn(atomTable) {
    const atom = getTableTitle(atomTable);
    const title = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable);
    const contentCell = atomTable.getRow(2).getCell(0);

    const notesRangeTable = contentCell.findTable();

    const notes = notesRangeTable.getRow(1).getText();

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        notes: notes,
    };
}

/**
 * Gets the dynamic fields from a mult-column video Atom.
 *
 * @param {Table} atomTable The Atom table.
 * @returns {Object} Details about the table.
 */
/*eslint-disable  no-unused-vars*/
function extractVideoMultipleColumns(atomTable) {
    const atom = getTableTitle(atomTable);
    const title = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable);
    const contentCell = atomTable.getRow(2).getCell(0);

    const visualSegmentsTable = contentCell.findTable();

    const visualSegmentsData = extractVisualSegmentsData(visualSegmentsTable);

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        visualSegments: visualSegmentsData,
    };
}

/**
 * Gets the visual and notes info out of a "visual segments" table.
 *
 * @param {Table} table The visual segments table.
 * @returns {Object} Details about the table
 */
function extractVisualSegmentsData(table) {
    var notes;
    var visual;
    const data = [];

    for (var index = 1; index < table.getNumRows(); index++) {
        notes = table.getCell(index, 1).getText();

        visual = getVisualSegment(table.getCell(index, 0));

        data.push({
            visual: visual,
            notes: notes,
        });
    }

    return data;
}

/**
 * Gets the visual to be used from a single visual segement.
 *
 * @param {TableCell} visualCell The visuals cell of a visual segment table.
 * @returns {String} The visual to be used.
 */
function getVisualSegment(visualCell) {
    var type = '';
    var text = '';
    var innerVisualTable = visualCell.findTable();

    var walkthruText = innerVisualTable.getCell(0, 1).getText();
    var slidesText = innerVisualTable.getCell(1, 1).getText();

    if (walkthruText.length > 0) {
        type = struct.nameVisualSegmentWalkthru;
        text = walkthruText;
    } else {
        type = struct.nameVisualSegmentSlides;
        text = slidesText;
    }

    return {
        type: type,
        text: text,
    };
}

/**
 * Gets the dynamic fields from an Image Atom.
 *
 * @param {Table} atomTable The Atom table.
 * @returns {string} The caption.
 */
function extractAtomFieldsImage_v7(atomTable) {
    const atom = getTableTitle(atomTable);
    const title = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable, 7);
    let url = null;
    const contentCell = atomTable.getRow(2);

    const altTextRange = contentCell.findTable(0);
    const captionRange = contentCell.findTable(1);
    const imageRange = contentCell.findTable(2);

    const altText = altTextRange.getRow(1).getText();
    const caption = captionRange.getRow(1).getText();
    if (imageRange) {
        url = imageRange.getRow(1).getText();
    }

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        altText: altText,
        caption: caption,
        url,
    };
}

/**
 * Gets the dynamic fields from an Image Atom.
 *
 * @param {Table} atomTable The Atom table.
 * @returns {string} The caption.
 */
function extractAtomFieldsImage_v8(atomTable) {
    const atom = getTableTitle(atomTable);
    const title = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable, 8);
    let url = null;
    const contentCell = atomTable.getRow(0).getCell(2);

    const altTextRange = contentCell.findTable(0);
    const captionRange = contentCell.findTable(1);
    const imageRange = atomTable.getRow(0).getCell(0).findTable(0);

    const altText = altTextRange.getRow(1).getText();
    const caption = captionRange.getRow(1).getText();
    if (imageRange) {
        url = imageRange.getRow(2).getCell(1).getText().trim();
    }

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        altText: altText,
        caption: caption,
        url,
    };
}

/**
 * Gets the dynamic fields from a Video Atom.
 *
 * @param {Table} atomTable The Atom table.
 * @returns {Object} Details about the table
 */
function extractAtomFieldsVideo_v7(atomTable) {
    let json = '';

    const contentCell = atomTable.getRow(2);
    const jsonBlobTable = contentCell.findTableByTitlePrefix('Video Information');

    if (jsonBlobTable) {
        json = jsonBlobTable.getRow(1).getText();
    }

    return {
        json,
    };
}

/**
 * Gets the dynamic fields from a Video Atom.
 *
 * @param {Table} atomTable The Atom table.
 * @returns {Object} Details about the table
 */
function extractAtomFieldsVideo_v8(atomTable) {
    const contentCell = atomTable.getRow(0);
    const json = contentCell.findCellValueByTitlePrefix('Video Info');

    return {
        json,
    };
}

/**
 * Gets the dynamic fields from a Text Atom.
 *
 * @param {Table} atomTable The Atom table.
 * @returns {string} The text in every row below the header row.
 */
function extractAtomFieldsText_v7(atomTable) {
    const atom = getTableTitle(atomTable);
    const title = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable, 7);
    const text = atomTable.getRow(2).getText();

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        text: text,
    };
}

/**
 * Gets the dynamic fields from a Text Atom.
 *
 * @param {Table} atomTable The Atom table.
 * @returns {string} The text in every row below the header row.
 */
function extractAtomFieldsText_v8(atomTable) {
    const atom = getTableTitle(atomTable);
    const title = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable, 8);
    const text = atomTable.getRow(0).getCell(2).getText();

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        text: text,
    };
}

/**
 * Gets the dynamic fields from a Checkbox Atom.
 *
 * @param {Table} atomTable The Atom table.
 * @returns {Array} The prompt and feedback fields.
 */
function extractAtomFieldsCheckbox_v7(atomTable) {
    const atom = getTableTitle(atomTable);
    const title = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable, 7);
    const contentCell = atomTable.getRow(2);

    // The first table should be prompt table
    const promptTable = contentCell.findTable(0);
    // The second table should be the answer table
    const answersTable = contentCell.findTable(1);
    // The third table should be the correct feedback table
    const correctFeedbackTable = contentCell.findTable(2);
    // The fourth table should be the negative feedback table
    const negativeFeedbackTable = contentCell.findTable(3);

    const prompt = promptTable.getRow(1).getText();
    const correctFeedback = correctFeedbackTable.getRow(1).getText();
    const negativeFeedback = negativeFeedbackTable.getRow(1).getText();
    const answers = buildQuizAnswerObject(answersTable);

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        prompt: prompt,
        correctFeedback: correctFeedback,
        negativeFeedback: negativeFeedback,
        answers: answers,
    };
}

/**
 * Gets the dynamic fields from a Checkbox Atom.
 *
 * @param {Table} atomTable The Atom table.
 * @returns {Array} The prompt and feedback fields.
 */
function extractAtomFieldsCheckbox_v8(atomTable) {
    const atom = getTableTitle(atomTable);
    const title = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable, 8);
    const contentCell = atomTable.getRow(0).getCell(2);

    // The first table should be prompt table
    const promptTable = contentCell.findTable(0);
    // The second table should be the answer table
    const answersTable = contentCell.findTable(1);
    // The third table should be the correct feedback table
    const correctFeedbackTable = contentCell.findTable(2);
    // The fourth table should be the negative feedback table
    const negativeFeedbackTable = contentCell.findTable(3);

    const prompt = promptTable.getRow(1).getText();
    const correctFeedback = correctFeedbackTable.getRow(1).getText();
    const negativeFeedback = negativeFeedbackTable.getRow(1).getText();
    const answers = buildQuizAnswerObject(answersTable);

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        prompt: prompt,
        correctFeedback: correctFeedback,
        negativeFeedback: negativeFeedback,
        answers: answers,
    };
}

/**
 * Creates the object structure for a quiz answer choice.
 *
 * @param {Table} quizOptionsTable The row with the quiz options.
 * @returns {Array} A quiz's answer choices.
 */
function buildQuizAnswerObject(quizOptionsTable) {
    const answers = [];

    for (var i = 1; i < quizOptionsTable.getNumRows(); i++) {
        var quizAnswer = quizOptionsTable.getCell(i, 0).getText();
        var correctText = quizOptionsTable.getCell(i, 1).getText();
        var answerFeedback = quizOptionsTable.getCell(i, 2).getText();

        answers.push({
            id: 'rbk' + i,
            text: getQuizOption(quizAnswer),
            is_correct: determineQuizAnswerCorrectness(correctText),
            incorrect_feedback: answerFeedback,
        });
    }

    return answers;
}

/**
 * Determines if a quiz option is correct or not.
 *
 * @param {string} flag The text of a quiz option.
 * @returns {boolean} If the text is correct or not.
 */
function determineQuizAnswerCorrectness(flag) {
    if (flag.indexOf(struct.quizCorrectFlag) >= 0) {
        return true;
    }

    return false;
}

/**
 * Gets the dynamic fields from a Radio Atom.
 *
 * @param {Table} atomTable The Atom table.
 * @returns {Array} The prompt and feedback fields.
 */
function extractAtomFieldsRadio(atomTable, lessonMajorVersion) {
    return lessonMajorVersion === 7 ?
        extractAtomFieldsCheckbox_v7(atomTable) :
        extractAtomFieldsCheckbox_v8(atomTable);
}

/**
 * Gets the dynamic fields from a Workspace Atom.
 *
 * @param {Table} atomTable The Atom table.
 * @returns {Array} The description, tasks, and feedback.
 */
function extractAtomFieldsWorkspace(atomTable) {
    const atom = getTableTitle(atomTable);
    const title = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable);
    const contentCell = atomTable.getRow(0).getCell(2);

    const githubUrlTable = contentCell.findTable(0);

    const githubUrl = githubUrlTable.getRow(1).getText();

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        url: githubUrl,
    };
}

/**
 * Extracts the list of Tasks.
 *
 * @param {Table} quizOptionsTable The table with the quiz options.
 * @returns {Array} The tasks to complete.
 */
function buildTasksArray(quizOptionsTable) {
    const tasks = [];

    for (var i = 1; i < quizOptionsTable.getNumRows(); i++) {
        var textEntry = quizOptionsTable.getCell(i, 0).getText();

        tasks.push(getQuizOption(textEntry));
    }

    return tasks;
}

/**
 * Removes the circle or square shape and returns the Quiz option text.
 *
 * @param {string} text The text of a quiz option field.
 * @returns {string} The text of the quiz option.
 */
function getQuizOption(text) {
    const icons = ['▢', '◯'];

    if (icons.indexOf(text[0]) >= 0) {
        return text.slice(1).trim();
    }

    return text.trim();
}

/**
 * Gets the dynamic fields from a TaskList Atom.
 *
 * @param {Table} atomTable The Atom table.
 * @returns {Array} The description, tasks, and feedback.
 */
function extractAtomFieldsTaskList_v7(atomTable) {
    const atom = getTableTitle(atomTable);
    const title = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable, 7);
    const contentCell = atomTable.getRow(2);

    const promptTable = contentCell.findTable(0);
    const tasksTable = contentCell.findTable(1);
    const feedbackTable = contentCell.findTable(2);

    const prompt = promptTable.getRow(1).getText();
    const feedback = feedbackTable.getRow(1).getText();
    const tasks = buildTasksArray(tasksTable);

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        prompt: prompt,
        tasks: tasks,
        feedback: feedback,
    };
}

/**
 * Gets the dynamic fields from a TaskList Atom.
 *
 * @param {Table} atomTable The Atom table.
 * @returns {Array} The description, tasks, and feedback.
 */
function extractAtomFieldsTaskList_v8(atomTable) {
    const atom = getTableTitle(atomTable);
    const title = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable, 8);
    const contentCell = atomTable.getRow(0).getCell(2);

    const promptTable = contentCell.findTable(0);
    const tasksTable = contentCell.findTable(1);
    const feedbackTable = contentCell.findTable(2);

    const prompt = promptTable.getRow(1).getText();
    const feedback = feedbackTable.getRow(1).getText();
    const tasks = buildTasksArray(tasksTable);

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        prompt: prompt,
        tasks: tasks,
        feedback: feedback,
    };
}

/**
 * Extracts the list of Tasks.
 *
 * @param {TableRow} quizOptionsRow The row with the quiz options.
 * @returns {Array} The tasks to complete.
 */
function buildTasksArray(quizOptionsTable) {
    const tasks = [];
    // const quizOptionsTable = quizOptionsRow
    //   .findElement(DocumentApp.ElementType.TABLE)
    //   .getElement()
    //   .asTable();

    for (var i = 1; i < quizOptionsTable.getNumRows(); i++) {
        var textEntry = quizOptionsTable.getCell(i, 0).getText();

        tasks.push(getQuizOption(textEntry));
    }

    return tasks;
}

/**
 * Removes the circle or square shape and returns the Quiz option text.
 *
 * @param {string} text The text of a quiz option field.
 * @returns {string} The text of the quiz option.
 */
function getQuizOption(text) {
    const icons = ['▢', '◯'];

    if (icons.indexOf(text[0]) >= 0) {
        return text.slice(1).trim();
    }

    return text.trim();
}

/**
 * Gets the dynamic fields from a Free Response Atom.
 *
 * @param {Table} atomTable A table.
 * @returns {Array} The question and answer.
 */
function extractAtomFieldsReflect_v7(atomTable) {
    const atom = getTableTitle(atomTable);
    const tableTitle = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable, 7);
    // The content Row
    const contentCell = atomTable.getRow(2);

    // The first one should be prompt table
    const promptTable = contentCell.findTable(0);
    // The second one should be the title
    const titleTable = contentCell.findTable(1);
    // The third one should be the feedback
    const feedbackTable = contentCell.findTable(2);

    const prompt = promptTable.getRow(1).getText();
    const title = titleTable.getRow(1).getText();
    const feedback = feedbackTable.getRow(1).getText();

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        quizTitle: title,
        prompt: prompt,
        feedback: feedback,
    };
}

/**
 * Gets the dynamic fields from a Free Response Atom.
 *
 * @param {Table} atomTable A table.
 * @returns {Array} The question and answer.
 */
function extractAtomFieldsReflect_v8(atomTable) {
    const atom = getTableTitle(atomTable);
    const tableTitle = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable, 8);
    // The content Row
    const contentCell = atomTable.getRow(0).getCell(2);

    // The first one should be prompt table
    const promptTable = contentCell.findTable(0);
    // The second one should be the title
    const titleTable = contentCell.findTable(1);
    // The third one should be the feedback
    const feedbackTable = contentCell.findTable(2);

    const prompt = promptTable.getRow(1).getText();
    const title = titleTable.getRow(1).getText();
    const feedback = feedbackTable.getRow(1).getText();

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        quizTitle: title,
        prompt: prompt,
        feedback: feedback,
    };
}

/**
 * Gets the dynamic fields from a RegEx Atom.
 *
 * @param {Table} atomTable A table.
 * @returns {Array} The question, feedback, and RegEx matchers.
 */
function extractAtomFieldsRegex_v7(atomTable) {
    const atom = getTableTitle(atomTable);
    const title = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable, 7);
    var matchers = [];

    // The content row
    const contentCell = atomTable.getRow(2);

    // The first one should be prompt
    const promptTable = contentCell.findTable(0);
    const regexTable = contentCell.findTable(1);
    const correctFeedbackTable = contentCell.findTable(2);
    const negativeFeedbackTable = contentCell.findTable(3);

    const prompt = promptTable.getRow(1).getText();
    const correctFeedback = correctFeedbackTable.getRow(1).getText();
    const negativeFeedback = negativeFeedbackTable.getRow(1).getText();

    for (var i = 1; i < regexTable.getNumRows(); i++) {
        var regex = regexTable.getCell(i, 0).getText();
        var flags = regexTable.getCell(i, 1).getText();
        var description = regexTable.getCell(i, 2).getText();

        flags = flags.replace(/[^gimuy]/g, ''); // Remove all characters that aren't flags

        matchers.push({
            expression: regex,
            expression_description: description,
            flags: flags,
            incorrect_feedback: null,
            is_correct: true,
            semantic_type: 'RegexMatcher',
        });
    }

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        prompt: prompt,
        correctFeedback: correctFeedback,
        negativeFeedback: negativeFeedback,
        matchers: matchers,
    };
}

/**
 * Gets the dynamic fields from a RegEx Atom.
 *
 * @param {Table} atomTable A table.
 * @returns {Array} The question, feedback, and RegEx matchers.
 */
function extractAtomFieldsRegex_v8(atomTable) {
    const atom = getTableTitle(atomTable);
    const title = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable, 8);
    var matchers = [];

    // The content row
    const contentCell = atomTable.getRow(0).getCell(2);

    // The first one should be prompt
    const promptTable = contentCell.findTable(0);
    const regexTable = contentCell.findTable(1);
    const correctFeedbackTable = contentCell.findTable(2);
    const negativeFeedbackTable = contentCell.findTable(3);

    const prompt = promptTable.getRow(1).getText();
    const correctFeedback = correctFeedbackTable.getRow(1).getText();
    const negativeFeedback = negativeFeedbackTable.getRow(1).getText();

    for (var i = 1; i < regexTable.getNumRows(); i++) {
        var regex = regexTable.getCell(i, 0).getText();
        var flags = regexTable.getCell(i, 1).getText();
        var description = regexTable.getCell(i, 2).getText();

        flags = flags.replace(/[^gimuy]/g, ''); // Remove all characters that aren't flags

        matchers.push({
            expression: regex,
            expression_description: description,
            flags: flags,
            incorrect_feedback: null,
            is_correct: true,
            semantic_type: 'RegexMatcher',
        });
    }

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        prompt: prompt,
        correctFeedback: correctFeedback,
        negativeFeedback: negativeFeedback,
        matchers: matchers,
    };
}

function extractAtomFieldsMatching(atomTable) {
    const atom = getTableTitle(atomTable);
    const title = getTableHeading(atomTable);
    const uuid = getTableUUID(atomTable, 8);

    // The content row
    const contentCell = atomTable.getRow(0).getCell(2);

    // The first one should be prompt
    const promptTable = contentCell.findTable(0);
    const matchersTable = contentCell.findTable(1);
    const correctFeedbackTable = contentCell.findTable(3);
    const negativeFeedbackTable = contentCell.findTable(4);

    const prompt = promptTable.getRow(1).getText();
    const correctFeedback = correctFeedbackTable.getRow(1).getText();
    const negativeFeedback = negativeFeedbackTable.getRow(1).getText();
    const conceptsLabel = matchersTable.getRow(0).getCell(0).getText().trim();
    const answersLabel = matchersTable.getRow(0).getCell(1).getText().trim();
    const concepts = [];
    const answers = [];

    for (var i = 1; i < matchersTable.getNumRows(); i++) {
        var concept = matchersTable.getCell(i, 0).getText().trim();
        var answer = matchersTable.getCell(i, 1).getText().trim();

        answers.push({
            id: 'ans' + i,
            text: answer,
        });

        concepts.push({
            correct_answer_id: 'ans' + i,
            text: concept,
        });
    }

    return {
        atom: atom,
        uuid: uuid,
        title: title,
        answers: answers,
        correctFeedback: correctFeedback,
        negativeFeedback: negativeFeedback,
        concepts: concepts,
        complex_prompt: {
            text: prompt,
        },
        answers_label: answersLabel,
        concepts_label: conceptsLabel,
    };
}

/**
 * Creates a structure of all Concepts with their Atom Tables nested inside.
 * @param {Table} table A list of tables
 * @returns {Object} Each key is a Concept title and the value is an array of Atom Tables.
 */
function createConceptAndAtomsStructure(tables) {
    var currentConcept = '';
    var conceptTables = [];

    const lessonStructure = tables
        .filter(onlyConceptAndAtomTables)
        .reduce(function(accumulator, table) {
            if (tableIsConcept(table)) {
                var tableTitle = getTableHeading(table);
                currentConcept = tableTitle;

                accumulator[tableTitle] = [];
                conceptTables.push(table);

                return accumulator;
            }
            if (shouldBeIncludedInImport(table)) {
                accumulator[currentConcept].push(table);
            }
            return accumulator;
        }, {});

    return {
        lessonStructure,
        conceptTables
    };
}

/**
 * Determines if the table has the "Import – Ignore" flag.
 *
 * @param {Table} table The Table.
 * @returns {Boolean} If the table has the flag.
 */
function tableHasIgnoreImportFlag(table) {
    const regex = RegExp(struct.nameImportIgnore, 'm');
    const tableHeaderText = table.getRow(0).getText();

    return regex.test(tableHeaderText);
}

/**
 * Determines if the Table should be included by the import code.
 *
 * @param {Table} table The Table.
 * @returns {boolean} If the Table should be imported.
 */
function shouldBeIncludedInImport(table) {
    if (tableHasIgnoreImportFlag(table)) {
        return false;
    }

    return true;
}

/**
 * Determines if the provided table is a Concept table or an Atom table.
 *
 * @param {Table} table A table that was created.
 * @returns {Boolean} If the Table is either a Concept or Atom table.
 */
function onlyConceptAndAtomTables(table) {
    try {
        var type = getTableType(table);
        return struct.allowedTypes.indexOf(type) >= 0;
    } catch (e) {
        console.log(e);
    } // eslint-disable-line no-empty

    return false;
}

/**
 * Checks if a table is an Concept or not.
 *
 * @param {Table} table A table.
 * @returns {boolean} If the table's title has "Concept" in it.
 */
function tableIsConcept(table) {
    var tableType = getTableType(table);

    return tableType === struct.nameConcept;
}

/**
 * Gets the heading of the provided table.
 *
 * @param {Table} table A table.
 * @return {string} The heading of a table.
 */
function getTableTitle(table) {
    return table.getRow(0).getCell(0).getChild(0).getText();
}

/**
 * Updates the provided lessonJSON object with the object structures for every Concept and Atom.
 *
 * @param {Object} lessonJSON An object structure of the lesson.
 * @param {Object} lessonStructure The object structure of all Concepts with nested Atoms.
 * @returns {Object} The modified lessonJSON argument.
 */
function buildLesson(
    lessonJSON,
    lessonStructure,
    conceptTables,
    lessonMajorVersion
) {
    const conceptList = Object.keys(lessonStructure).map(function(
        concept,
        index
    ) {
        const atomList = lessonStructure[concept]
            .filter(removeUnknownAtoms)
            .map(function(atomTable) {
                const semanticType = determineAtomType(atomTable);
                return buildAtomObject(semanticType, atomTable, lessonMajorVersion);
            });

        const conceptObject = buildConceptObject(
            conceptTables[index],
            lessonMajorVersion
        );
        conceptObject.atoms = atomList;
        return conceptObject;
    });

    lessonJSON.concepts = conceptList;

    return lessonJSON;
}

/**
 * Remove "unknown" Atom tables
 *
 * @param {*} atomTable An Atom table.
 */
function removeUnknownAtoms(atomTable) {
    return determineAtomType(atomTable) !== 'UnknownAtom';
}

/**
 * Gets the CoCo name based off an Atom's type.
 *
 * @param {Table} atomTable An Atom table.
 * @returns {string} The name that CoCo calls an Atom.
 */
function determineAtomType(atomTable) {
    const type = getTableType(atomTable);

    const images = ['Image'];
    const text = ['Text'];

    if (struct.videoAtoms.indexOf(type) >= 0) {
        return 'VideoAtom';
    } else if (images.indexOf(type) >= 0) {
        return 'ImageAtom';
    } else if (text.indexOf(type) >= 0) {
        return 'TextAtom';
    } else if (type === 'Q : Checkbox') {
        return 'CheckboxQuizAtom';
    } else if (type === 'Q : Radio') {
        return 'RadioQuizAtom';
    } else if (type === 'Q : TaskList') {
        return 'TaskListAtom';
    } else if (type === 'Q : Free Response') {
        return 'ReflectAtom';
    } else if (type === 'Q : RegEx') {
        return 'ValidatedQuizAtom';
    } else if (type === 'Q : Matching') {
        return 'MatchingQuizAtom';
    }

    return 'UnknownAtom';
}

/**
 * Verifies that Concepts are structured correctly.
 */
export function validateConcepts(doc) {
    validateConceptHeadingsExist(doc);
    validateConceptHeadingsAreUnique(doc);
}

export function generateImportCode(data) {
    const doc = new Document(data);
    // validateConcepts();
    // The first table is refer to lesson table

    const lessonJSON = buildLessonObject(doc.getTable(0));
    const {
        lessonStructure,
        conceptTables
    } = createConceptAndAtomsStructure(
        doc.getTables()
    );
    const lessonMajorVersion = doc.getMajorVersion();

    if (!SUPPORTED_VERSIONS.includes(lessonMajorVersion)) {
        throw new Error(
            `Lesson template version ${lessonMajorVersion} is not supported!`
        );
    }

    return buildLesson(
        lessonJSON,
        lessonStructure,
        conceptTables,
        lessonMajorVersion
    );
}