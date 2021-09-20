import AnalyticsService from 'services/analytics-service';
import ClassroomPropTypes from 'components/prop-types';
import PropTypes from 'prop-types';
import invariant from 'invariant';

export default {
    contextTypes: {
        params: PropTypes.objectOf(PropTypes.string),
        concept: ClassroomPropTypes.node,
        course: ClassroomPropTypes.node,
        lesson: ClassroomPropTypes.node,
        module: ClassroomPropTypes.node,
        nanodegree: ClassroomPropTypes.node,
        part: ClassroomPropTypes.node,
        project: ClassroomPropTypes.node,
        root: ClassroomPropTypes.node,
        specialization: PropTypes.object,
    },

    track(eventName, opts, integrations, callback) {
        var prefix = this.context.root ?
            `${this._getEventPrefixFromSemanticType(
          this.context.root.semantic_type
        )} ` :
            _.get(opts, 'prefix', '');
        const baseInfo = this._getBaseInfo();

        const allOpts = _.chain({
                ...baseInfo,
                ...opts,
            })
            .omitBy(_.isUndefined)
            .omit('prefix')
            .value();

        return AnalyticsService.track(
            `${prefix}${eventName}`,
            allOpts,
            integrations,
            callback
        );
    },

    trackVideoSeen({
        startTime,
        endTime,
        videoDuration,
        durationWatched,
        playerState,
        atomKey,
        playbackRate,
        topherId,
        isYoutubePlayer,
        workspacePage = null,
    }) {
        invariant(startTime !== undefined, 'start time is required');
        invariant(endTime, 'end time is required');
        invariant(videoDuration, 'video duration is required');
        invariant(durationWatched !== undefined, 'duration watched is required');
        invariant(playerState, 'player state is required');
        invariant(atomKey, 'node key is required');
        this.track('Video Watched', {
            startTime,
            endTime,
            videoDuration,
            durationWatched,
            playerState,
            atomKey,
            playbackRate,
            topherId,
            isYoutubePlayer,
            workspacePage,
        });
    },

    _getEventPrefixFromSemanticType(semanticType) {
        if (semanticType === 'Degree') {
            return 'Nanodegree';
        } else {
            return `${semanticType}`;
        }
    },

    _getBaseInfo() {
        const nodeTitles = this._getNodeTitlesFromContext();
        const rootInfo = this._getRootInfo();

        return {
            ...this.context.params,
            ...nodeTitles,
            ...rootInfo,
        };
    },

    _getNodeTitlesFromContext() {
        const {
            course,
            nanodegree,
            concept,
            part,
            module,
            lesson,
            specialization,
        } = this.context;

        return {
            concept_title: _.get(concept, 'title'),
            course_title: _.get(course, 'title'),
            lesson_title: _.get(lesson, 'title'),
            module_title: _.get(module, 'title'),
            nanodegree_title: _.get(nanodegree, 'title'),
            part_title: _.get(part, 'title'),
            specialization_title: _.get(specialization, 'title'),
        };
    },

    _getRootInfo() {
        const {
            root
        } = this.context;
        const contentType =
            _.get(root, 'semantic_type') &&
            this._getEventPrefixFromSemanticType(_.get(root, 'semantic_type'));

        return {
            content_type: _.toLower(contentType) || undefined,
            version: _.get(root, 'version'),
            locale: _.get(root, 'locale'),
            nd_key: _.get(root, 'key'),
        };
    },
};