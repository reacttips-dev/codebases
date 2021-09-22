import Utils from 'core/src/base/utils';

const RedisPublisher = {

  PUBLISH_URL: '/redis/publish',

  EVENT_VIEW: 'view',
  EVENT_PREVIEW: 'preview',
  EVENT_SAVE: 'save',


  publishParentClass(sku, eventType, pupilRequestId = null) {
    if (!pupilRequestId) {
      return;
    }

    const postData = {
      channel: 'critic:feedback',
      publishData: {
        parentClassSku: sku,
        pupilRequestId: pupilRequestId,
        eventType: eventType,
      },
    };

    Utils.ajaxRequest(this.PUBLISH_URL, {
      data: postData,
      type: 'POST',
    });
  },
};

export default RedisPublisher;

