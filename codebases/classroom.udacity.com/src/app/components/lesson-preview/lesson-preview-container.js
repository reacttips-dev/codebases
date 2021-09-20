import Actions from 'actions';
import LessonPreviewLoader from './lesson-preview-loader';
import {
    connect
} from 'react-redux';
import {
    withRouter
} from 'react-router';

export default withRouter(
    connect(null, {
        updateUnstructuredUserStateData: Actions.updateUnstructuredUserStateData,
        previewLesson: Actions.previewLesson,
        fetchPreviewLesson: Actions.fetchPreviewLesson,
        fetchPreviewNanodegree: Actions.fetchPreviewNanodegree,
    })(LessonPreviewLoader)
);