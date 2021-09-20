import SemanticTypes from 'constants/semantic-types';

function formatAsPathSegment(str) {
    return `${str.toLowerCase()}s`;
}

const SEMANTIC_CHILD_SEGMENT = {
    [SemanticTypes.NANODEGREE]: SemanticTypes.PART,
    [SemanticTypes.PART]: SemanticTypes.MODULE,
    [SemanticTypes.LESSON]: SemanticTypes.CONCEPT,
};

export default {
    getPathForSemanticType(path, semanticType) {
        const childPathSegment = formatAsPathSegment(
            SEMANTIC_CHILD_SEGMENT[semanticType]
        );

        const [relativePath] = path.split(`/${childPathSegment}`);
        return relativePath;
    },

    getLabPathForLesson(lessonPath) {
        const basePath = this.getPathForSemanticType(
            lessonPath,
            SemanticTypes.LESSON
        );
        return `${basePath}/lab`;
    },
};