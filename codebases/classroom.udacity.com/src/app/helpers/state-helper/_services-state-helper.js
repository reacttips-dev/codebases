export function formatKnowledgeAccessKey(ndKey) {
    const safeNdKey = ndKey.replace(/-/g, '_');
    return `has_${safeNdKey}_access`;
}

export function selectStudentHubUnreads(state) {
    return _.get(state, 'unreads.studentHub.unreads_summary', {
        room_count: 0,
        unread_room_count: 0,
        unread_mention_count: 0,
        rooms: [],
    });
}

export function selectKnowledgeUnreads(state) {
    return _.get(state, 'unreads.knowledge.unreads_summary.unread_post_count', 0);
}

export function selectUnreadRooms(state) {
    return _.get(state, 'unreads.studentHub.unreads_summary.rooms', []);
}

export function selectStudentHubHasUnreads(state) {
    const unreads = selectStudentHubUnreads(state);
    if (_.isEmpty(unreads)) {
        return false;
    }

    if (unreads.unread_room_count || unreads.unread_mention_count) {
        return true;
    }

    return false;
}

export function selectStudentHubMentionsCount(state) {
    const unreads = selectStudentHubUnreads(state);
    if (_.isEmpty(unreads)) {
        return 0;
    }

    // conversationsCount will be added in at a later date; defaulting to 0 for now
    const conversationsCount = unreads.unread_conversations_count || 0;
    const mentionsCount = unreads.unread_mention_count || 0;

    return conversationsCount + mentionsCount;
}

export function selectWindowState(state) {
    return _.get(state, 'windowState.windowState');
}

export function formatStudentHubUnreadSummary(unreads) {
    if (_.isEmpty(unreads)) {
        return {
            room_count: 0,
            unread_room_count: 0,
            unread_mention_count: 0,
            rooms: [],
        };
    }

    // add up the mentions and messages
    return unreads.reduce(
        (acc, summary) => {
            const roomCount = summary.unread ? 1 : 0;
            acc.unread_room_count += roomCount;
            acc.unread_mention_count += summary.mentions;
            return acc;
        }, {
            room_count: unreads.length,
            unread_room_count: 0,
            unread_mention_count: 0,
            rooms: unreads,
        }
    );
}

export function formatKnowledgeUnreadSummary(unreads) {
    const {
        posts
    } = unreads.postsToRead;
    if (_.isEmpty(posts)) {
        return;
    }

    return {
        unread_post_count: posts.length
    };
}