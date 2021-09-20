import ApiService from './api-service';

function createupgradeContentVersionMutation(enrollmentId) {
    return `
    mutation upgradeContentVersion {
      upgradeContent(enrollment_id: "${enrollmentId}") {
        id
        key
        version
        locale
      }
    }
  `;
}

export default {
    upgradeContentVersion(enrollmentId) {
        return ApiService.gql(
            createupgradeContentVersionMutation(enrollmentId)
        ).then((response) => response.data.upgradeContent);
    },
};