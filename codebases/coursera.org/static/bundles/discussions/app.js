import CourseMembershipStore from 'bundles/ondemand/stores/CourseMembershipStore';
import CourseScheduleStore from 'bundles/ondemand/stores/CourseScheduleStore';
import CourseStore from 'bundles/ondemand/stores/CourseStore';
import SessionStore from 'bundles/course-sessions/stores/SessionStore';
import ApplicationStore from 'bundles/ssr/stores/ApplicationStore';
import ClassmatesProfileStore from 'bundles/classmates/stores/ClassmatesProfileStore';
import NaptimeStore from 'bundles/naptimejs/stores/NaptimeStore';
import ProfileStore from 'bundles/profile/stores/ProfileStore';
import DiscussionsSearchStore from 'bundles/discussions/stores/DiscussionsSearchStore';
import SessionFilterStore from 'bundles/discussions/stores/SessionFilterStore';
import SubscriptionStore from 'bundles/discussions/stores/SubscriptionStore';
import ThreadDetailsStore from 'bundles/discussions/stores/ThreadDetailsStore';
import ThreadSettingsStore from 'bundles/discussions/stores/ThreadSettingsStore';
import ThreadsStore from 'bundles/discussions/stores/ThreadsStore';
import setupFluxibleApp from 'js/lib/setupFluxibleApp';

export default (fluxibleContext) => {
  return setupFluxibleApp(fluxibleContext, (app) => {
    app.registerStore(CourseMembershipStore);
    app.registerStore(CourseScheduleStore);
    app.registerStore(CourseStore);
    app.registerStore(SessionStore);

    app.registerStore(ApplicationStore);
    app.registerStore(ClassmatesProfileStore);
    app.registerStore(NaptimeStore);
    app.registerStore(ProfileStore);

    app.registerStore(DiscussionsSearchStore);
    app.registerStore(SessionFilterStore);
    app.registerStore(SubscriptionStore);
    app.registerStore(ThreadDetailsStore);
    app.registerStore(ThreadSettingsStore);
    app.registerStore(ThreadsStore);

    return fluxibleContext;
  });
};
