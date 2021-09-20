import ApiService from 'services/api-service';

export default {
    async pairStudentWithMentor({
        nanodegreeKey,
        userId,
        locale,
        timezone
    }) {
        try {
            const response = await ApiService.post(
                `${CONFIG.communityApi}/pairings/match`, {
                    nanodegree_key: nanodegreeKey,
                    user_id: userId,
                    locale,
                    timezone,
                }
            );
            return response;
        } catch (error) {
            return {
                mentor: null
            };
        }
    },
    async getHubUser() {
        try {
            return await ApiService.get(`${CONFIG.communityApi}/profiles/me`);
        } catch (error) {
            return {
                hubUser: null
            };
        }
    },
    async updateHubUser(newHubUser) {
        try {
            return await ApiService.post(
                `${CONFIG.communityApi}/profiles/me/update`, {
                    photo_base64: newHubUser.avatarUrl,
                }
            );
        } catch (error) {
            return {
                hubUser: null
            };
        }
    },
    async fetchLastThreeMessages(roomId) {
        try {
            return await ApiService.get(
                `${CONFIG.communityApi}/messages/${roomId}?count=3`
            );
        } catch (err) {
            throw err;
        }
    },
    async fetchUnreads(userId) {
        return await ApiService.get(
            `${CONFIG.communityApi}/unread/users/${userId}/summaries`
        );
    },
};