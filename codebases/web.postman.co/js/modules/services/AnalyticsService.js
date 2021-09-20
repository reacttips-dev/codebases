let globalWorkspace = null,

  getWorkspace = function () {
    let window = _.get(pm, 'windowConfig.process');
    switch (window) {
      case 'runner':
      case 'requester':
        try {
          return globalWorkspace || {};
        } catch (error) {
          console.warn('AnalyticsService: There was an error while trying to get workspace details for analytics', error);
          return {};
        }

      case 'console':
      default:
        return {};
    }
  },

  /**
   * A wrapper to abstract out the logic for creating/sending analytics events
   * Currently it uses pm.bulkAnalytics to add new events to a queue.
   */
  AnalyticsService = {
    addEvent: function (category, action, label, value, meta, options) {

      // For events while do not require active workspace details
      if (_.get(options, 'noActiveWorkspace')) {
        return pm.bulkAnalytics.addCurrentEvent({ category, action, label, value, meta });
      }

      let workspace = getWorkspace();
      return pm.bulkAnalytics.addCurrentEvent({ category, action, label, value, meta, workspaceId: workspace.id, workspaceType: workspace.type });
    },

    /**
     * Takes event properties as payload so that new properties can be introduced easily in future.
     * https://postmanlabs.atlassian.net/wiki/spaces/DATAOPS/pages/1543176203/Clientevents+Interface
     */
    addEventV2: function (payload, options) {
      // For events while do not require active workspace details
      if (_.get(options, 'noActiveWorkspace')) {
        return pm.bulkAnalytics.addCurrentEvent(payload);
      }
      let workspace = getWorkspace();
      return pm.bulkAnalytics.addCurrentEvent({
        ...payload,
        workspaceId: workspace.id,
        workspaceType: workspace.type
      });
    },

    /**
     * Add an event to the analytics events queue in immediately publish it
     *
     * @param {Object} payload
     * @param {Object} options
     */
    addEventV2AndPublish: function (payload, options) {
      this.addEventV2(payload, options);

      pm.bulkAnalytics.sendPayloads();
    }
  };

window.addEventListener('ActiveWorkspaceStoreSwitch', (event) => {
  globalWorkspace = event.workspace;
});

export default AnalyticsService;
