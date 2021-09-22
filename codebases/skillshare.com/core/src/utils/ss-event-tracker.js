import URLHelpers from 'core/src/helpers/url-helpers';
import 'jquery-cookie';
import { trackEvent } from '@skillshare/ui-components/shared/helpers/track-event';

const EventTracker = {
  track(action, model = null, other = {}, uid = null) {
    if (!action) {
      return false;
    }
    other.via = URLHelpers.getParam('via');

    const deviceSessionId = $.cookie('device_session_id');
    const props = {
      action,
      model,
      other,
      uid
    };

    trackEvent(deviceSessionId, props);
  },

  classDetails(params = {}) {
    const classData = {
      parent_class_id: null,
      class_title: null,
      parent_class_title: null,
      teacher_name: null,
      subcategory: null,
      level: null,
      tags: null,
      is_enrolled: false,
      is_own_class: false,
      lesson_rank: 0,
      is_staff_pick: false,
      is_skillshare_original: false,
      is_top_teacher: false,
      publish_date: null,
    };

    if (SS.serverBootstrap.classData && SS.serverBootstrap.classData.parentClass) {
      const serverClassData = SS.serverBootstrap.classData;
      const serverParentClassData = serverClassData.parentClass;

      classData.parent_class_id = serverParentClassData.id;
      classData.parent_class_title = serverParentClassData.title;
      classData.teacher_name = serverClassData.teacherName;
      classData.subcategory = serverParentClassData.subcategory;
      classData.level = serverParentClassData.level;
      classData.tags = serverParentClassData.tags;
      classData.is_staff_pick = serverParentClassData.is_staff_pick;
      classData.is_skillshare_original = serverParentClassData.is_skillshare_produced;
      classData.is_top_teacher = serverParentClassData.is_top_teacher;
      classData.publish_date = serverParentClassData.publish_date;

      if (SS.serverBootstrap.userClassData) {
        const serverUserClassData = SS.serverBootstrap.userClassData;
        classData.is_enrolled = serverUserClassData.isEnrolled;
        classData.is_own_class = serverUserClassData.isTeacher;
        classData.lesson_rank = serverUserClassData.lessonRank || params.lessonIndex;
      }
    }
    return _.extend(classData, params);
  },

  trackingCallback() {
    function callback(event, props) {
      EventTracker.track(event, null, props);
    };

    return callback;
  },
};

export default EventTracker;
