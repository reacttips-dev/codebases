import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import Session from 'bundles/catalogP/models/session';
import language from 'js/lib/language';

const Sessions = CatalogCollection.extend({
  model: Session,
  resourceName: 'sessions.v1',

  getVCSessions() {
    return new Sessions(
      this.filter(function (session: $TSFixMe) {
        return session.has('vcDetails');
      })
    );
  },

  getVCRegistrationOpenSessions() {
    return new Sessions(
      this.filter(function (session: $TSFixMe) {
        return session.has('vcDetails') && session.get('vcDetails.vcRegistrationOpen');
      })
    );
  },

  firstForLanguagePreference() {
    const isChinesePreferred =
      language.getLanguageCode() === 'zh' &&
      this.some(function (session: $TSFixMe) {
        return session.isChineseOnly();
      });

    return this.chain()
      .filter(function (session: $TSFixMe) {
        return isChinesePreferred ? session.isChineseOnly() : !session.isChineseOnly();
      })
      .first()
      .value();
  },
});

export default Sessions;
